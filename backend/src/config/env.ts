import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Variable de entorno recomendada no definida: ${envVar}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'agromind_db',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'agromind_dev_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'agromind_refresh_dev_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  ml: {
    serviceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || '30000', 10),
  },

  cors: {
    origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  logs: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || 'logs',
  },
} as const;
