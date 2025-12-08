/**
 * Simple logger utility with levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private minLevel: number;
  private context: string;

  constructor(context: string, minLevel: LogLevel = 'info') {
    this.context = context;
    this.minLevel = LOG_LEVELS[minLevel];
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (LOG_LEVELS[level] < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.context}] [${level.toUpperCase()}]`;

    if (data) {
      console[level === 'error' || level === 'warn' ? level : 'log'](prefix, message, data);
    } else {
      console[level === 'error' || level === 'warn' ? level : 'log'](prefix, message);
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}
