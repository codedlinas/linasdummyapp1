import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import alertsRouter from '../routes/alerts.js';

const mockAlerts: any[] = [];
let alertIdCounter = 0;

vi.mock('../db.js', () => ({
  createAlert: vi.fn((origin, destination, maxPrice, email) => {
    const alert = {
      id: ++alertIdCounter,
      origin,
      destination,
      maxPrice,
      email,
      createdAt: new Date().toISOString(),
    };
    mockAlerts.push(alert);
    return alert;
  }),
  getAllAlerts: vi.fn((email?: string) => {
    if (email) {
      return mockAlerts.filter((a) => a.email === email);
    }
    return mockAlerts;
  }),
  getAlertById: vi.fn((id: number) => mockAlerts.find((a) => a.id === id)),
  deleteAlert: vi.fn((id: number) => {
    const idx = mockAlerts.findIndex((a) => a.id === id);
    if (idx >= 0) {
      mockAlerts.splice(idx, 1);
      return true;
    }
    return false;
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);

describe('Alerts API', () => {
  beforeEach(() => {
    mockAlerts.length = 0;
    alertIdCounter = 0;
  });

  describe('POST /api/alerts', () => {
    it('creates a new alert with valid data', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.origin).toBe('JFK');
      expect(response.body.destination).toBe('LHR');
      expect(response.body.maxPrice).toBe(500);
      expect(response.body.email).toBe('test@example.com');
    });

    it('returns 400 for missing origin', async () => {
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

    it('returns 400 for missing destination', async () => {
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

    it('returns 400 for missing maxPrice', async () => {
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

    it('returns 400 for missing email', async () => {
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

    it('returns 400 for invalid airport code length', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JF',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('returns 400 for invalid maxPrice', async () => {
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

    it('returns 400 for invalid email', async () => {
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

    it('converts airport codes to uppercase', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'jfk',
          destination: 'lhr',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.origin).toBe('JFK');
      expect(response.body.destination).toBe('LHR');
    });
  });

  describe('GET /api/alerts', () => {
    it('returns empty array when no alerts exist', async () => {
      const response = await request(app).get('/api/alerts');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.count).toBe(0);
    });

    it('returns all alerts', async () => {
      await request(app).post('/api/alerts').send({
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      });
      await request(app).post('/api/alerts').send({
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

    it('filters alerts by email', async () => {
      await request(app).post('/api/alerts').send({
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'user1@example.com',
      });
      await request(app).post('/api/alerts').send({
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
  });

  describe('DELETE /api/alerts/:id', () => {
    it('deletes an existing alert', async () => {
      const createResponse = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      const alertId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/api/alerts/${alertId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      const getResponse = await request(app).get('/api/alerts');
      expect(getResponse.body.data.length).toBe(0);
    });

    it('returns 404 for non-existent alert', async () => {
      const response = await request(app).delete('/api/alerts/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    it('returns 400 for invalid alert ID', async () => {
      const response = await request(app).delete('/api/alerts/invalid');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid alert ID');
    });
  });
});
