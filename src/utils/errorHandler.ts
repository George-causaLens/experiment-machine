// Error handling utilities for The Experiment Machine
export class ErrorHandler {
  private static readonly MAX_ERROR_LOG_SIZE = 100;
  private static errorLog: Array<{ timestamp: Date; error: any; context: string }> = [];

  /**
   * Log an error with context
   */
  static logError(error: any, context: string = 'Unknown'): void {
    const errorEntry = {
      timestamp: new Date(),
      error: this.sanitizeError(error),
      context
    };

    this.errorLog.push(errorEntry);

    // Keep log size manageable
    if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context}]`, error);
    }

    // In production, you might want to send to a logging service
    // this.sendToLoggingService(errorEntry);
  }

  /**
   * Sanitize error object to remove sensitive information
   */
  private static sanitizeError(error: any): any {
    if (!error) return error;

    const sanitized = { ...error };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'access_token',
      'refresh_token',
      'api_key',
      'secret',
      'key',
      'auth',
      'authorization'
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // Sanitize nested objects
    if (sanitized.data) {
      sanitized.data = this.sanitizeError(sanitized.data);
    }

    if (sanitized.error) {
      sanitized.error = this.sanitizeError(sanitized.error);
    }

    return sanitized;
  }

  /**
   * Handle Supabase errors
   */
  static handleSupabaseError(error: any, operation: string): string {
    this.logError(error, `Supabase ${operation}`);

    if (!error) {
      return 'An unexpected error occurred';
    }

    // Handle specific Supabase error codes
    switch (error.code) {
      case 'PGRST116':
        return 'Database connection error. Please try again.';
      case '42501':
        return 'Access denied. You don\'t have permission to perform this action.';
      case '23505':
        return 'This record already exists.';
      case '23503':
        return 'Cannot delete this record as it is referenced by other data.';
      case '42P01':
        return 'Database table not found. Please contact support.';
      case 'auth/user-not-found':
        return 'User not found. Please check your credentials.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-credentials':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: any): string {
    this.logError(error, 'Network Error');

    if (error.code === 'NETWORK_ERROR') {
      return 'Network connection error. Please check your internet connection.';
    }

    if (error.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.status === 403) {
      return 'Access forbidden. You don\'t have permission to access this resource.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    if (error.status >= 400 && error.status < 500) {
      return 'Request error. Please check your input and try again.';
    }

    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }

    return 'Network error. Please try again.';
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(errors: string[]): string {
    if (!errors || errors.length === 0) {
      return 'Validation error occurred.';
    }

    if (errors.length === 1) {
      return errors[0];
    }

    return `Multiple validation errors: ${errors.join(', ')}`;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any, context: string = 'Unknown'): string {
    // Handle Supabase errors
    if (error?.code && error.code.startsWith('auth/')) {
      return this.handleSupabaseError(error, context);
    }

    // Handle network errors
    if (error?.status || error?.code === 'NETWORK_ERROR') {
      return this.handleNetworkError(error);
    }

    // Handle validation errors
    if (Array.isArray(error)) {
      return this.handleValidationError(error);
    }

    // Handle generic errors
    if (error?.message) {
      return error.message;
    }

    // Fallback
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: any): boolean {
    if (!error) return false;

    // Network errors are usually retryable
    if (error.code === 'NETWORK_ERROR') return true;

    // 5xx server errors are retryable
    if (error.status >= 500 && error.status < 600) return true;

    // Rate limiting errors are retryable after delay
    if (error.code === 'auth/too-many-requests') return true;

    // Database connection errors are retryable
    if (error.code === 'PGRST116') return true;

    return false;
  }

  /**
   * Get retry delay for retryable errors
   */
  static getRetryDelay(error: any): number {
    if (error.code === 'auth/too-many-requests') {
      return 60000; // 1 minute for rate limiting
    }

    if (error.code === 'PGRST116') {
      return 5000; // 5 seconds for database connection
    }

    if (error.status >= 500) {
      return 10000; // 10 seconds for server errors
    }

    return 2000; // 2 seconds default
  }

  /**
   * Get error log for debugging
   */
  static getErrorLog(): Array<{ timestamp: Date; error: any; context: string }> {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Send error to logging service (placeholder for production)
   */
  private static sendToLoggingService(errorEntry: { timestamp: Date; error: any; context: string }): void {
    // In production, you would send this to a logging service like Sentry, LogRocket, etc.
    // For now, we'll just log to console
    console.log('Error logged:', errorEntry);
  }
} 