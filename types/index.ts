export interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

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

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  grandTotal: string;
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
  price: FlightPrice;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
  };
  fareDetailsBySegment: FareDetails[];
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags?: {
    weight?: number;
    weightUnit?: string;
    quantity?: number;
  };
}

export interface SearchQuery {
  id?: number;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}

export interface SearchHistory {
  id: number;
  userId?: number;
  query: SearchQuery;
  createdAt: string;
  resultsCount: number;
  lowestPrice?: number;
}

export interface PriceAlert {
  id: number;
  userId?: number;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  targetPrice: number;
  currentPrice?: number;
  isActive: boolean;
  notificationEmail?: string;
  createdAt: string;
  updatedAt: string;
  lastCheckedAt?: string;
}

export interface Deal {
  id: number;
  originLocationCode: string;
  destinationLocationCode: string;
  originCity: string;
  destinationCity: string;
  price: number;
  currency: string;
  departureDate: string;
  returnDate?: string;
  airline: string;
  discount?: number;
  isHot: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    count?: number;
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    locations?: Record<string, { cityCode: string; countryCode: string }>;
  };
}

export interface Notification {
  id: number;
  userId?: number;
  alertId: number;
  type: 'price_drop' | 'price_alert' | 'deal';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
