// Hierarchical query keys for efficient invalidation
export const queryKeys = {
  all: ['creo'] as const,
  
  // NEHTW API Keys
  nehtw: () => [...queryKeys.all, 'nehtw'] as const,
  
  // Stock Media Keys
  stockSites: () => [...queryKeys.nehtw(), 'stock-sites'] as const,
  stockInfo: (site: string, id: string, url?: string) => 
    [...queryKeys.nehtw(), 'stock-info', { site, id, url }] as const,
  
  // Orders Keys
  orders: () => [...queryKeys.nehtw(), 'orders'] as const,
  order: (taskId: string) => [...queryKeys.orders(), taskId] as const,
  orderStatus: (taskId: string) => [...queryKeys.order(taskId), 'status'] as const,
  downloadLink: (taskId: string) => [...queryKeys.order(taskId), 'download'] as const,
  
  // AI Generation Keys
  aiJobs: () => [...queryKeys.nehtw(), 'ai-jobs'] as const,
  aiJob: (jobId: string) => [...queryKeys.aiJobs(), jobId] as const,
  aiResult: (jobId: string) => [...queryKeys.aiJob(jobId), 'result'] as const,
  
  // User Account Keys
  user: () => [...queryKeys.nehtw(), 'user'] as const,
  userBalance: () => [...queryKeys.user(), 'balance'] as const,
} as const
