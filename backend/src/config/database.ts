import knex, { Knex } from 'knex';
import { env } from './env';

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    charset: 'utf8mb4',
    timezone: 'UTC',
  },
  pool: {
    min: env.db.poolMin,
    max: env.db.poolMax,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false,
  },
  debug: env.nodeEnv === 'development',
};

const db = knex(config);

export const testConnection = async (): Promise<void> => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Conexión a MariaDB establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MariaDB:', error);
    throw error;
  }
};

export default db;
