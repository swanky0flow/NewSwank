import { Logger } from './logger';

const logger = new Logger('env');

/**
 * Environment configuration with validation
 */
export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  DB_PATH: string;
  OPENAI_API_KEY?: string;
  AMAZON_PAAPI_REGION?: string;
  AMAZON_PAAPI_KEY?: string;
  AMAZON_PAAPI_SECRET?: string;
  AUTO_PUBLISH_SCHEDULE?: string;
}

/**
 * Validate and normalize environment variables
 */
export function loadEnv(): EnvConfig {
  const env = process.env;

  const config: EnvConfig = {
    NODE_ENV: (env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    LOG_LEVEL: (env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
    DB_PATH: env.DB_PATH || 'data/app.db',
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    AMAZON_PAAPI_REGION: env.AMAZON_PAAPI_REGION,
    AMAZON_PAAPI_KEY: env.AMAZON_PAAPI_KEY,
    AMAZON_PAAPI_SECRET: env.AMAZON_PAAPI_SECRET,
    AUTO_PUBLISH_SCHEDULE: env.AUTO_PUBLISH_SCHEDULE || '0 2 * * *',
  };

  // Validate required keys for production
  if (config.NODE_ENV === 'production') {
    const required = ['OPENAI_API_KEY'];
    const missing = required.filter((key) => !config[key as keyof EnvConfig]);

    if (missing.length > 0) {
      logger.error(`Missing required environment variables: ${missing.join(', ')}`);
      throw new Error(`Missing required env vars: ${missing.join(', ')}`);
    }
  }

  // Log loaded config (without secrets)
  const safeConfig = { ...config };
  if (safeConfig.OPENAI_API_KEY) safeConfig.OPENAI_API_KEY = '***';
  if (safeConfig.AMAZON_PAAPI_KEY) safeConfig.AMAZON_PAAPI_KEY = '***';
  if (safeConfig.AMAZON_PAAPI_SECRET) safeConfig.AMAZON_PAAPI_SECRET = '***';

  logger.info('Environment config loaded:', safeConfig);
  return config;
}

// Load config on import
export const ENV = loadEnv();
