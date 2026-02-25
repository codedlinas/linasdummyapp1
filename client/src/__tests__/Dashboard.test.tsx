import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

vi.mock('../api', () => ({
  getDeals: vi.fn(),
  getAlerts: vi.fn(),
}));

const mockDeals = [
  {
    id: 'deal-1',
    origin: 'JFK',
    destination: 'LHR',
    price: 389,
    currency: 'USD',
    airline: 'BA',
    departureDate: '2025-06-15',
    returnDate: '2025-06-22',
    stops: 0,
    duration: 'PT7H20M',
  },
  {
    id: 'deal-2',
    origin: 'LAX',
    destination: 'NRT',
    price: 599,
    currency: 'USD',
    airline: 'JL',
    departureDate: '2025-07-01',
    returnDate: '2025-07-15',
    stops: 0,
    duration: 'PT11H45M',
  },
];

const mockAlerts = [
  {
    id: 1,
    origin: 'JFK',
    destination: 'LHR',
    maxPrice: 500,
    email: 'test@example.com',
    createdAt: '2025-03-10T10:00:00Z',
  },
];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getDeals, getAlerts } = await import('../api');
    vi.mocked(getDeals).mockResolvedValue({ data: mockDeals, meta: { count: mockDeals.length } });
    vi.mocked(getAlerts).mockResolvedValue({ data: mockAlerts, meta: { count: mockAlerts.length } });
  });

  describe('Rendering', () => {
    it('should render the hero section', async () => {
      renderDashboard();

      expect(screen.getByText(/Find Your Perfect Flight Deal/i)).toBeInTheDocument();
    });

    it('should render the search form', async () => {
      renderDashboard();

      expect(screen.getByPlaceholderText(/from/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/to/i)).toBeInTheDocument();
    });

    it('should render trending deals section', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Trending Deals/i)).toBeInTheDocument();
      });
    });

    it('should render why choose section', async () => {
      renderDashboard();

      expect(screen.getByText(/Why Choose FlyDeal/i)).toBeInTheDocument();
    });

    it('should render feature cards', async () => {
      renderDashboard();

      expect(screen.getByText(/Smart Search/i)).toBeInTheDocument();
      expect(screen.getByText(/Price Alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Prices/i)).toBeInTheDocument();
    });
  });

  describe('Data loading', () => {
    it('should load and display deals', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getAllByText(/JFK/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/LHR/).length).toBeGreaterThan(0);
      });
    });

    it('should display deal prices', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/389/)).toBeInTheDocument();
      });
    });

    it('should display deal airlines', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getAllByText(/British Airways/i).length).toBeGreaterThan(0);
      });
    });

    it('should display stop information', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getAllByText(/Nonstop/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Alerts section', () => {
    it('should display alerts when available', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Your Price Alerts/i)).toBeInTheDocument();
      });
    });

    it('should display alert details', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Alert when under \$500/i)).toBeInTheDocument();
      });
    });

    it('should not display alerts section when no alerts', async () => {
      const { getAlerts } = await import('../api');
      vi.mocked(getAlerts).mockResolvedValue({ data: [], meta: { count: 0 } });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Trending Deals/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/Your Price Alerts/i)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle deals loading error gracefully', async () => {
      const { getDeals } = await import('../api');
      vi.mocked(getDeals).mockRejectedValue(new Error('Failed to load'));

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Trending Deals/i)).toBeInTheDocument();
      });
    });

    it('should handle alerts loading error gracefully', async () => {
      const { getAlerts } = await import('../api');
      vi.mocked(getAlerts).mockRejectedValue(new Error('Failed to load'));

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Trending Deals/i)).toBeInTheDocument();
      });
    });
  });

  describe('Skeleton loaders', () => {
    it('should show loading state initially', async () => {
      const { getDeals } = await import('../api');
      vi.mocked(getDeals).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockDeals, meta: { count: mockDeals.length } }), 100))
      );

      renderDashboard();

      expect(document.querySelector('.skeleton')).toBeInTheDocument();
    });
  });
});
