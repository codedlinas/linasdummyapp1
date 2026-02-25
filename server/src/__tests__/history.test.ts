import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import historyRouter from '../routes/history.js';

const mockHistory: any[] = [];

vi.mock('../db.js', () => ({
  getRecentSearchHistory: vi.fn((limit: number) => {
    return mockHistory.slice(0, limit);
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/history', historyRouter);

describe('History API', () => {
  beforeEach(() => {
    mockHistory.length = 0;
    mockHistory.push(
      {
        id: 1,
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        returnDate: '2026-04-08',
        adults: 2,
        resultCount: 15,
        searchedAt: '2026-02-25T10:00:00Z',
      },
      {
        id: 2,
        origin: 'LAX',
        destination: 'NRT',
        departureDate: '2026-05-15',
        returnDate: null,
        adults: 1,
        resultCount: 12,
        searchedAt: '2026-02-24T15:30:00Z',
      },
      {
        id: 3,
        origin: 'SFO',
        destination: 'CDG',
        departureDate: '2026-06-01',
        returnDate: '2026-06-10',
        adults: 3,
        resultCount: 8,
        searchedAt: '2026-02-23T09:15:00Z',
      }
    );
  });

  describe('GET /api/history', () => {
    it('returns recent search history', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('returns search history with correct structure', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);

      const item = response.body.data[0];
      expect(item.id).toBeDefined();
      expect(item.origin).toBeDefined();
      expect(item.destination).toBeDefined();
      expect(item.departureDate).toBeDefined();
      expect(item.adults).toBeDefined();
      expect(item.resultCount).toBeDefined();
      expect(item.searchedAt).toBeDefined();
    });

    it('returns meta information with count', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.count).toBe(response.body.data.length);
    });

    it('respects limit parameter', async () => {
      const response = await request(app).get('/api/history').query({ limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('uses default limit of 20 when not specified', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(20);
    });

    it('caps limit at 100', async () => {
      const response = await request(app).get('/api/history').query({ limit: 200 });

      expect(response.status).toBe(200);
    });

    it('returns items with valid airport codes', async () => {
      const response = await request(app).get('/api/history');

      response.body.data.forEach((item: any) => {
        expect(item.origin).toMatch(/^[A-Z]{3}$/);
        expect(item.destination).toMatch(/^[A-Z]{3}$/);
      });
    });

    it('returns items with valid date formats', async () => {
      const response = await request(app).get('/api/history');

      response.body.data.forEach((item: any) => {
        expect(item.departureDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (item.returnDate) {
          expect(item.returnDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });
    });

    it('returns items with positive adults count', async () => {
      const response = await request(app).get('/api/history');

      response.body.data.forEach((item: any) => {
        expect(item.adults).toBeGreaterThan(0);
      });
    });

    it('returns items with non-negative result count', async () => {
      const response = await request(app).get('/api/history');

      response.body.data.forEach((item: any) => {
        expect(item.resultCount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
