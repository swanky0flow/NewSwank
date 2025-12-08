import { Logger } from './logger';

const logger = new Logger('errors');

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error handler for promises and async functions
 */
export function handleAsync(fn: () => Promise<void>) {
  return async () => {
    try {
      await fn();
    } catch (err) {
      logger.error('Async operation failed:', err);
      if (err instanceof AppError) {
        logger.error(`[${err.code}]`, { message: err.message, status: err.statusCode });
      }
      throw err;
    }
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        logger.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms`, { error: lastError.message });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
