import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Amadeus Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isLiveMode', () => {
    it('returns false when API key is not set', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { isLiveMode } = await import('../services/amadeus.js');
      expect(isLiveMode()).toBe(false);
    });

    it('returns false when only API key is set', async () => {
      process.env.AMADEUS_API_KEY = 'test-key';
      delete process.env.AMADEUS_API_SECRET;

      const { isLiveMode } = await import('../services/amadeus.js');
      expect(isLiveMode()).toBe(false);
    });

    it('returns false when only API secret is set', async () => {
      delete process.env.AMADEUS_API_KEY;
      process.env.AMADEUS_API_SECRET = 'test-secret';

      const { isLiveMode } = await import('../services/amadeus.js');
      expect(isLiveMode()).toBe(false);
    });
  });

  describe('searchFlights', () => {
    it('returns mock data when not in live mode', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta.count).toBeDefined();
    });

    it('mock data contains valid flight offers', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      const flight = result.data[0];
      expect(flight.id).toBeDefined();
      expect(flight.source).toBeDefined();
      expect(flight.itineraries).toBeDefined();
      expect(Array.isArray(flight.itineraries)).toBe(true);
      expect(flight.price).toBeDefined();
      expect(flight.price.total).toBeDefined();
      expect(flight.price.currency).toBe('USD');
      expect(flight.validatingAirlineCodes).toBeDefined();
    });

    it('mock data respects number of adults', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result1 = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      const result2 = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 2,
      });

      const price1 = parseFloat(result1.data[0].price.total);
      const price2 = parseFloat(result2.data[0].price.total);

      expect(result2.data[0].travelerPricings.length).toBe(2);
    });

    it('mock data includes round trip itinerary when returnDate is provided', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        returnDate: '2026-04-08',
        adults: 1,
      });

      const flight = result.data[0];
      expect(flight.itineraries.length).toBe(2);
      expect(flight.oneWay).toBe(false);
    });

    it('mock data is one-way when returnDate is not provided', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      const flight = result.data[0];
      expect(flight.itineraries.length).toBe(1);
      expect(flight.oneWay).toBe(true);
    });

    it('mock data is sorted by price ascending', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      for (let i = 1; i < result.data.length; i++) {
        const prevPrice = parseFloat(result.data[i - 1].price.total);
        const currPrice = parseFloat(result.data[i].price.total);
        expect(currPrice).toBeGreaterThanOrEqual(prevPrice);
      }
    });

    it('mock data includes dictionaries', async () => {
      delete process.env.AMADEUS_API_KEY;
      delete process.env.AMADEUS_API_SECRET;

      const { searchFlights } = await import('../services/amadeus.js');

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      expect(result.dictionaries).toBeDefined();
      expect(result.dictionaries!.carriers).toBeDefined();
      expect(result.dictionaries!.aircraft).toBeDefined();
      expect(result.dictionaries!.currencies).toBeDefined();
    });
  });
});
