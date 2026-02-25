import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import dealsRouter from '../routes/deals.js';

vi.mock('../mocks/flights.js', () => ({
  getMockDeals: vi.fn().mockReturnValue([
    {
      id: 'deal-1',
      origin: 'JFK',
      destination: 'LHR',
      price: 389,
      currency: 'USD',
      airline: 'BA',
      departureDate: '2026-03-15',
      returnDate: '2026-03-22',
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
      departureDate: '2026-03-18',
      returnDate: '2026-03-25',
      stops: 0,
      duration: 'PT11H45M',
    },
    {
      id: 'deal-3',
      origin: 'SFO',
      destination: 'CDG',
      price: 449,
      currency: 'USD',
      airline: 'AF',
      departureDate: '2026-03-20',
      returnDate: '2026-03-27',
      stops: 0,
      duration: 'PT10H30M',
    },
  ]),
}));

const app = express();
app.use(express.json());
app.use('/api/deals', dealsRouter);

describe('Deals API', () => {
  describe('GET /api/deals', () => {
    it('returns an array of deals', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('returns deals with correct structure', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);

      const deal = response.body.data[0];
      expect(deal.id).toBeDefined();
      expect(deal.origin).toBeDefined();
      expect(deal.destination).toBeDefined();
      expect(deal.price).toBeDefined();
      expect(deal.currency).toBeDefined();
      expect(deal.airline).toBeDefined();
      expect(deal.departureDate).toBeDefined();
      expect(deal.duration).toBeDefined();
      expect(typeof deal.stops).toBe('number');
    });

    it('returns meta information with count', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.count).toBe(response.body.data.length);
    });

    it('returns deals with valid origin and destination codes', async () => {
      const response = await request(app).get('/api/deals');

      response.body.data.forEach((deal: any) => {
        expect(deal.origin).toMatch(/^[A-Z]{3}$/);
        expect(deal.destination).toMatch(/^[A-Z]{3}$/);
      });
    });

    it('returns deals with positive prices', async () => {
      const response = await request(app).get('/api/deals');

      response.body.data.forEach((deal: any) => {
        expect(deal.price).toBeGreaterThan(0);
      });
    });

    it('returns deals with valid currency code', async () => {
      const response = await request(app).get('/api/deals');

      response.body.data.forEach((deal: any) => {
        expect(deal.currency).toBe('USD');
      });
    });
  });
});
