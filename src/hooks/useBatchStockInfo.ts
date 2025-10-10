import { useQueries, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'
import { queryKeys } from '@/lib/query-keys'
import { ParsedStockInput } from '@/lib/stock-parse'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'

export interface BatchStockInfoResult {
  input: ParsedStockInput
  data?: any
  isLoading: boolean
  error?: Error | null
  isSuccess: boolean
}

/**
 * Fetch stock info for multiple items in parallel
 * Uses React Query's useQueries for optimal batching and caching
 */
export function useBatchStockInfo(
  inputs: ParsedStockInput[],
  options: {
    enabled?: boolean
    staleTime?: number
    retry?: number
  } = {}
) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = 2
  } = options

  // Only process valid inputs
  const validInputs = inputs.filter(input => input.isValid && input.site && input.id)
  
  // Create parallel queries for each valid input
  const queries = validInputs.map((input) => ({
    queryKey: queryKeys.stockInfo(input.site, input.id, input.url),
    queryFn: () => nehtwClient.getStockInfo(input.site, input.id, input.url),
    enabled: enabled && !!user,
    staleTime,
    retry: (failureCount: number, error: any) => {
      // Don't retry on authentication or rate limit errors
      if (error?.message?.includes('401') || error?.message?.includes('429')) {
        return false
      }
      return failureCount < retry
    },
    retryDelay: (attemptIndex: number) => {
      // Exponential backoff with jitter to respect rate limits
      const baseDelay = Math.min(1000 * Math.pow(2, attemptIndex), 10000)
      const jitter = Math.random() * 1000
      return baseDelay + jitter
    },
    meta: {
      input, // Store original input for result mapping
    }
  }))

  // Execute all queries in parallel
  const results = useQueries({
    queries,
    combine: (results) => {
      // Map results back to inputs, including invalid ones
      const mappedResults: BatchStockInfoResult[] = inputs.map(input => {
        if (!input.isValid || !input.site || !input.id) {
          return {
            input,
            isLoading: false,
            error: new Error(input.error || 'Invalid input'),
            isSuccess: false
          }
        }

        // Find corresponding query result
        const queryResult = results.find(result => 
          result.meta?.input?.raw === input.raw
        )

        if (!queryResult) {
          return {
            input,
            isLoading: false,
            error: new Error('Query not found'),
            isSuccess: false
          }
        }

        return {
          input,
          data: queryResult.data,
          isLoading: queryResult.isLoading,
          error: queryResult.error,
          isSuccess: queryResult.isSuccess
        }
      })

      // Calculate summary statistics
      const isLoading = results.some(result => result.isLoading)
      const hasErrors = results.some(result => result.error)
      const successCount = results.filter(result => result.isSuccess).length
      const totalQueries = validInputs.length

      return {
        data: mappedResults,
        isLoading,
        hasErrors,
        successCount,
        totalQueries,
        // Legacy support for existing code patterns
        results: mappedResults
      }
    }
  })

  // Enhanced refetch function that handles all queries
  const refetch = async () => {
    const promises = validInputs.map(input => {
      const queryKey = queryKeys.stockInfo(input.site, input.id, input.url)
      return queryClient.refetchQueries({ queryKey })
    })
    
    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.error('Batch refetch failed:', error)
    }
  }

  // Invalidate all related queries
  const invalidateAll = () => {
    validInputs.forEach(input => {
      const queryKey = queryKeys.stockInfo(input.site, input.id, input.url)
      queryClient.invalidateQueries({ queryKey })
    })
  }

  return {
    ...results,
    refetch,
    invalidateAll,
    // Helper methods for bulk actions
    getValidResults: () => results.data.filter(r => r.isSuccess && r.data),
    getErrorResults: () => results.data.filter(r => r.error),
    getLoadingResults: () => results.data.filter(r => r.isLoading),
    getTotalCost: () => results.data
      .filter(r => r.isSuccess && r.data)
      .reduce((total, r) => total + (r.data?.cost || 0), 0),
    // Statistics
    stats: {
      total: inputs.length,
      valid: validInputs.length,
      success: results.successCount,
      loading: results.isLoading,
      errors: results.data.filter(r => r.error).length
    }
  }
}

/**
 * Hook for managing batch order creation
 */
export function useBatchStockOrder() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  const createBatchOrder = async (items: BatchStockInfoResult[]) => {
    const validItems = items.filter(item => 
      item.isSuccess && item.data && item.input.isValid
    )
    
    if (validItems.length === 0) {
      throw new Error('No valid items to order')
    }

    const orderPromises = validItems.map(async (item) => {
      try {
        const taskId = await nehtwClient.createOrder(
          item.input.site,
          item.input.id,
          item.input.url
        )
        
        return {
          input: item.input,
          taskId,
          success: true
        }
      } catch (error: any) {
        return {
          input: item.input,
          error: error.message,
          success: false
        }
      }
    })

    const results = await Promise.allSettled(orderPromises)
    
    // Process results
    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(value => value.success)
    
    const failed = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(value => !value.success)

    // Invalidate orders cache
    queryClient.invalidateQueries({ queryKey: queryKeys.orders() })

    // Show summary toast
    if (successful.length > 0) {
      success(
        `${successful.length} Orders Created`,
        `Successfully created ${successful.length} orders${
          failed.length > 0 ? `, ${failed.length} failed` : ''
        }`
      )
    }

    if (failed.length > 0 && successful.length === 0) {
      showError(
        'All Orders Failed',
        `${failed.length} orders could not be created`
      )
    }

    return {
      successful,
      failed,
      total: validItems.length
    }
  }

  return {
    createBatchOrder
  }
}

/**
 * Hook for batch download link generation
 */
export function useBatchDownloadLinks() {
  const generateBatchLinks = async (taskIds: string[]) => {
    const linkPromises = taskIds.map(async (taskId) => {
      try {
        const result = await nehtwClient.getDownloadLink(taskId)
        return {
          taskId,
          downloadLink: result.url,
          success: true
        }
      } catch (error: any) {
        return {
          taskId,
          error: error.message,
          success: false
        }
      }
    })

    const results = await Promise.allSettled(linkPromises)
    
    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(value => value.success)
    
    const failed = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(value => !value.success)

    return {
      successful,
      failed,
      total: taskIds.length
    }
  }

  return {
    generateBatchLinks
  }
}
