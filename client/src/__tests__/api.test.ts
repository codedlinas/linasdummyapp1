import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchFlights,
  getApiStatus,
  getDeals,
  createAlert,
  getAlerts,
  deleteAlert,
  getHistory,
} from '../api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchFlights', () => {
    it('should call fetch with correct URL and parameters', async () => {
      const mockResponse = {
        data: [{ id: '1', price: { total: '450' } }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        adults: 1,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/flights/search');
      expect(calledUrl).toContain('origin=JFK');
      expect(calledUrl).toContain('destination=LHR');
      expect(calledUrl).toContain('departureDate=2026-06-15');
    });

    it('should include optional parameters when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        returnDate: '2026-06-22',
        adults: 2,
        children: 1,
        travelClass: 'BUSINESS',
        nonStop: true,
        maxPrice: 1000,
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('returnDate=2026-06-22');
      expect(calledUrl).toContain('adults=2');
      expect(calledUrl).toContain('children=1');
      expect(calledUrl).toContain('travelClass=BUSINESS');
      expect(calledUrl).toContain('nonStop=true');
      expect(calledUrl).toContain('maxPrice=1000');
    });

    it('should return flight search response', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            price: { total: '450' },
            itineraries: [],
            validatingAirlineCodes: ['BA'],
          },
        ],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-06-15',
        adults: 1,
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid parameters' }),
      });

      await expect(
        searchFlights({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
          adults: 1,
        })
      ).rejects.toThrow('Invalid parameters');
    });
  });

  describe('getApiStatus', () => {
    it('should call fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mode: 'mock', message: 'Using mock data' }),
      });

      await getApiStatus();

      expect(mockFetch).toHaveBeenCalledWith('/api/flights/status');
    });

    it('should return API status response', async () => {
      const mockResponse = { mode: 'mock', message: 'Using mock data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getApiStatus();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDeals', () => {
    it('should call fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getDeals();

      expect(mockFetch).toHaveBeenCalledWith('/api/deals');
    });

    it('should return deals response', async () => {
      const mockResponse = {
        data: [
          { id: '1', origin: 'JFK', destination: 'LHR', price: 389 },
        ],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getDeals();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('createAlert', () => {
    it('should call fetch with POST method and correct body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            origin: 'JFK',
            destination: 'LHR',
            maxPrice: 500,
            email: 'test@example.com',
          }),
      });

      await createAlert({
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: 'JFK',
          destination: 'LHR',
          maxPrice: 500,
          email: 'test@example.com',
        }),
      });
    });

    it('should return created alert', async () => {
      const mockAlert = {
        id: 1,
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
        createdAt: '2026-01-01T00:00:00Z',
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlert),
      });

      const result = await createAlert({
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      });

      expect(result).toEqual(mockAlert);
    });
  });

  describe('getAlerts', () => {
    it('should call fetch without email parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getAlerts();

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts');
    });

    it('should call fetch with email parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getAlerts('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts?email=test%40example.com');
    });

    it('should return alerts response', async () => {
      const mockResponse = {
        data: [{ id: 1, origin: 'JFK', destination: 'LHR', maxPrice: 500 }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getAlerts();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteAlert', () => {
    it('should call fetch with DELETE method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Alert deleted' }),
      });

      await deleteAlert(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts/1', {
        method: 'DELETE',
      });
    });

    it('should return delete response', async () => {
      const mockResponse = { success: true, message: 'Alert deleted' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await deleteAlert(1);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getHistory', () => {
    it('should call fetch without limit parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getHistory();

      expect(mockFetch).toHaveBeenCalledWith('/api/history');
    });

    it('should call fetch with limit parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getHistory(10);

      expect(mockFetch).toHaveBeenCalledWith('/api/history?limit=10');
    });

    it('should return history response', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            origin: 'JFK',
            destination: 'LHR',
            departureDate: '2026-06-15',
          },
        ],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getHistory();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        searchFlights({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-06-15',
          adults: 1,
        })
      ).rejects.toThrow('Network error');
    });

    it('should handle non-JSON error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(getDeals()).rejects.toThrow();
    });
  });
});
