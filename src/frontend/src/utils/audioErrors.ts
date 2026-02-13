/**
 * Normalizes thrown values into stable error messages for user-facing diagnostics.
 * Provides dev-only logging with stack traces while staying production-safe.
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function logErrorDetails(error: unknown, context: string): void {
  const message = getErrorMessage(error);
  
  // Always log the message
  console.error(`[${context}] ${message}`);
  
  // In development, log the full error with stack trace
  if (import.meta.env.DEV && error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
}
