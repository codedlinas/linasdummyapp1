import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createTestApp } from './testApp.js';

describe('Alerts API', () => {
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
    db.exec('DELETE FROM alerts');
  });

  describe('POST /api/alerts', () => {
    it('should create a new alert with valid data', async () => {
      const alertData = {
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/alerts')
        .send(alertData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.origin).toBe('JFK');
      expect(response.body.destination).toBe('LHR');
      expect(response.body.maxPrice).toBe(500);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should convert airport codes to uppercase', async () => {
      const alertData = {
        origin: 'jfk',
        destination: 'lhr',
        maxPrice: 500,
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/alerts')
        .send(alertData);

      expect(response.status).toBe(201);
      expect(response.body.origin).toBe('JFK');
      expect(response.body.destination).toBe('LHR');
    });

    it('should return 400 when origin is missing', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when destination is missing', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when maxPrice is missing', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 for invalid airport codes', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFKK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('should return 400 for invalid maxPrice (zero)', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: '0',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid maxPrice');
    });

    it('should return 400 for invalid maxPrice (negative)', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: -100,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid maxPrice');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid email');
    });

    it('should accept decimal maxPrice values', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 499.99,
          email: 'test@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.maxPrice).toBe(499.99);
    });
  });

  describe('GET /api/alerts', () => {
    it('should return empty array when no alerts exist', async () => {
      const response = await request(app).get('/api/alerts');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.count).toBe(0);
    });

    it('should return all alerts', async () => {
      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'LAX',
          destination: 'CDG',
          maxPrice: 600,
          email: 'test@example.com',
        });

      const response = await request(app).get('/api/alerts');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.meta.count).toBe(2);
    });

    it('should filter alerts by email', async () => {
      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'user1@example.com',
        });

      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'LAX',
          destination: 'CDG',
          maxPrice: 600,
          email: 'user2@example.com',
        });

      const response = await request(app)
        .get('/api/alerts')
        .query({ email: 'user1@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].email).toBe('user1@example.com');
    });

    it('should return alerts ordered by created_at descending', async () => {
      db.exec(`
        INSERT INTO alerts (origin, destination, max_price, email, created_at)
        VALUES ('JFK', 'LHR', 500, 'test@example.com', '2026-01-01 10:00:00')
      `);
      
      db.exec(`
        INSERT INTO alerts (origin, destination, max_price, email, created_at)
        VALUES ('LAX', 'CDG', 600, 'test@example.com', '2026-01-02 10:00:00')
      `);

      const response = await request(app).get('/api/alerts');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].origin).toBe('LAX');
      expect(response.body.data[1].origin).toBe('JFK');
    });
  });

  describe('DELETE /api/alerts/:id', () => {
    it('should delete an existing alert', async () => {
      const createResponse = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      const alertId = createResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/api/alerts/${alertId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('Alert deleted');

      const getResponse = await request(app).get('/api/alerts');
      expect(getResponse.body.data.length).toBe(0);
    });

    it('should return 404 for non-existent alert', async () => {
      const response = await request(app)
        .delete('/api/alerts/999999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Alert not found');
    });

    it('should return 400 for invalid alert ID', async () => {
      const response = await request(app)
        .delete('/api/alerts/invalid');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid alert ID');
    });

    it('should not affect other alerts when deleting one', async () => {
      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      const createResponse = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'LAX',
          destination: 'CDG',
          maxPrice: 600,
          email: 'test@example.com',
        });

      await request(app)
        .delete(`/api/alerts/${createResponse.body.id}`);

      const getResponse = await request(app).get('/api/alerts');
      expect(getResponse.body.data.length).toBe(1);
      expect(getResponse.body.data[0].origin).toBe('JFK');
    });
  });
});
