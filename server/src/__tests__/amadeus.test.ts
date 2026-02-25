import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { searchMockFlights, getMockDeals } from '../mocks/flights.js';

describe('Mock Flight Data', () => {
  describe('searchMockFlights', () => {
    it('should return flight search response with correct structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result).toHaveProperty('dictionaries');
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should return flights with valid flight offer structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const flight = result.data[0];

      expect(flight).toHaveProperty('id');
      expect(flight).toHaveProperty('source');
      expect(flight).toHaveProperty('itineraries');
      expect(flight).toHaveProperty('price');
      expect(flight).toHaveProperty('validatingAirlineCodes');
      expect(flight).toHaveProperty('travelerPricings');
    });

    it('should return flights with valid price structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const flight = result.data[0];

      expect(flight.price).toHaveProperty('currency');
      expect(flight.price).toHaveProperty('total');
      expect(flight.price).toHaveProperty('base');
      expect(flight.price).toHaveProperty('fees');
      expect(flight.price).toHaveProperty('grandTotal');
      expect(flight.price.currency).toBe('USD');
      expect(parseFloat(flight.price.total)).toBeGreaterThan(0);
    });

    it('should return flights with valid itinerary structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const flight = result.data[0];
      const itinerary = flight.itineraries[0];

      expect(itinerary).toHaveProperty('duration');
      expect(itinerary).toHaveProperty('segments');
      expect(itinerary.segments.length).toBeGreaterThan(0);
    });

    it('should return flights with valid segment structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const segment = result.data[0].itineraries[0].segments[0];

      expect(segment).toHaveProperty('departure');
      expect(segment).toHaveProperty('arrival');
      expect(segment).toHaveProperty('carrierCode');
      expect(segment).toHaveProperty('number');
      expect(segment).toHaveProperty('aircraft');
      expect(segment).toHaveProperty('duration');
    });

    it('should include origin and destination in segments', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const segments = result.data[0].itineraries[0].segments;
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      expect(firstSegment.departure.iataCode).toBe('JFK');
      expect(lastSegment.arrival.iataCode).toBe('LHR');
    });

    it('should handle round-trip flights', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', '2025-06-22', 1);
      const flight = result.data[0];

      expect(flight.itineraries.length).toBe(2);
      expect(flight.oneWay).toBe(false);
    });

    it('should handle one-way flights', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const flight = result.data[0];

      expect(flight.itineraries.length).toBe(1);
      expect(flight.oneWay).toBe(true);
    });

    it('should scale price with number of passengers', () => {
      const result1 = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const result2 = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 2);

      const price1 = result1.data[0].travelerPricings.length;
      const price2 = result2.data[0].travelerPricings.length;

      expect(price1).toBe(1);
      expect(price2).toBe(2);
    });

    it('should return flights sorted by price', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);

      for (let i = 0; i < result.data.length - 1; i++) {
        const currentPrice = parseFloat(result.data[i].price.total);
        const nextPrice = parseFloat(result.data[i + 1].price.total);
        expect(currentPrice).toBeLessThanOrEqual(nextPrice);
      }
    });

    it('should include carrier dictionaries', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);

      expect(result.dictionaries).toHaveProperty('carriers');
      expect(result.dictionaries?.carriers).toHaveProperty('AA');
      expect(result.dictionaries?.carriers).toHaveProperty('BA');
    });

    it('should include aircraft dictionaries', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);

      expect(result.dictionaries).toHaveProperty('aircraft');
      expect(result.dictionaries?.aircraft).toHaveProperty('777');
      expect(result.dictionaries?.aircraft).toHaveProperty('787');
    });

    it('should return meta with count', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);

      expect(result.meta).toHaveProperty('count');
      expect(result.meta.count).toBe(result.data.length);
    });

    it('should generate unique flight IDs', () => {
      const result = searchMockFlights('JFK', 'LHR', '2025-06-15', null, 1);
      const ids = result.data.map((f) => f.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getMockDeals', () => {
    it('should return array of deals', () => {
      const deals = getMockDeals();

      expect(deals).toBeInstanceOf(Array);
      expect(deals.length).toBeGreaterThan(0);
    });

    it('should return deals with valid structure', () => {
      const deals = getMockDeals();
      const deal = deals[0];

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

    it('should return deals with valid airport codes', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(deal.origin).toMatch(/^[A-Z]{3}$/);
        expect(deal.destination).toMatch(/^[A-Z]{3}$/);
      });
    });

    it('should return deals with valid prices', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(typeof deal.price).toBe('number');
        expect(deal.price).toBeGreaterThan(0);
      });
    });

    it('should return deals with USD currency', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(deal.currency).toBe('USD');
      });
    });

    it('should return deals with valid airline codes', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(deal.airline).toMatch(/^[A-Z]{2}$/);
      });
    });

    it('should return deals with valid duration format', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(deal.duration).toMatch(/^PT\d+H\d*M?$/);
      });
    });

    it('should return deals with valid stops count', () => {
      const deals = getMockDeals();

      deals.forEach((deal) => {
        expect(typeof deal.stops).toBe('number');
        expect(deal.stops).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return deals with future departure dates', () => {
      const deals = getMockDeals();
      const today = new Date();

      deals.forEach((deal) => {
        const departureDate = new Date(deal.departureDate);
        expect(departureDate.getTime()).toBeGreaterThan(today.getTime());
      });
    });

    it('should return unique deal IDs', () => {
      const deals = getMockDeals();
      const ids = deals.map((d) => d.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});

describe('Amadeus Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.AMADEUS_API_KEY;
    delete process.env.AMADEUS_API_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return false for isLiveMode when no API keys', async () => {
    const { isLiveMode } = await import('../services/amadeus.js');
    expect(isLiveMode()).toBe(false);
  });

  it('should use mock data when no API keys', async () => {
    const { searchFlights } = await import('../services/amadeus.js');
    
    const result = await searchFlights({
      origin: 'JFK',
      destination: 'LHR',
      departureDate: '2025-06-15',
      adults: 1,
    });

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);
  });
});
