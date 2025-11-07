import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Rutas
import menuRoutes from './routes/menuRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sedesRoutes from './routes/sedesRoutes.js';
import mesasRoutes from './routes/mesasRoutes.js';

// Middlewares
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// Middlewares base
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
// Evitar respuestas 304 por ETag que rompen el consumo con fetch
app.disable('etag');

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mvc-backend', env: process.env.NODE_ENV || 'dev' });
});

// Montar rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/sedes', sedesRoutes);
app.use('/api/mesas', mesasRoutes);

// Handler de errores al final
app.use(errorHandler);

export default app;