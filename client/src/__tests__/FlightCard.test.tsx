import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from '../components/FlightCard';
import type { FlightOffer } from '@flydeal/types';

const mockFlight: FlightOffer = {
  id: 'TEST123',
  source: 'GDS',
  instantTicketingRequired: false,
  nonHomogeneous: false,
  oneWay: true,
  lastTicketingDate: '2026-04-01',
  numberOfBookableSeats: 5,
  itineraries: [
    {
      duration: 'PT7H30M',
      segments: [
        {
          departure: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2026-04-01T08:00:00',
          },
          arrival: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2026-04-01T20:30:00',
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
  oneWay: false,
  itineraries: [
    mockFlight.itineraries[0],
    {
      duration: 'PT8H00M',
      segments: [
        {
          departure: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2026-04-08T10:00:00',
          },
          arrival: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2026-04-08T13:00:00',
          },
          carrierCode: 'BA',
          number: '179',
          aircraft: { code: '777' },
          duration: 'PT8H00M',
          id: '2',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
};

const mockFlightWithStops: FlightOffer = {
  ...mockFlight,
  itineraries: [
    {
      duration: 'PT10H30M',
      segments: [
        {
          departure: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2026-04-01T08:00:00',
          },
          arrival: {
            iataCode: 'ORD',
            at: '2026-04-01T10:00:00',
          },
          carrierCode: 'AA',
          number: '100',
          aircraft: { code: '737' },
          duration: 'PT2H00M',
          id: '1',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
        {
          departure: {
            iataCode: 'ORD',
            at: '2026-04-01T12:00:00',
          },
          arrival: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2026-04-01T23:30:00',
          },
          carrierCode: 'AA',
          number: '200',
          aircraft: { code: '777' },
          duration: 'PT8H30M',
          id: '2',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
};

describe('FlightCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders flight card', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('BA')).toBeInTheDocument();
    });

    it('displays airline code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('BA')).toBeInTheDocument();
    });

    it('displays departure airport code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('JFK')).toBeInTheDocument();
    });

    it('displays arrival airport code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('LHR')).toBeInTheDocument();
    });

    it('displays flight price', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('$450')).toBeInTheDocument();
    });

    it('displays duration', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('7h 30m')).toBeInTheDocument();
    });
  });

  describe('Stops Display', () => {
    it('displays "Nonstop" for direct flights', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getAllByText('Nonstop').length).toBeGreaterThan(0);
    });

    it('displays stop count for connecting flights', () => {
      render(<FlightCard flight={mockFlightWithStops} />);

      expect(screen.getAllByText('1 stop').length).toBeGreaterThan(0);
    });
  });

  describe('Round Trip Display', () => {
    it('displays both outbound and return itineraries', () => {
      render(<FlightCard flight={mockRoundTripFlight} />);

      expect(screen.getAllByText('JFK').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('LHR').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('8h 0m')).toBeInTheDocument();
    });
  });

  describe('Airline Name Display', () => {
    it('displays airline name from carriers dictionary', () => {
      render(
        <FlightCard
          flight={mockFlight}
          carriers={{ BA: 'British Airways' }}
        />
      );

      expect(screen.getAllByText('British Airways').length).toBeGreaterThan(0);
    });

    it('displays airline name from AIRLINE_NAMES when not in carriers', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getAllByText('British Airways').length).toBeGreaterThan(0);
    });
  });

  describe('Set Alert Button', () => {
    it('renders Set Alert button when onSetAlert is provided', () => {
      const mockOnSetAlert = vi.fn();
      render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

      expect(screen.getByRole('button', { name: /set alert/i })).toBeInTheDocument();
    });

    it('does not render Set Alert button when onSetAlert is not provided', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.queryByRole('button', { name: /set alert/i })).not.toBeInTheDocument();
    });

    it('calls onSetAlert when Set Alert button is clicked', () => {
      const mockOnSetAlert = vi.fn();
      render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

      fireEvent.click(screen.getByRole('button', { name: /set alert/i }));

      expect(mockOnSetAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('Price Display', () => {
    it('displays per person text for single traveler', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('per person')).toBeInTheDocument();
    });

    it('displays total text for multiple travelers', () => {
      const multiTravelerFlight = {
        ...mockFlight,
        travelerPricings: [
          mockFlight.travelerPricings[0],
          { ...mockFlight.travelerPricings[0], travelerId: '2' },
        ],
      };
      render(<FlightCard flight={multiTravelerFlight} />);

      expect(screen.getByText('total')).toBeInTheDocument();
    });
  });

  describe('Time Formatting', () => {
    it('displays departure time in readable format', () => {
      render(<FlightCard flight={mockFlight} />);

      const timeRegex = /\d{1,2}:\d{2}\s*(AM|PM)/i;
      const allText = document.body.textContent || '';
      expect(timeRegex.test(allText)).toBe(true);
    });
  });
});
