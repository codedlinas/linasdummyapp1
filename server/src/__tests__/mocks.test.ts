import { describe, it, expect } from 'vitest';
import { searchMockFlights, getMockDeals } from '../mocks/flights.js';

describe('Mock Flight Data', () => {
  describe('searchMockFlights', () => {
    it('should return flight search response with correct structure', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result).toHaveProperty('dictionaries');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return multiple flight offers', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta.count).toBe(result.data.length);
    });

    it('should return flight offers sorted by price', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);
      const prices = result.data.map(f => parseFloat(f.price.total));

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('should generate one-way flights when no returnDate is provided', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      for (const flight of result.data) {
        expect(flight.oneWay).toBe(true);
        expect(flight.itineraries.length).toBe(1);
      }
    });

    it('should generate round-trip flights when returnDate is provided', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', '2026-06-22', 1);

      for (const flight of result.data) {
        expect(flight.oneWay).toBe(false);
        expect(flight.itineraries.length).toBe(2);
      }
    });

    it('should calculate total price based on number of adults', () => {
      const resultSingle = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);
      const resultMultiple = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 2);

      const singleTravelerPrices = resultSingle.data.map(f => f.travelerPricings.length);
      const multipleTravelerPrices = resultMultiple.data.map(f => f.travelerPricings.length);

      expect(singleTravelerPrices.every(count => count === 1)).toBe(true);
      expect(multipleTravelerPrices.every(count => count === 2)).toBe(true);
    });

    it('should include carrier dictionaries', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      expect(result.dictionaries).toBeDefined();
      expect(result.dictionaries?.carriers).toBeDefined();
      expect(typeof result.dictionaries?.carriers).toBe('object');
      expect(Object.keys(result.dictionaries!.carriers).length).toBeGreaterThan(0);
    });

    it('should include aircraft dictionaries', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      expect(result.dictionaries?.aircraft).toBeDefined();
      expect(result.dictionaries?.aircraft['777']).toBe('Boeing 777');
      expect(result.dictionaries?.aircraft['787']).toBe('Boeing 787');
    });

    it('should generate valid flight offers with all required fields', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      for (const flight of result.data) {
        expect(flight).toHaveProperty('id');
        expect(flight).toHaveProperty('source');
        expect(flight).toHaveProperty('itineraries');
        expect(flight).toHaveProperty('price');
        expect(flight).toHaveProperty('validatingAirlineCodes');
        expect(flight).toHaveProperty('travelerPricings');

        expect(flight.price).toHaveProperty('currency', 'USD');
        expect(flight.price).toHaveProperty('total');
        expect(flight.price).toHaveProperty('base');
        expect(flight.price).toHaveProperty('grandTotal');
      }
    });

    it('should generate valid itinerary segments', () => {
      const result = searchMockFlights('JFK', 'LHR', '2026-06-15', null, 1);

      for (const flight of result.data) {
        for (const itinerary of flight.itineraries) {
          expect(itinerary).toHaveProperty('duration');
          expect(itinerary).toHaveProperty('segments');
          expect(Array.isArray(itinerary.segments)).toBe(true);
          expect(itinerary.segments.length).toBeGreaterThan(0);

          for (const segment of itinerary.segments) {
            expect(segment).toHaveProperty('departure');
            expect(segment).toHaveProperty('arrival');
            expect(segment).toHaveProperty('carrierCode');
            expect(segment).toHaveProperty('number');
            expect(segment).toHaveProperty('duration');
            expect(segment.departure).toHaveProperty('iataCode');
            expect(segment.departure).toHaveProperty('at');
            expect(segment.arrival).toHaveProperty('iataCode');
            expect(segment.arrival).toHaveProperty('at');
          }
        }
      }
    });

    it('should handle different route pairs', () => {
      const routes = [
        { origin: 'LAX', destination: 'NRT' },
        { origin: 'SFO', destination: 'CDG' },
        { origin: 'ORD', destination: 'FRA' },
      ];

      for (const route of routes) {
        const result = searchMockFlights(route.origin, route.destination, '2026-06-15', null, 1);
        expect(result.data.length).toBeGreaterThan(0);
      }
    });

    it('should work with unknown routes using default values', () => {
      const result = searchMockFlights('ABC', 'XYZ', '2026-06-15', null, 1);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('getMockDeals', () => {
    it('should return an array of deals', () => {
      const deals = getMockDeals();

      expect(Array.isArray(deals)).toBe(true);
      expect(deals.length).toBeGreaterThan(0);
    });

    it('should return deals with correct structure', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(deal).toHaveProperty('id');
        expect(deal).toHaveProperty('origin');
        expect(deal).toHaveProperty('destination');
        expect(deal).toHaveProperty('price');
        expect(deal).toHaveProperty('currency');
        expect(deal).toHaveProperty('airline');
        expect(deal).toHaveProperty('departureDate');
        expect(deal).toHaveProperty('returnDate');
        expect(deal).toHaveProperty('stops');
        expect(deal).toHaveProperty('duration');
      }
    });

    it('should return deals with valid prices', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(typeof deal.price).toBe('number');
        expect(deal.price).toBeGreaterThan(0);
      }
    });

    it('should return deals with USD currency', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(deal.currency).toBe('USD');
      }
    });

    it('should return deals with valid airport codes', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(deal.origin).toMatch(/^[A-Z]{3}$/);
        expect(deal.destination).toMatch(/^[A-Z]{3}$/);
      }
    });

    it('should return deals with valid airline codes', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(deal.airline).toMatch(/^[A-Z]{2}$/);
      }
    });

    it('should return deals with future dates', () => {
      const deals = getMockDeals();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const deal of deals) {
        const departureDate = new Date(deal.departureDate);
        expect(departureDate.getTime()).toBeGreaterThan(today.getTime());
      }
    });

    it('should return deals with valid duration format', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(deal.duration).toMatch(/^PT\d+H\d*M?$/);
      }
    });

    it('should return deals with non-negative stops', () => {
      const deals = getMockDeals();

      for (const deal of deals) {
        expect(typeof deal.stops).toBe('number');
        expect(deal.stops).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return deals with unique IDs', () => {
      const deals = getMockDeals();
      const ids = deals.map(d => d.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
