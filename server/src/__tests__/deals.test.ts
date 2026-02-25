import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createTestApp } from './testApp.js';

describe('Deals API', () => {
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

  describe('GET /api/deals', () => {
    it('should return an array of deals', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
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

    it('should return deals with valid airport codes (3 letters)', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        expect(deal.origin).toMatch(/^[A-Z]{3}$/);
        expect(deal.destination).toMatch(/^[A-Z]{3}$/);
      }
    });

    it('should return deals with valid price values', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        expect(typeof deal.price).toBe('number');
        expect(deal.price).toBeGreaterThan(0);
        expect(deal.currency).toBe('USD');
      }
    });

    it('should return deals with valid airline codes', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        expect(deal.airline).toMatch(/^[A-Z]{2}$/);
      }
    });

    it('should return deals with future departure dates', async () => {
      const response = await request(app).get('/api/deals');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        const departureDate = new Date(deal.departureDate);
        expect(departureDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      }
    });

    it('should return meta with count matching data length', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      expect(response.body.meta.count).toBe(response.body.data.length);
    });

    it('should return deals with valid duration format', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        expect(deal.duration).toMatch(/^PT\d+H\d*M?$/);
      }
    });

    it('should return deals with non-negative stops', async () => {
      const response = await request(app).get('/api/deals');

      expect(response.status).toBe(200);
      
      for (const deal of response.body.data) {
        expect(typeof deal.stops).toBe('number');
        expect(deal.stops).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
