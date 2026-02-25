import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from '../components/FlightCard';
import type { FlightOffer } from '@flydeal/types';

const mockFlight: FlightOffer = {
  id: 'ABC123',
  source: 'GDS',
  instantTicketingRequired: false,
  nonHomogeneous: false,
  oneWay: true,
  lastTicketingDate: '2026-06-15',
  numberOfBookableSeats: 5,
  itineraries: [
    {
      duration: 'PT7H30M',
      segments: [
        {
          departure: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2026-06-15T08:00:00',
          },
          arrival: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2026-06-15T20:30:00',
          },
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
    base: '382.50',
    fees: [{ amount: '67.50', type: 'SUPPLIER' }],
    grandTotal: '450.00',
  },
  pricingOptions: {
    fareType: ['PUBLISHED'],
    includedCheckedBagsOnly: true,
  },
  validatingAirlineCodes: ['BA'],
  travelerPricings: [
    {
      travelerId: '1',
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: {
        currency: 'USD',
        total: '450.00',
        base: '382.50',
      },
      fareDetailsBySegment: [
        {
          segmentId: '1',
          cabin: 'ECONOMY',
          fareBasis: 'YOWUS',
          class: 'Y',
          includedCheckedBags: { quantity: 1 },
        },
      ],
    },
  ],
};

const mockRoundTripFlight: FlightOffer = {
  ...mockFlight,
  id: 'DEF456',
  oneWay: false,
  itineraries: [
    mockFlight.itineraries[0],
    {
      duration: 'PT8H15M',
      segments: [
        {
          departure: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2026-06-22T10:00:00',
          },
          arrival: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2026-06-22T13:15:00',
          },
          carrierCode: 'BA',
          number: '179',
          aircraft: { code: '777' },
          duration: 'PT8H15M',
          id: '2',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
};

describe('FlightCard Component', () => {
  it('should render flight card with basic information', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('BA')).toBeInTheDocument();
    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LHR')).toBeInTheDocument();
    expect(screen.getByText('$450')).toBeInTheDocument();
  });

  it('should display departure and arrival airports', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('JFK')).toBeInTheDocument();
    expect(screen.getByText('LHR')).toBeInTheDocument();
  });

  it('should display flight duration', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('7h 30m')).toBeInTheDocument();
  });

  it('should display price in correct format', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('$450')).toBeInTheDocument();
  });

  it('should show "Nonstop" for direct flights', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getAllByText('Nonstop').length).toBeGreaterThan(0);
  });

  it('should display airline code', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('BA')).toBeInTheDocument();
  });

  it('should render Set Alert button when onSetAlert is provided', () => {
    const mockOnSetAlert = vi.fn();
    render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

    expect(screen.getByText('Set Alert')).toBeInTheDocument();
  });

  it('should not render Set Alert button when onSetAlert is not provided', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.queryByText('Set Alert')).not.toBeInTheDocument();
  });

  it('should call onSetAlert when Set Alert button is clicked', () => {
    const mockOnSetAlert = vi.fn();
    render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

    fireEvent.click(screen.getByText('Set Alert'));
    expect(mockOnSetAlert).toHaveBeenCalledTimes(1);
  });

  it('should render return itinerary for round-trip flights', () => {
    render(<FlightCard flight={mockRoundTripFlight} />);

    expect(screen.getByText('8h 15m')).toBeInTheDocument();
  });

  it('should use carrier dictionary for airline name when provided', () => {
    const carriers = { BA: 'British Airways' };
    render(<FlightCard flight={mockFlight} carriers={carriers} />);

    const airlineElements = screen.getAllByText('British Airways');
    expect(airlineElements.length).toBeGreaterThan(0);
  });

  it('should display formatted departure time', () => {
    render(<FlightCard flight={mockFlight} />);

    const timeElements = screen.getAllByRole('paragraph');
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should handle flights with multiple segments (connections)', () => {
    const flightWithConnection: FlightOffer = {
      ...mockFlight,
      id: 'GHI789',
      itineraries: [
        {
          duration: 'PT12H45M',
          segments: [
            {
              departure: {
                iataCode: 'JFK',
                terminal: '1',
                at: '2026-06-15T08:00:00',
              },
              arrival: {
                iataCode: 'ORD',
                at: '2026-06-15T10:30:00',
              },
              carrierCode: 'AA',
              number: '100',
              aircraft: { code: '737' },
              duration: 'PT2H30M',
              id: '1',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: 'ORD',
                at: '2026-06-15T12:00:00',
              },
              arrival: {
                iataCode: 'LHR',
                terminal: '5',
                at: '2026-06-15T20:45:00',
              },
              carrierCode: 'AA',
              number: '200',
              aircraft: { code: '777' },
              duration: 'PT8H45M',
              id: '2',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
    };

    render(<FlightCard flight={flightWithConnection} />);

    expect(screen.getAllByText('1 stop').length).toBeGreaterThan(0);
  });
});
