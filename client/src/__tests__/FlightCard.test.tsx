import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from '../components/FlightCard';
import type { FlightOffer } from '@flydeal/types';

const mockFlight: FlightOffer = {
  id: 'TEST1',
  source: 'GDS',
  instantTicketingRequired: false,
  nonHomogeneous: false,
  oneWay: true,
  lastTicketingDate: '2025-06-15',
  numberOfBookableSeats: 5,
  itineraries: [
    {
      duration: 'PT7H30M',
      segments: [
        {
          departure: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2025-06-15T08:00:00',
          },
          arrival: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2025-06-15T15:30:00',
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
    base: '380.00',
    fees: [{ amount: '70.00', type: 'SUPPLIER' }],
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
        base: '380.00',
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
            at: '2025-06-22T10:00:00',
          },
          arrival: {
            iataCode: 'JFK',
            terminal: '1',
            at: '2025-06-22T18:00:00',
          },
          carrierCode: 'BA',
          number: '177',
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
            at: '2025-06-15T08:00:00',
          },
          arrival: {
            iataCode: 'ORD',
            at: '2025-06-15T10:30:00',
          },
          carrierCode: 'BA',
          number: '178',
          aircraft: { code: '737' },
          duration: 'PT2H30M',
          id: '1',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
        {
          departure: {
            iataCode: 'ORD',
            at: '2025-06-15T12:00:00',
          },
          arrival: {
            iataCode: 'LHR',
            terminal: '5',
            at: '2025-06-15T18:30:00',
          },
          carrierCode: 'BA',
          number: '179',
          aircraft: { code: '777' },
          duration: 'PT7H30M',
          id: '2',
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
};

describe('FlightCard', () => {
  describe('Rendering', () => {
    it('should render airline code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('BA')).toBeInTheDocument();
    });

    it('should render airline name from carriers dictionary', () => {
      render(
        <FlightCard
          flight={mockFlight}
          carriers={{ BA: 'British Airways' }}
        />
      );

      expect(screen.getAllByText('British Airways').length).toBeGreaterThan(0);
    });

    it('should render departure airport code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('JFK')).toBeInTheDocument();
    });

    it('should render arrival airport code', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('LHR')).toBeInTheDocument();
    });

    it('should render price', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('$450')).toBeInTheDocument();
    });

    it('should render flight duration', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText('7h 30m')).toBeInTheDocument();
    });

    it('should render Nonstop for direct flights', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getAllByText('Nonstop').length).toBeGreaterThan(0);
    });

    it('should render stop count for connecting flights', () => {
      render(<FlightCard flight={mockFlightWithStops} />);

      expect(screen.getAllByText('1 stop').length).toBeGreaterThan(0);
    });
  });

  describe('Round trip flights', () => {
    it('should render return flight details', () => {
      render(<FlightCard flight={mockRoundTripFlight} />);

      const lhrElements = screen.getAllByText('LHR');
      const jfkElements = screen.getAllByText('JFK');

      expect(lhrElements.length).toBeGreaterThan(1);
      expect(jfkElements.length).toBeGreaterThan(1);
    });

    it('should render return flight duration', () => {
      render(<FlightCard flight={mockRoundTripFlight} />);

      expect(screen.getByText('8h 0m')).toBeInTheDocument();
    });
  });

  describe('Set Alert button', () => {
    it('should render Set Alert button when onSetAlert is provided', () => {
      const mockOnSetAlert = vi.fn();
      render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

      expect(screen.getByRole('button', { name: /set alert/i })).toBeInTheDocument();
    });

    it('should not render Set Alert button when onSetAlert is not provided', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.queryByRole('button', { name: /set alert/i })).not.toBeInTheDocument();
    });

    it('should call onSetAlert when clicked', () => {
      const mockOnSetAlert = vi.fn();
      render(<FlightCard flight={mockFlight} onSetAlert={mockOnSetAlert} />);

      const button = screen.getByRole('button', { name: /set alert/i });
      fireEvent.click(button);

      expect(mockOnSetAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('Price display', () => {
    it('should display per person for single traveler', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText(/per person/i)).toBeInTheDocument();
    });

    it('should display total for multiple travelers', () => {
      const multiTravelerFlight: FlightOffer = {
        ...mockFlight,
        travelerPricings: [
          mockFlight.travelerPricings[0],
          {
            ...mockFlight.travelerPricings[0],
            travelerId: '2',
          },
        ],
      };

      render(<FlightCard flight={multiTravelerFlight} />);

      expect(screen.getByText(/total/i)).toBeInTheDocument();
    });
  });

  describe('Time formatting', () => {
    it('should format departure time correctly', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText(/08:00/i)).toBeInTheDocument();
    });

    it('should format arrival time correctly', () => {
      render(<FlightCard flight={mockFlight} />);

      expect(screen.getByText(/03:30/i)).toBeInTheDocument();
    });
  });
});
