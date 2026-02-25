import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db.js';
import flightsRouter from './routes/flights.js';
import alertsRouter from './routes/alerts.js';
import dealsRouter from './routes/deals.js';
import historyRouter from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

initializeDatabase();

app.use('/api/flights', flightsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/history', historyRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`FlyDeal server running on http://localhost:${PORT}`);
});

export default app;
