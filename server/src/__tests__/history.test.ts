import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createTestApp } from './testApp.js';

describe('History API', () => {
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

  describe('GET /api/history', () => {
    it('should return empty array when no search history exists', async () => {
      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.count).toBe(0);
    });

    it('should return search history after performing searches', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].origin).toBe('JFK');
      expect(response.body.data[0].destination).toBe('LHR');
      expect(response.body.data[0].departureDate).toBe('2026-06-15');
    });

    it('should record all search parameters', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'LAX',
          destination: 'CDG',
          departureDate: '2026-07-01',
          returnDate: '2026-07-15',
          adults: 3,
        });

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      const history = response.body.data[0];
      expect(history.origin).toBe('LAX');
      expect(history.destination).toBe('CDG');
      expect(history.departureDate).toBe('2026-07-01');
      expect(history.returnDate).toBe('2026-07-15');
      expect(history.adults).toBe(3);
      expect(history.resultCount).toBeGreaterThan(0);
    });

    it('should record result count from search', async () => {
      const searchResponse = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      const historyResponse = await request(app).get('/api/history');

      expect(historyResponse.status).toBe(200);
      expect(historyResponse.body.data[0].resultCount).toBe(searchResponse.body.data.length);
    });

    it('should return history items with correct structure', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      const history = response.body.data[0];
      expect(history).toHaveProperty('id');
      expect(history).toHaveProperty('origin');
      expect(history).toHaveProperty('destination');
      expect(history).toHaveProperty('departureDate');
      expect(history).toHaveProperty('returnDate');
      expect(history).toHaveProperty('adults');
      expect(history).toHaveProperty('resultCount');
      expect(history).toHaveProperty('searchedAt');
    });

    it('should return history ordered by searchedAt descending (most recent first)', async () => {
      db.exec(`
        INSERT INTO search_history (origin, destination, departure_date, adults, result_count, searched_at)
        VALUES ('JFK', 'LHR', '2026-06-15', 1, 10, '2026-01-01 10:00:00')
      `);
      
      db.exec(`
        INSERT INTO search_history (origin, destination, departure_date, adults, result_count, searched_at)
        VALUES ('LAX', 'CDG', '2026-07-01', 1, 10, '2026-01-02 10:00:00')
      `);

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].origin).toBe('LAX');
      expect(response.body.data[1].origin).toBe('JFK');
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/flights/search')
          .query({
            origin: 'JFK',
            destination: 'LHR',
            departureDate: `2026-0${6 + i}-15`,
          });
      }

      const response = await request(app)
        .get('/api/history')
        .query({ limit: 3 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
    });

    it('should cap limit at 100', async () => {
      const response = await request(app)
        .get('/api/history')
        .query({ limit: 200 });

      expect(response.status).toBe(200);
    });

    it('should use default limit of 20', async () => {
      for (let i = 0; i < 25; i++) {
        db.exec(`
          INSERT INTO search_history (origin, destination, departure_date, adults, result_count)
          VALUES ('JFK', 'LHR', '2026-06-${String(i + 1).padStart(2, '0')}', 1, 10)
        `);
      }

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(20);
    });

    it('should handle one-way searches (null returnDate)', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
        });

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data[0].returnDate).toBeNull();
    });

    it('should record searches with uppercase airport codes', async () => {
      await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'jfk',
          destination: 'lhr',
          departureDate: '2026-06-15',
        });

      const response = await request(app).get('/api/history');

      expect(response.status).toBe(200);
      expect(response.body.data[0].origin).toBe('JFK');
      expect(response.body.data[0].destination).toBe('LHR');
    });
  });
});
