import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';

const mockDeals = [
  {
    id: 'deal-1',
    origin: 'JFK',
    destination: 'LHR',
    price: 389,
    currency: 'USD',
    airline: 'BA',
    departureDate: '2025-06-15',
    returnDate: '2025-06-22',
    stops: 0,
    duration: 'PT7H20M',
  },
  {
    id: 'deal-2',
    origin: 'LAX',
    destination: 'NRT',
    price: 599,
    currency: 'USD',
    airline: 'JL',
    departureDate: '2025-07-01',
    returnDate: '2025-07-15',
    stops: 0,
    duration: 'PT11H45M',
  },
  {
    id: 'deal-3',
    origin: 'ORD',
    destination: 'CDG',
    price: 449,
    currency: 'USD',
    airline: 'AF',
    departureDate: '2025-07-10',
    returnDate: '2025-07-20',
    stops: 1,
    duration: 'PT10H30M',
  },
];

vi.mock('../mocks/flights.js', () => ({
  getMockDeals: vi.fn(() => mockDeals),
}));

const createDealsRouter = () => {
  const router = Router();

  let cachedDeals: any[] | null = null;
  let cacheTime: number = 0;
  const CACHE_DURATION = 15 * 60 * 1000;

  router.get('/', async (req, res) => {
    try {
      const now = Date.now();

      if (!cachedDeals || now - cacheTime > CACHE_DURATION) {
        const { getMockDeals } = await import('../mocks/flights.js');
        cachedDeals = getMockDeals();
        cacheTime = now;
      }

      res.json({
        data: cachedDeals,
        meta: {
          count: cachedDeals.length,
          cached: now - cacheTime < 1000 ? false : true,
          cacheAge: Math.round((now - cacheTime) / 1000),
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deals' });
    }
  });

  return router;
};

describe('Deals API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/deals', createDealsRouter());
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/deals', () => {
    it('should return array of deals', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return deals with correct structure', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);

      const deal = response.body.data[0];
      expect(deal).toHaveProperty('id');
      expect(deal).toHaveProperty('origin');
      expect(deal).toHaveProperty('destination');
      expect(deal).toHaveProperty('price');
      expect(deal).toHaveProperty('currency');
      expect(deal).toHaveProperty('airline');
      expect(deal).toHaveProperty('departureDate');
      expect(deal).toHaveProperty('stops');
      expect(deal).toHaveProperty('duration');
    });

    it('should return meta with count', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('count');
      expect(response.body.meta.count).toBe(mockDeals.length);
    });

    it('should return deals with valid airport codes', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);

      response.body.data.forEach((deal: any) => {
        expect(deal.origin).toMatch(/^[A-Z]{3}$/);
        expect(deal.destination).toMatch(/^[A-Z]{3}$/);
      });
    });

    it('should return deals with valid prices', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);

      response.body.data.forEach((deal: any) => {
        expect(typeof deal.price).toBe('number');
        expect(deal.price).toBeGreaterThan(0);
      });
    });

    it('should return deals with valid duration format', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);

      response.body.data.forEach((deal: any) => {
        expect(deal.duration).toMatch(/^PT\d+H\d*M?$/);
      });
    });

    it('should include cache metadata', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('cached');
      expect(response.body.meta).toHaveProperty('cacheAge');
    });
  });
});
