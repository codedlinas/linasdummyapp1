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

const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('searchFlights', () => {
    it('makes GET request with correct query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/api/flights/search');
      expect(url).toContain('origin=JFK');
      expect(url).toContain('destination=LHR');
      expect(url).toContain('departureDate=2026-04-01');
      expect(url).toContain('adults=1');
    });

    it('includes optional parameters when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        returnDate: '2026-04-08',
        adults: 2,
        children: 1,
        travelClass: 'BUSINESS',
        nonStop: true,
        maxPrice: 1000,
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('returnDate=2026-04-08');
      expect(url).toContain('adults=2');
      expect(url).toContain('children=1');
      expect(url).toContain('travelClass=BUSINESS');
      expect(url).toContain('nonStop=true');
      expect(url).toContain('maxPrice=1000');
    });

    it('returns flight search response', async () => {
      const mockResponse = {
        data: [{ id: 'TEST123' }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2026-04-01',
        adults: 1,
      });

      expect(result).toEqual(mockResponse);
    });

    it('throws error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid parameters' }),
      });

      await expect(
        searchFlights({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-04-01',
          adults: 1,
        })
      ).rejects.toThrow('Invalid parameters');
    });
  });

  describe('getApiStatus', () => {
    it('makes GET request to status endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mode: 'mock', message: 'Using mock data' }),
      });

      await getApiStatus();

      expect(mockFetch).toHaveBeenCalledWith('/api/flights/status');
    });

    it('returns API status', async () => {
      const mockStatus = { mode: 'mock' as const, message: 'Using mock data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      const result = await getApiStatus();

      expect(result).toEqual(mockStatus);
    });
  });

  describe('getDeals', () => {
    it('makes GET request to deals endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getDeals();

      expect(mockFetch).toHaveBeenCalledWith('/api/deals');
    });

    it('returns deals response', async () => {
      const mockDeals = {
        data: [{ id: 'deal-1', origin: 'JFK', destination: 'LHR', price: 389 }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDeals),
      });

      const result = await getDeals();

      expect(result).toEqual(mockDeals);
    });
  });

  describe('createAlert', () => {
    it('makes POST request with alert data', async () => {
      const alertData = {
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, ...alertData }),
      });

      await createAlert(alertData);

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
    });

    it('returns created alert', async () => {
      const alertData = {
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      };
      const mockAlert = { id: 1, ...alertData, createdAt: '2026-02-25T10:00:00Z' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlert),
      });

      const result = await createAlert(alertData);

      expect(result).toEqual(mockAlert);
    });
  });

  describe('getAlerts', () => {
    it('makes GET request to alerts endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getAlerts();

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts');
    });

    it('includes email filter when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getAlerts('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts?email=test%40example.com');
    });

    it('returns alerts response', async () => {
      const mockAlerts = {
        data: [{ id: 1, origin: 'JFK', destination: 'LHR', maxPrice: 500 }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlerts),
      });

      const result = await getAlerts();

      expect(result).toEqual(mockAlerts);
    });
  });

  describe('deleteAlert', () => {
    it('makes DELETE request to alert endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Alert deleted' }),
      });

      await deleteAlert(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/alerts/1', { method: 'DELETE' });
    });

    it('returns success response', async () => {
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
    it('makes GET request to history endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getHistory();

      expect(mockFetch).toHaveBeenCalledWith('/api/history');
    });

    it('includes limit when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      });

      await getHistory(10);

      expect(mockFetch).toHaveBeenCalledWith('/api/history?limit=10');
    });

    it('returns history response', async () => {
      const mockHistory = {
        data: [{ id: 1, origin: 'JFK', destination: 'LHR' }],
        meta: { count: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      });

      const result = await getHistory();

      expect(result).toEqual(mockHistory);
    });
  });

  describe('Error Handling', () => {
    it('throws error with message from API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Specific error message' }),
      });

      await expect(getDeals()).rejects.toThrow('Specific error message');
    });

    it('handles unknown error format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Parse error')),
      });

      await expect(getDeals()).rejects.toThrow('Unknown error');
    });
  });
});
