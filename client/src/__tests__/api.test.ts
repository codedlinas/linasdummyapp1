import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchFlights,
  getApiStatus,
  getDeals,
  createAlert,
  getAlerts,
  deleteAlert,
  getHistory,
} from '../api';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchFlights', () => {
    it('should call fetch with correct URL and params', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2025-06-15',
        adults: 1,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/flights/search?')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('origin=JFK')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('destination=LHR')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('departureDate=2025-06-15')
      );
    });

    it('should include returnDate when provided', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2025-06-15',
        returnDate: '2025-06-22',
        adults: 1,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('returnDate=2025-06-22')
      );
    });

    it('should return flight search response', async () => {
      const mockResponse = {
        data: [{ id: 'TEST1' }],
        meta: { count: 1 },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await searchFlights({
        origin: 'JFK',
        destination: 'LHR',
        departureDate: '2025-06-15',
        adults: 1,
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed request', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' }),
      } as Response);

      await expect(
        searchFlights({
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2025-06-15',
          adults: 1,
        })
      ).rejects.toThrow('Bad request');
    });
  });

  describe('getApiStatus', () => {
    it('should call fetch with correct URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mode: 'mock', message: 'Using mock data' }),
      } as Response);

      await getApiStatus();

      expect(global.fetch).toHaveBeenCalledWith('/api/flights/status');
    });

    it('should return API status', async () => {
      const mockStatus = { mode: 'mock', message: 'Using mock data' };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      } as Response);

      const result = await getApiStatus();

      expect(result).toEqual(mockStatus);
    });
  });

  describe('getDeals', () => {
    it('should call fetch with correct URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await getDeals();

      expect(global.fetch).toHaveBeenCalledWith('/api/deals');
    });

    it('should return deals response', async () => {
      const mockDeals = {
        data: [{ id: 'deal-1', origin: 'JFK', destination: 'LHR', price: 389 }],
        meta: { count: 1 },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDeals),
      } as Response);

      const result = await getDeals();

      expect(result).toEqual(mockDeals);
    });
  });

  describe('createAlert', () => {
    it('should call fetch with correct URL and body', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      } as Response);

      await createAlert({
        origin: 'JFK',
        destination: 'LHR',
        maxPrice: 500,
        email: 'test@example.com',
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/alerts', {
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
        createdAt: '2025-03-10T10:00:00Z',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlert),
      } as Response);

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
    it('should call fetch with correct URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await getAlerts();

      expect(global.fetch).toHaveBeenCalledWith('/api/alerts');
    });

    it('should include email parameter when provided', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await getAlerts('test@example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alerts?email=test%40example.com'
      );
    });

    it('should return alerts response', async () => {
      const mockAlerts = {
        data: [{ id: 1, origin: 'JFK', destination: 'LHR', maxPrice: 500 }],
        meta: { count: 1 },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlerts),
      } as Response);

      const result = await getAlerts();

      expect(result).toEqual(mockAlerts);
    });
  });

  describe('deleteAlert', () => {
    it('should call fetch with correct URL and method', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Alert deleted' }),
      } as Response);

      await deleteAlert(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/alerts/1', {
        method: 'DELETE',
      });
    });

    it('should return delete response', async () => {
      const mockResponse = { success: true, message: 'Alert deleted' };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await deleteAlert(1);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getHistory', () => {
    it('should call fetch with correct URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await getHistory();

      expect(global.fetch).toHaveBeenCalledWith('/api/history');
    });

    it('should include limit parameter when provided', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], meta: { count: 0 } }),
      } as Response);

      await getHistory(10);

      expect(global.fetch).toHaveBeenCalledWith('/api/history?limit=10');
    });

    it('should return history response', async () => {
      const mockHistory = {
        data: [
          {
            id: 1,
            origin: 'JFK',
            destination: 'LHR',
            departureDate: '2025-06-15',
          },
        ],
        meta: { count: 1 },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      } as Response);

      const result = await getHistory();

      expect(result).toEqual(mockHistory);
    });
  });

  describe('Error handling', () => {
    it('should handle non-JSON error responses', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Not JSON')),
      } as Response);

      await expect(getDeals()).rejects.toThrow('Unknown error');
    });

    it('should use error message from response', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Custom error message' }),
      } as Response);

      await expect(getDeals()).rejects.toThrow('Custom error message');
    });
  });
});
