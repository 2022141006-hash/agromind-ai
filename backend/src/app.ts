import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { env } from './config/env';
import { testConnection } from './config/database';
import logger from './config/logger';
import { errorMiddleware } from './middlewares/error.middleware';

// Routes
import authRoutes from './modules/auth/auth.routes';
import recommendationsRoutes from './modules/recommendations/recommendations.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Activar la confianza de proxy para Render (soluciona rate-limit)
app.set('trust proxy', 1);

// ─── Security Middlewares ─────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => callback(null, true), // Permite cualquier origen dinámicamente manteniendo soporte para credenciales
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  message: { success: false, message: 'Demasiadas solicitudes. Inténtelo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ─── General Middlewares ──────────────────────────────────────
app.use(compression());
app.use(morgan('dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'AgroMind AI - Backend API',
    version: '1.0.0',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────
const apiPrefix = `/api/${env.apiVersion}`;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/recommendations`, recommendationsRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`,
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    await testConnection();
    
    app.listen(env.port, () => {
      logger.info(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🌱  AgroMind AI - Backend API                  ║
  ║   📡  Puerto: ${env.port}                              ║
  ║   🔗  http://localhost:${env.port}/api/v1              ║
  ║   📦  Entorno: ${env.nodeEnv}                    ║
  ║   🤖  ML Service: ${env.ml.serviceUrl}      ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
