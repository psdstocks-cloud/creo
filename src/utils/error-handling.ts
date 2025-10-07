/**
 * Error Handling Utilities
 * 
 * Comprehensive error classification, formatting, and recovery strategies
 * for the Creo application.
 */

// ============================================================================
// Error Types and Interfaces
// ============================================================================

export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  requestId?: string;
  url?: string;
  method?: string;
  componentStack?: string;
}

export interface ClassifiedError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError: unknown;
  context: ErrorContext;
  isRetryable: boolean;
  retryAfter?: number;
  recoveryAction?: string;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: ClassifiedError) => boolean;
}

// ============================================================================
// Error Classification
// ============================================================================

export function classifyError(error: unknown, context: ErrorContext = {}): ClassifiedError {
  const timestamp = new Date().toISOString();
  
  // Network errors
  if (isNetworkError(error)) {
    return {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message: getNetworkErrorMessage(error),
      originalError: error,
      context: { ...context, timestamp },
      isRetryable: true,
      retryAfter: 2000,
      recoveryAction: 'retry_connection'
    };
  }

  // Authentication errors
  if (isAuthError(error)) {
    return {
      type: ErrorType.AUTH,
      severity: ErrorSeverity.HIGH,
      message: getAuthErrorMessage(error),
      originalError: error,
      context: { ...context, timestamp },
      isRetryable: false,
      recoveryAction: 'redirect_to_login'
    };
  }

  // Validation errors
  if (isValidationError(error)) {
    return {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      message: getValidationErrorMessage(error),
      originalError: error,
      context: { ...context, timestamp },
      isRetryable: false,
      recoveryAction: 'fix_input'
    };
  }

  // Server errors
  if (isServerError(error)) {
    return {
      type: ErrorType.SERVER,
      severity: ErrorSeverity.HIGH,
      message: getServerErrorMessage(error),
      originalError: error,
      context: { ...context, timestamp },
      isRetryable: true,
      retryAfter: 5000,
      recoveryAction: 'retry_request'
    };
  }

  // Client errors
  if (isClientError(error)) {
    return {
      type: ErrorType.CLIENT,
      severity: ErrorSeverity.MEDIUM,
      message: getClientErrorMessage(error),
      originalError: error,
      context: { ...context, timestamp },
      isRetryable: false,
      recoveryAction: 'check_input'
    };
  }

  // Unknown errors
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: getUnknownErrorMessage(error),
    originalError: error,
    context: { ...context, timestamp },
    isRetryable: false,
    recoveryAction: 'contact_support'
  };
}

// ============================================================================
// Error Type Detection
// ============================================================================

function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === 'NetworkError' ||
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('connection')
    );
  }
  return false;
}

function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('unauthorized') ||
      error.message.includes('forbidden') ||
      error.message.includes('authentication') ||
      error.message.includes('token') ||
      error.message.includes('401') ||
      error.message.includes('403')
    );
  }
  return false;
}

function isValidationError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('validation') ||
      error.message.includes('invalid') ||
      error.message.includes('required') ||
      error.message.includes('format') ||
      error.message.includes('400')
    );
  }
  return false;
}

function isServerError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504') ||
      error.message.includes('server error') ||
      error.message.includes('internal error')
    );
  }
  return false;
}

function isClientError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('400') ||
      error.message.includes('404') ||
      error.message.includes('bad request') ||
      error.message.includes('not found')
    );
  }
  return false;
}

// ============================================================================
// Error Message Formatting
// ============================================================================

function getNetworkErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please check your internet connection and try again.';
    }
    if (error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return 'Network error occurred. Please check your connection and try again.';
  }
  return 'A network error occurred. Please try again.';
}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      return 'Your session has expired. Please sign in again.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    return 'Authentication error. Please sign in again.';
  }
  return 'Authentication failed. Please sign in again.';
}

function getValidationErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('required')) {
      return 'Please fill in all required fields.';
    }
    if (error.message.includes('format')) {
      return 'Please check the format of your input.';
    }
    if (error.message.includes('invalid')) {
      return 'Invalid input provided. Please check your data.';
    }
    return 'Validation error. Please check your input.';
  }
  return 'Invalid input. Please check your data.';
}

function getServerErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('500')) {
      return 'Server error occurred. Our team has been notified.';
    }
    if (error.message.includes('503')) {
      return 'Service temporarily unavailable. Please try again later.';
    }
    return 'Server error occurred. Please try again later.';
  }
  return 'A server error occurred. Please try again later.';
}

function getClientErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (error.message.includes('400')) {
      return 'Invalid request. Please check your input.';
    }
    return 'Request error. Please check your input.';
  }
  return 'An error occurred with your request.';
}

function getUnknownErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `An unexpected error occurred: ${error.message}`;
  }
  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// Retry Logic
// ============================================================================

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  onRetry?: (attempt: number, error: ClassifiedError) => void
): Promise<T> {
  let lastError: ClassifiedError;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const classifiedError = classifyError(error);
      lastError = classifiedError;
      
      // Check if we should retry
      if (!classifiedError.isRetryable || attempt === config.maxAttempts) {
        break;
      }
      
      // Check custom retry condition
      if (config.retryCondition && !config.retryCondition(classifiedError)) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelay
      );
      
      // Notify about retry
      onRetry?.(attempt, classifiedError);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// ============================================================================
// Error Recovery Strategies
// ============================================================================

export function getRecoveryAction(error: ClassifiedError): string {
  switch (error.recoveryAction) {
    case 'retry_connection':
      return 'Check your internet connection and try again.';
    case 'redirect_to_login':
      return 'Please sign in to continue.';
    case 'fix_input':
      return 'Please correct the highlighted fields and try again.';
    case 'retry_request':
      return 'The request failed. You can try again.';
    case 'check_input':
      return 'Please verify your input and try again.';
    case 'contact_support':
      return 'If the problem persists, please contact support.';
    default:
      return 'Please try again or contact support if the problem persists.';
  }
}

export function shouldShowRetryButton(error: ClassifiedError): boolean {
  return error.isRetryable && error.severity !== ErrorSeverity.CRITICAL;
}

export function shouldShowContactSupport(error: ClassifiedError): boolean {
  return error.severity === ErrorSeverity.CRITICAL || 
         error.type === ErrorType.UNKNOWN ||
         error.recoveryAction === 'contact_support';
}

// ============================================================================
// Error Reporting
// ============================================================================

export function reportError(error: ClassifiedError, additionalContext?: Record<string, unknown>): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Report');
    console.error('Error Type:', error.type);
    console.error('Severity:', error.severity);
    console.error('Message:', error.message);
    console.error('Context:', error.context);
    console.error('Original Error:', error.originalError);
    if (additionalContext) {
      console.error('Additional Context:', additionalContext);
    }
    console.groupEnd();
  }
  
  // In production, you would send to error monitoring service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error monitoring service
    console.error('Production error:', error);
  }
}

// ============================================================================
// Error Boundary Helpers
// ============================================================================

export function createErrorHandler(context: ErrorContext) {
  return (error: unknown, errorInfo?: { componentStack?: string | null }) => {
    const classifiedError = classifyError(error, context);
    
    // Add component stack if available
    if (errorInfo?.componentStack) {
      classifiedError.context.componentStack = errorInfo.componentStack;
    }
    
    // Report the error
    reportError(classifiedError);
    
    return classifiedError;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

export function isRetryableError(error: unknown): boolean {
  const classified = classifyError(error);
  return classified.isRetryable;
}

export function getErrorSeverity(error: unknown): ErrorSeverity {
  const classified = classifyError(error);
  return classified.severity;
}

export function formatErrorForUser(error: unknown, context?: ErrorContext): string {
  const classified = classifyError(error, context);
  return classified.message;
}

export function getErrorType(error: unknown): ErrorType {
  const classified = classifyError(error);
  return classified.type;
}
