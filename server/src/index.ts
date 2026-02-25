import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initializeDatabase, closeDatabase } from './db.js';
import flightsRouter from './routes/flights.js';
import dealsRouter from './routes/deals.js';
import alertsRouter from './routes/alerts.js';
import historyRouter from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

initializeDatabase();

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'FlyDeal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use('/api/flights', flightsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/history', historyRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🛫 FlyDeal API Server                            ║
║                                                    ║
║   Running on: http://localhost:${PORT}               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
║                                                    ║
║   Endpoints:                                       ║
║   - GET  /api/health         Health check          ║
║   - GET  /api/flights/search Flight search         ║
║   - GET  /api/flights/status API status            ║
║   - GET  /api/deals          Trending deals        ║
║   - POST /api/alerts         Create alert          ║
║   - GET  /api/alerts         List alerts           ║
║   - DELETE /api/alerts/:id   Delete alert          ║
║   - GET  /api/history        Search history        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

const shutdown = () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    closeDatabase();
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
