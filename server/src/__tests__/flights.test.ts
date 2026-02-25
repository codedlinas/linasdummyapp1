import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createTestApp } from './testApp.js';

describe('Flights API', () => {
  let app: ReturnType<typeof createTestApp>;
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        max_price REAL NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_date TEXT NOT NULL,
        return_date TEXT,
        adults INTEGER NOT NULL DEFAULT 1,
        result_count INTEGER NOT NULL DEFAULT 0,
        searched_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    app = createTestApp(db);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.exec('DELETE FROM search_history');
  });

  describe('GET /api/flights/search', () => {
    it('should return flight results for valid parameters', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
          adults: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.meta).toHaveProperty('count');
      expect(response.body.meta.count).toBe(response.body.data.length);
    });

    it('should return flight offers with correct structure', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'LAX',
          destination: 'CDG',
          departureDate: '2026-07-01',
        });

      expect(response.status).toBe(200);
      
      const flight = response.body.data[0];
      expect(flight).toHaveProperty('id');
      expect(flight).toHaveProperty('itineraries');
      expect(flight).toHaveProperty('price');
      expect(flight.price).toHaveProperty('total');
      expect(flight.price).toHaveProperty('currency');
      expect(flight).toHaveProperty('validatingAirlineCodes');
      expect(Array.isArray(flight.itineraries)).toBe(true);
    });

    it('should return 400 when origin is missing', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('should return 400 when destination is missing', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('should return 400 when departureDate is missing', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('should return 400 for invalid airport codes (wrong length)', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFKK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('should return 400 for short airport codes', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JF',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('should handle lowercase airport codes by converting to uppercase', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'jfk',
          destination: 'lhr',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should support round-trip searches with returnDate', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
          returnDate: '2026-06-22',
          adults: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const flight = response.body.data[0];
      expect(flight.itineraries.length).toBe(2);
    });

    it('should record search history for successful searches', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'SFO',
          destination: 'NRT',
          departureDate: '2026-08-01',
          adults: 1,
        });

      const historyResponse = await request(app).get('/api/history');
      expect(historyResponse.status).toBe(200);
      expect(historyResponse.body.data.length).toBeGreaterThan(0);
      
      const lastSearch = historyResponse.body.data[0];
      expect(lastSearch.origin).toBe('SFO');
      expect(lastSearch.destination).toBe('NRT');
    });

    it('should sort results by price (lowest first)', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      expect(response.status).toBe(200);
      const prices = response.body.data.map((f: any) => parseFloat(f.price.total));
      
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });
  });

  describe('GET /api/flights/status', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/flights/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode');
      expect(response.body).toHaveProperty('message');
      expect(response.body.mode).toBe('mock');
    });
  });
});
