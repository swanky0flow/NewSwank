import { describe, it, expect } from 'vitest';
import { Logger } from '../lib/logger';

describe('Logger', () => {
  const logger = new Logger('test');

  it('should create logger with context', () => {
    expect(logger).toBeDefined();
  });

  it('should log at different levels', () => {
    expect(() => {
      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');
    }).not.toThrow();
  });

  it('should log with data', () => {
    expect(() => {
      logger.info('message with data', { key: 'value' });
    }).not.toThrow();
  });
});
