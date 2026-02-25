export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  carrierName?: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: {
      amount: string;
      type: string;
    }[];
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: {
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags?: {
        weight?: number;
        weightUnit?: string;
        quantity?: number;
      };
    }[];
  }[];
}

export interface Alert {
  id: number;
  origin: string;
  destination: string;
  maxPrice: number;
  email: string;
  createdAt: string;
  currentPrice?: number;
}

export interface SearchHistory {
  id: number;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  searchedAt: string;
}

export interface Deal {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  price: number;
  currency: string;
  airline: string;
  departureDate: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
