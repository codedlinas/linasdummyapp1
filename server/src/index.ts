import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║           FlyDeal API Server Started              ║
╠═══════════════════════════════════════════════════╣
║  Port: ${PORT}                                        ║
║  Mode: ${process.env.AMADEUS_API_KEY ? 'LIVE' : 'MOCK'}                                        ║
╚═══════════════════════════════════════════════════╝

Available endpoints:
  GET  /api/flights/search  - Search flights
  GET  /api/flights/status  - Check API status
  GET  /api/deals           - Get trending deals
  POST /api/alerts          - Create price alert
  GET  /api/alerts          - List price alerts
  DELETE /api/alerts/:id    - Delete alert
  GET  /api/history         - Get search history
  `);
});

export default app;
