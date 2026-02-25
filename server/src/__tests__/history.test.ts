import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';

let mockHistory: any[] = [];

vi.mock('../db.js', () => ({
  getRecentSearchHistory: vi.fn((limit: number) => {
    return mockHistory.slice(0, limit);
  }),
}));

const createHistoryRouter = () => {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const { getRecentSearchHistory } = await import('../db.js');
      const history = getRecentSearchHistory(Math.min(limit, 100));

      res.json({
        data: history,
        meta: {
          count: history.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch search history' });
    }
  });

  return router;
};

describe('History API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/history', createHistoryRouter());
  });

  beforeEach(() => {
    mockHistory = [
      {
        id: 1,
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2025-06-15',
        returnDate: '2025-06-22',
        adults: 2,
        resultCount: 15,
        searchedAt: '2025-03-10T10:30:00Z',
      },
      {
        id: 2,
        origin: 'LAX',
        destination: 'NRT',
        departureDate: '2025-07-01',
        returnDate: null,
        adults: 1,
        resultCount: 12,
        searchedAt: '2025-03-09T14:20:00Z',
      },
      {
        id: 3,
        origin: 'ORD',
        destination: 'CDG',
        departureDate: '2025-08-10',
        returnDate: '2025-08-20',
        adults: 3,
        resultCount: 20,
        searchedAt: '2025-03-08T09:15:00Z',
      },
    ];
    vi.clearAllMocks();
  });

  describe('GET /api/history', () => {
    it('should return search history', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return history with correct structure', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);

      const historyItem = response.body.data[0];
      expect(historyItem).toHaveProperty('id');
      expect(historyItem).toHaveProperty('origin');
      expect(historyItem).toHaveProperty('destination');
      expect(historyItem).toHaveProperty('departureDate');
      expect(historyItem).toHaveProperty('returnDate');
      expect(historyItem).toHaveProperty('adults');
      expect(historyItem).toHaveProperty('resultCount');
      expect(historyItem).toHaveProperty('searchedAt');
    });

    it('should return meta with count', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('count');
      expect(response.body.meta.count).toBe(3);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/history')
        .query({ limit: '2' });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should cap limit at 100', async () => {
      const { getRecentSearchHistory } = await import('../db.js');
      
      await request(app)
        .get('/api/history')
        .query({ limit: '200' });

      expect(getRecentSearchHistory).toHaveBeenCalledWith(100);
    });

    it('should use default limit of 20', async () => {
      const { getRecentSearchHistory } = await import('../db.js');
      
      await request(app).get('/api/history');

      expect(getRecentSearchHistory).toHaveBeenCalledWith(20);
    });

    it('should return empty array when no history exists', async () => {
      mockHistory = [];

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.count).toBe(0);
    });

    it('should include one-way searches (null returnDate)', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);

      const oneWaySearch = response.body.data.find(
        (h: any) => h.returnDate === null
      );
      expect(oneWaySearch).toBeDefined();
      expect(oneWaySearch.origin).toBe('LAX');
      expect(oneWaySearch.destination).toBe('NRT');
    });

    it('should have valid airport codes', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);

      response.body.data.forEach((item: any) => {
        expect(item.origin).toMatch(/^[A-Z]{3}$/);
        expect(item.destination).toMatch(/^[A-Z]{3}$/);
      });
    });
  });
});
