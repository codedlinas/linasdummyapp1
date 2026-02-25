import express from 'express';
import cors from 'cors';
import { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import { searchMockFlights, getMockDeals } from '../mocks/flights.js';

export function createTestApp(db: Database.Database) {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  const dbFunctions = createDbFunctions(db);
  
  const apiRouter = Router();
  apiRouter.use('/flights', createFlightsRouter(dbFunctions));
  apiRouter.use('/deals', createDealsRouter());
  apiRouter.use('/alerts', createAlertsRouter(dbFunctions));
  apiRouter.use('/history', createHistoryRouter(dbFunctions));
  
  app.use('/api', apiRouter);
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  
  return app;
}

function createDbFunctions(db: Database.Database) {
  return {
    createAlert: (origin: string, destination: string, maxPrice: number, email: string) => {
      const stmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), maxPrice, email);
      const row = db.prepare(`SELECT * FROM alerts WHERE id = ?`).get(result.lastInsertRowid) as any;
      return {
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      };
    },
    
    getAlertById: (id: number) => {
      const row = db.prepare(`SELECT * FROM alerts WHERE id = ?`).get(id) as any;
      if (!row) return undefined;
      return {
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      };
    },
    
    getAllAlerts: (email?: string) => {
      let rows: any[];
      if (email) {
        rows = db.prepare(`SELECT * FROM alerts WHERE email = ? ORDER BY created_at DESC`).all(email) as any[];
      } else {
        rows = db.prepare(`SELECT * FROM alerts ORDER BY created_at DESC`).all() as any[];
      }
      return rows.map(row => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      }));
    },
    
    deleteAlert: (id: number): boolean => {
      const result = db.prepare(`DELETE FROM alerts WHERE id = ?`).run(id);
      return result.changes > 0;
    },
    
    addSearchHistory: (
      origin: string,
      destination: string,
      departureDate: string,
      returnDate: string | null,
      adults: number,
      resultCount: number
    ) => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), departureDate, returnDate, adults, resultCount);
      const row = db.prepare(`SELECT * FROM search_history WHERE id = ?`).get(result.lastInsertRowid) as any;
      return {
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        departureDate: row.departure_date,
        returnDate: row.return_date,
        adults: row.adults,
        resultCount: row.result_count,
        searchedAt: row.searched_at,
      };
    },
    
    getRecentSearchHistory: (limit: number = 20) => {
      const rows = db.prepare(`SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?`).all(limit) as any[];
      return rows.map(row => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        departureDate: row.departure_date,
        returnDate: row.return_date,
        adults: row.adults,
        resultCount: row.result_count,
        searchedAt: row.searched_at,
      }));
    },
  };
}

type DbFunctions = ReturnType<typeof createDbFunctions>;

function createFlightsRouter(dbFunctions: DbFunctions) {
  const router = Router();
  
  router.get('/search', async (req: Request, res: Response) => {
    try {
      const { origin, destination, departureDate, returnDate, adults } = req.query;
      
      if (!origin || !destination || !departureDate) {
        return res.status(400).json({
          error: 'Missing required parameters: origin, destination, and departureDate are required',
        });
      }
      
      const originCode = (origin as string).toUpperCase();
      const destCode = (destination as string).toUpperCase();
      
      if (originCode.length !== 3 || destCode.length !== 3) {
        return res.status(400).json({
          error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
        });
      }
      
      const results = searchMockFlights(
        originCode,
        destCode,
        departureDate as string,
        (returnDate as string) || null,
        parseInt(adults as string) || 1
      );
      
      dbFunctions.addSearchHistory(
        originCode,
        destCode,
        departureDate as string,
        (returnDate as string) || null,
        parseInt(adults as string) || 1,
        results.data.length
      );
      
      res.json(results);
    } catch (error) {
      console.error('Flight search error:', error);
      res.status(500).json({ error: 'Failed to search flights' });
    }
  });
  
  router.get('/status', (req: Request, res: Response) => {
    res.json({
      mode: 'mock',
      message: 'Using mock data (set AMADEUS_API_KEY and AMADEUS_API_SECRET for live data)',
    });
  });
  
  return router;
}

function createDealsRouter() {
  const router = Router();
  
  router.get('/', (req: Request, res: Response) => {
    try {
      const deals = getMockDeals();
      res.json({
        data: deals,
        meta: {
          count: deals.length,
          cached: false,
          cacheAge: 0,
        },
      });
    } catch (error) {
      console.error('Deals error:', error);
      res.status(500).json({ error: 'Failed to fetch deals' });
    }
  });
  
  return router;
}

function createAlertsRouter(dbFunctions: DbFunctions) {
  const router = Router();
  
  router.post('/', (req: Request, res: Response) => {
    try {
      const { origin, destination, maxPrice, email } = req.body;
      
      if (!origin || !destination || !maxPrice || !email) {
        return res.status(400).json({
          error: 'Missing required fields: origin, destination, maxPrice, and email are required',
        });
      }
      
      const originCode = origin.toUpperCase();
      const destCode = destination.toUpperCase();
      
      if (originCode.length !== 3 || destCode.length !== 3) {
        return res.status(400).json({
          error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
        });
      }
      
      const price = parseFloat(maxPrice);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          error: 'Invalid maxPrice. Must be a positive number.',
        });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email address.',
        });
      }
      
      const alert = dbFunctions.createAlert(originCode, destCode, price, email);
      res.status(201).json(alert);
    } catch (error) {
      console.error('Create alert error:', error);
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });
  
  router.get('/', (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      const alerts = dbFunctions.getAllAlerts(email as string | undefined);
      res.json({
        data: alerts,
        meta: {
          count: alerts.length,
        },
      });
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });
  
  router.delete('/:id', (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid alert ID' });
      }
      
      const alert = dbFunctions.getAlertById(id);
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      const deleted = dbFunctions.deleteAlert(id);
      
      if (deleted) {
        res.json({ success: true, message: 'Alert deleted' });
      } else {
        res.status(404).json({ error: 'Alert not found' });
      }
    } catch (error) {
      console.error('Delete alert error:', error);
      res.status(500).json({ error: 'Failed to delete alert' });
    }
  });
  
  return router;
}

function createHistoryRouter(dbFunctions: DbFunctions) {
  const router = Router();
  
  router.get('/', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const history = dbFunctions.getRecentSearchHistory(Math.min(limit, 100));
      
      res.json({
        data: history,
        meta: {
          count: history.length,
        },
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Failed to fetch search history' });
    }
  });
  
  return router;
}
