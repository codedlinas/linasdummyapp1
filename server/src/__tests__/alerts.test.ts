import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';

let mockAlerts: any[] = [];
let alertIdCounter = 1;

vi.mock('../db.js', () => ({
  createAlert: vi.fn((origin, destination, maxPrice, email) => {
    const alert = {
      id: alertIdCounter++,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
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
  getAlertById: vi.fn((id: number) => {
    return mockAlerts.find((a) => a.id === id);
  }),
  deleteAlert: vi.fn((id: number) => {
    const index = mockAlerts.findIndex((a) => a.id === id);
    if (index !== -1) {
      mockAlerts.splice(index, 1);
      return true;
    }
    return false;
  }),
}));

const createAlertsRouter = () => {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const { origin, destination, maxPrice, email } = req.body;

      if (!origin || !destination || !maxPrice || !email) {
        return res.status(400).json({
          error: 'Missing required fields: origin, destination, maxPrice, and email are required',
        });
      }

      const originCode = origin.toUpperCase();
      const destCode = destination.toUpperCase();

      if (originCode.length !== 3 || destCode.length !== 3) {
        return res.status(400).json({
          error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
        });
      }

      const price = parseFloat(maxPrice);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          error: 'Invalid maxPrice. Must be a positive number.',
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email address.',
        });
      }

      const { createAlert } = await import('../db.js');
      const alert = createAlert(originCode, destCode, price, email);
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const { email } = req.query;
      const { getAllAlerts } = await import('../db.js');
      const alerts = getAllAlerts(email as string | undefined);
      res.json({
        data: alerts,
        meta: {
          count: alerts.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid alert ID' });
      }

      const { getAlertById, deleteAlert } = await import('../db.js');
      const alert = getAlertById(id);
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      const deleted = deleteAlert(id);

      if (deleted) {
        res.json({ success: true, message: 'Alert deleted' });
      } else {
        res.status(404).json({ error: 'Alert not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete alert' });
    }
  });

  return router;
};

describe('Alerts API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/alerts', createAlertsRouter());
  });

  beforeEach(() => {
    mockAlerts = [];
    alertIdCounter = 1;
    vi.clearAllMocks();
  });

  describe('POST /api/alerts', () => {
    it('should create a new alert with valid data', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.origin).toBe('JFK');
      expect(response.body.destination).toBe('LHR');
      expect(response.body.maxPrice).toBe(500);
      expect(response.body.email).toBe('test@example.com');
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
          origin: 'JF',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
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

    it('should return 400 for invalid maxPrice (zero)', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .send({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 0,
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
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

    it('should convert airport codes to uppercase', async () => {
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
    it('should return empty array when no alerts exist', async () => {
      const response = await request(app).get('/api/alerts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
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
          email: 'user1@example.com',
        });

      await request(app)
        .post('/api/alerts')
        .send({
          origin: 'LAX',
          destination: 'NRT',
          maxPrice: 700,
          email: 'user2@example.com',
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
          destination: 'NRT',
          maxPrice: 700,
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

      const deleteResponse = await request(app).delete(`/api/alerts/${alertId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('Alert deleted');
    });

    it('should return 404 for non-existent alert', async () => {
      const response = await request(app).delete('/api/alerts/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Alert not found');
    });

    it('should return 400 for invalid alert ID', async () => {
      const response = await request(app).delete('/api/alerts/invalid');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid alert ID');
    });
  });
});
