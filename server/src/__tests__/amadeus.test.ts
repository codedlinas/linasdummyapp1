import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isLiveMode, searchFlights } from '../services/amadeus.js';

describe('Amadeus Service', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('isLiveMode', () => {
    it('should return false when no API keys are configured', () => {
      expect(isLiveMode()).toBe(false);
    });
  });

  describe('searchFlights', () => {
    it('should use mock data when API keys are not configured', async () => {
      const params = {
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        adults: 1,
      };

      const result = await searchFlights(params);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should return properly formatted flight offers', async () => {
      const params = {
        origin: 'LAX',
        destination: 'NRT',
        departureDate: '2026-07-01',
        adults: 2,
      };

      const result = await searchFlights(params);

      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('price');
      expect(result.data[0]).toHaveProperty('itineraries');
      expect(result.data[0]).toHaveProperty('validatingAirlineCodes');
    });

    it('should handle round-trip searches', async () => {
      const params = {
        origin: 'SFO',
        destination: 'CDG',
        departureDate: '2026-06-15',
        returnDate: '2026-06-25',
        adults: 1,
      };

      const result = await searchFlights(params);

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].itineraries.length).toBe(2);
    });

    it('should handle one-way searches', async () => {
      const params = {
        origin: 'ORD',
        destination: 'FRA',
        departureDate: '2026-08-01',
        adults: 1,
      };

      const result = await searchFlights(params);

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].itineraries.length).toBe(1);
      expect(result.data[0].oneWay).toBe(true);
    });

    it('should include dictionaries in response', async () => {
      const params = {
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        adults: 1,
      };

      const result = await searchFlights(params);

      expect(result.dictionaries).toBeDefined();
      expect(result.dictionaries?.carriers).toBeDefined();
      expect(result.dictionaries?.aircraft).toBeDefined();
    });
  });
});
