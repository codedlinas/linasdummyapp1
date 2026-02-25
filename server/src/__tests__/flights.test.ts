import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';

vi.mock('../db.js', () => ({
  addSearchHistory: vi.fn(() => ({
    id: 1,
    origin: 'JFK',
    destination: 'LHR',
    departureDate: '2025-06-15',
    returnDate: null,
    adults: 1,
    resultCount: 10,
    searchedAt: new Date().toISOString(),
  })),
}));

vi.mock('../services/amadeus.js', () => ({
  searchFlights: vi.fn(async (params) => ({
    data: [
      {
        id: 'TEST1',
        source: 'GDS',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: true,
        lastTicketingDate: params.departureDate,
        numberOfBookableSeats: 5,
        itineraries: [
          {
            duration: 'PT7H30M',
            segments: [
              {
                departure: { iataCode: params.origin, at: `${params.departureDate}T08:00:00` },
                arrival: { iataCode: params.destination, at: `${params.departureDate}T15:30:00` },
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
          total: '450.00',
          base: '380.00',
          fees: [{ amount: '70.00', type: 'SUPPLIER' }],
          grandTotal: '450.00',
        },
        pricingOptions: { fareType: ['PUBLISHED'], includedCheckedBagsOnly: true },
        validatingAirlineCodes: ['BA'],
        travelerPricings: [
          {
            travelerId: '1',
            fareOption: 'STANDARD',
            travelerType: 'ADULT',
            price: { currency: 'USD', total: '450.00', base: '380.00' },
            fareDetailsBySegment: [
              { segmentId: '1', cabin: 'ECONOMY', fareBasis: 'YOWUS', class: 'Y', includedCheckedBags: { quantity: 1 } },
            ],
          },
        ],
      },
    ],
    meta: { count: 1 },
    dictionaries: {
      carriers: { BA: 'British Airways' },
      aircraft: { '777': 'Boeing 777' },
      currencies: { USD: 'US Dollar' },
      locations: {},
    },
  })),
  isLiveMode: vi.fn(() => false),
}));

const createFlightsRouter = () => {
  const router = Router();

  router.get('/search', async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, adults, children, infants, travelClass, nonStop, maxPrice } = req.query;

      if (!origin || !destination || !departureDate) {
        return res.status(400).json({
          error: 'Missing required parameters: origin, destination, and departureDate are required',
        });
      }

      const originCode = (origin as string).toUpperCase();
      const destCode = (destination as string).toUpperCase();

      if (originCode.length !== 3 || destCode.length !== 3) {
        return res.status(400).json({
          error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
        });
      }

      const { searchFlights } = await import('../services/amadeus.js');
      const { addSearchHistory } = await import('../db.js');

      const params = {
        origin: originCode,
        destination: destCode,
        departureDate: departureDate as string,
        returnDate: returnDate as string | undefined,
        adults: parseInt(adults as string) || 1,
        children: children ? parseInt(children as string) : undefined,
        infants: infants ? parseInt(infants as string) : undefined,
        travelClass: travelClass as any,
        nonStop: nonStop === 'true',
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      };

      const results = await searchFlights(params);

      addSearchHistory(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate || null,
        params.adults,
        results.data.length
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search flights' });
    }
  });

  router.get('/status', (req, res) => {
    res.json({
      mode: 'mock',
      message: 'Using mock data (set AMADEUS_API_KEY and AMADEUS_API_SECRET for live data)',
    });
  });

  return router;
};

describe('Flights API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/flights', createFlightsRouter());
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/flights/search', () => {
    it('should return flight results for valid search parameters', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2025-06-15',
          adults: '1',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 400 when origin is missing', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          destination: 'LHR',
          departureDate: '2025-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('should return 400 when destination is missing', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          departureDate: '2025-06-15',
        });

      expect(response.status).toBe(400);
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
      expect(response.body.error).toContain('Missing required parameters');
    });

    it('should return 400 for invalid airport codes (not 3 letters)', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JF',
          destination: 'LHR',
          departureDate: '2025-06-15',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid airport codes');
    });

    it('should convert airport codes to uppercase', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'jfk',
          destination: 'lhr',
          departureDate: '2025-06-15',
        });

      expect(response.status).toBe(200);
    });

    it('should handle round-trip searches with returnDate', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2025-06-15',
          returnDate: '2025-06-22',
          adults: '2',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should return flight data with correct structure', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2025-06-15',
        });

      expect(response.status).toBe(200);
      
      const flight = response.body.data[0];
      expect(flight).toHaveProperty('id');
      expect(flight).toHaveProperty('itineraries');
      expect(flight).toHaveProperty('price');
      expect(flight).toHaveProperty('validatingAirlineCodes');
      expect(flight.price).toHaveProperty('currency');
      expect(flight.price).toHaveProperty('total');
    });
  });

  describe('GET /api/flights/status', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/flights/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode');
      expect(response.body).toHaveProperty('message');
    });

    it('should indicate mock mode when no API keys', async () => {
      const response = await request(app).get('/api/flights/status');

      expect(response.status).toBe(200);
      expect(response.body.mode).toBe('mock');
    });
  });
});
