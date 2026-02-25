import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

interface Deal {
  id: number;
  originLocationCode: string;
  destinationLocationCode: string;
  originCity: string;
  destinationCity: string;
  price: number;
  currency: string;
  departureDate: string;
  returnDate?: string | null;
  airline: string;
  discount?: number;
  isHot: boolean | number;
  createdAt: string;
  expiresAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mockDeals: Deal[] = JSON.parse(
  readFileSync(join(__dirname, '../mocks/deals.json'), 'utf-8')
);

const router = Router();

let seeded = false;

function seedDealsIfEmpty(): void {
  if (seeded) return;
  seeded = true;
  
  try {
    const db = getDb();
    const count = db.prepare('SELECT COUNT(*) as count FROM deals').get() as { count: number };
    
    if (count.count === 0) {
      const insert = db.prepare(`
        INSERT INTO deals (
          origin_location_code, destination_location_code, origin_city,
          destination_city, price, currency, departure_date, return_date,
          airline, discount, is_hot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const deal of mockDeals) {
        insert.run(
          deal.originLocationCode,
          deal.destinationLocationCode,
          deal.originCity,
          deal.destinationCity,
          deal.price,
          deal.currency,
          deal.departureDate,
          deal.returnDate,
          deal.airline,
          deal.discount,
          deal.isHot ? 1 : 0
        );
      }
      console.log('Seeded deals table with mock data');
    }
  } catch (error) {
    console.error('Failed to seed deals:', error);
    seeded = false;
  }
}

router.get('/', (req: Request, res: Response) => {
  try {
    seedDealsIfEmpty();
    const { hot, limit = 10 } = req.query;
    const db = getDb();

    let query = `
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        origin_city as originCity,
        destination_city as destinationCity,
        price,
        currency,
        departure_date as departureDate,
        return_date as returnDate,
        airline,
        discount,
        is_hot as isHot,
        created_at as createdAt,
        expires_at as expiresAt
      FROM deals
    `;

    if (hot === 'true') {
      query += ' WHERE is_hot = 1';
    }

    query += ' ORDER BY is_hot DESC, discount DESC, price ASC';
    query += ` LIMIT ${Number(limit)}`;

    const deals = db.prepare(query).all() as Deal[];

    res.json({
      success: true,
      data: deals.map(deal => ({
        ...deal,
        isHot: Boolean(deal.isHot),
      })),
      meta: { count: deals.length },
    } as ApiResponse<Deal[]>);
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch deals',
    } as ApiResponse<null>);
  }
});

router.get('/trending', (_req: Request, res: Response) => {
  try {
    seedDealsIfEmpty();
    const db = getDb();
    
    const deals = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        origin_city as originCity,
        destination_city as destinationCity,
        price,
        currency,
        departure_date as departureDate,
        return_date as returnDate,
        airline,
        discount,
        is_hot as isHot,
        created_at as createdAt,
        expires_at as expiresAt
      FROM deals
      WHERE is_hot = 1
      ORDER BY discount DESC, price ASC
      LIMIT 6
    `).all() as Deal[];

    res.json({
      success: true,
      data: deals.map(deal => ({
        ...deal,
        isHot: Boolean(deal.isHot),
      })),
      meta: { count: deals.length },
    } as ApiResponse<Deal[]>);
  } catch (error) {
    console.error('Get trending deals error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trending deals',
    } as ApiResponse<null>);
  }
});

router.get('/popular-routes', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    
    const routes = db.prepare(`
      SELECT 
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        origin_city as originCity,
        destination_city as destinationCity,
        MIN(price) as minPrice,
        currency,
        COUNT(*) as dealCount
      FROM deals
      GROUP BY origin_location_code, destination_location_code
      ORDER BY dealCount DESC, minPrice ASC
      LIMIT 8
    `).all();

    res.json({
      success: true,
      data: routes,
      meta: { count: routes.length },
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch popular routes',
    } as ApiResponse<null>);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const deal = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        origin_city as originCity,
        destination_city as destinationCity,
        price,
        currency,
        departure_date as departureDate,
        return_date as returnDate,
        airline,
        discount,
        is_hot as isHot,
        created_at as createdAt,
        expires_at as expiresAt
      FROM deals WHERE id = ?
    `).get(id) as Deal | undefined;

    if (!deal) {
      res.status(404).json({
        success: false,
        error: 'Deal not found',
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: { ...deal, isHot: Boolean(deal.isHot) },
    } as ApiResponse<Deal>);
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch deal',
    } as ApiResponse<null>);
  }
});

export default router;
