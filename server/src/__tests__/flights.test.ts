import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import flightsRouter from '../routes/flights.js';

vi.mock('../db.js', () => ({
  addSearchHistory: vi.fn().mockReturnValue({
    id: 1,
    origin: 'JFK',
    destination: 'LHR',
    departureDate: '2026-04-01',
    returnDate: null,
    adults: 1,
    resultCount: 5,
    searchedAt: new Date().toISOString(),
  }),
}));

vi.mock('../services/amadeus.js', () => ({
  searchFlights: vi.fn().mockResolvedValue({
    data: [
      {
        id: 'TEST123',
        source: 'GDS',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: true,
        lastTicketingDate: '2026-04-01',
        numberOfBookableSeats: 5,
        itineraries: [
          {
            duration: 'PT7H30M',
            segments: [
              {
                departure: { iataCode: 'JFK', at: '2026-04-01T08:00:00' },
                arrival: { iataCode: 'LHR', at: '2026-04-01T20:30:00' },
                carrierCode: 'BA',
                number: '178',
                aircraft: { code: '777' },
                duration: 'PT7H30M',
                id: '1',
                numberOfStops: 0,
                blacklistedInEU: false,
              },
            ],
          },
        ],
        price: {
          currency: 'USD',
          total: '450',
          base: '382',
          fees: [{ amount: '68', type: 'SUPPLIER' }],
          grandTotal: '450',
        },
        pricingOptions: {
          fareType: ['PUBLISHED'],
          includedCheckedBagsOnly: true,
        },
        validatingAirlineCodes: ['BA'],
        travelerPricings: [],
      },
    ],
    meta: { count: 1 },
  }),
  isLiveMode: vi.fn().mockReturnValue(false),
}));

const app = express();
app.use(express.json());
app.use('/api/flights', flightsRouter);

describe('Flights API', () => {
  describe('GET /api/flights/search', () => {
    it('returns flight results for valid query', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-04-01',
          adults: '1',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.meta.count).toBeDefined();
    });

    it('returns 400 for missing origin parameter', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          destination: 'LHR',
          departureDate: '2026-04-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('returns 400 for missing destination parameter', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          departureDate: '2026-04-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('returns 400 for missing departureDate parameter', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('returns 400 for invalid airport code length', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JF',
          destination: 'LHR',
          departureDate: '2026-04-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('accepts lowercase airport codes and converts to uppercase', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'jfk',
          destination: 'lhr',
          departureDate: '2026-04-01',
        });

      expect(response.status).toBe(200);
    });

    it('handles optional parameters correctly', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-04-01',
          returnDate: '2026-04-08',
          adults: '2',
          travelClass: 'BUSINESS',
          nonStop: 'true',
          maxPrice: '1000',
        });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/flights/status', () => {
    it('returns mock mode when no API keys configured', async () => {
      const response = await request(app).get('/api/flights/status');

      expect(response.status).toBe(200);
      expect(response.body.mode).toBe('mock');
      expect(response.body.message).toContain('mock data');
    });
  });
});
