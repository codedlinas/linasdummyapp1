import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import * as api from '../api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    departureDate: '2026-03-15',
    returnDate: '2026-03-22',
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
    departureDate: '2026-03-18',
    returnDate: '2026-03-25',
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
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 2,
    origin: 'LAX',
    destination: 'CDG',
    maxPrice: 600,
    email: 'test@example.com',
    createdAt: '2026-02-24T10:00:00Z',
  },
];

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getDeals as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockDeals,
      meta: { count: mockDeals.length },
    });
    (api.getAlerts as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockAlerts,
      meta: { count: mockAlerts.length },
    });
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  };

  describe('Header Section', () => {
    it('renders the main heading', async () => {
      renderDashboard();

      expect(screen.getByText(/find your perfect flight deal/i)).toBeInTheDocument();
    });

    it('renders the subheading', async () => {
      renderDashboard();

      expect(screen.getByText(/compare prices from multiple airlines/i)).toBeInTheDocument();
    });
  });

  describe('Search Form', () => {
    it('renders the search form', async () => {
      renderDashboard();

      expect(screen.getByPlaceholderText(/from/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/to/i)).toBeInTheDocument();
    });
  });

  describe('Deals Section', () => {
    it('renders the trending deals heading', async () => {
      renderDashboard();

      expect(screen.getByText(/trending deals/i)).toBeInTheDocument();
    });

    it('displays loading skeletons while fetching deals', async () => {
      (api.getDeals as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [], meta: { count: 0 } }), 100))
      );

      renderDashboard();

      expect(document.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    });

    it('displays deals after loading', async () => {
      renderDashboard();

      await waitFor(() => {
        const container = document.body;
        expect(container.textContent).toContain('JFK');
        expect(container.textContent).toContain('LHR');
      });
    });

    it('displays deal prices', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('$389')).toBeInTheDocument();
        expect(screen.getByText('$599')).toBeInTheDocument();
      });
    });

    it('navigates to search page when deal is clicked', async () => {
      renderDashboard();

      await waitFor(() => {
        const container = document.body;
        expect(container.textContent).toContain('JFK');
      });

      const dealCards = document.querySelectorAll('.card.cursor-pointer');
      const firstDealCard = dealCards[0];

      if (firstDealCard) {
        fireEvent.click(firstDealCard);
        expect(mockNavigate).toHaveBeenCalled();
      }
    });
  });

  describe('Alerts Section', () => {
    it('displays price alerts section when alerts exist', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/your price alerts/i)).toBeInTheDocument();
      });
    });

    it('displays alert route information', async () => {
      renderDashboard();

      await waitFor(() => {
        const container = document.body;
        expect(container.textContent).toContain('JFK');
      });
    });

    it('displays alert price threshold', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/alert when under \$500/i)).toBeInTheDocument();
      });
    });

    it('hides alerts section when no alerts exist', async () => {
      (api.getAlerts as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [],
        meta: { count: 0 },
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/trending deals/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/your price alerts/i)).not.toBeInTheDocument();
    });

    it('shows View All button for alerts', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/view all/i)).toBeInTheDocument();
      });
    });

    it('navigates to alerts page when View All is clicked', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/view all/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/view all/i));
      expect(mockNavigate).toHaveBeenCalledWith('/alerts');
    });
  });

  describe('Features Section', () => {
    it('renders why choose section', async () => {
      renderDashboard();

      expect(screen.getByText(/why choose flydeal/i)).toBeInTheDocument();
    });

    it('displays feature cards', async () => {
      renderDashboard();

      expect(screen.getByText(/smart search/i)).toBeInTheDocument();
      expect(screen.getByText(/price alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/best prices/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles deals fetch error gracefully', async () => {
      (api.getDeals as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Fetch failed'));

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/trending deals/i)).toBeInTheDocument();
      });
    });

    it('handles alerts fetch error gracefully', async () => {
      (api.getAlerts as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Fetch failed'));

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/trending deals/i)).toBeInTheDocument();
      });
    });
  });
});
