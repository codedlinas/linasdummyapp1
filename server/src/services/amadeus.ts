import { FlightOffer, FlightSearchParams } from '../../../types/index.js';
import { generateMockFlights, generateMockDeals, airlines } from '../mocks/flights.js';

interface AmadeusToken {
  accessToken: string;
  expiresAt: number;
}

interface AmadeusFlightSegment {
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
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
}

interface AmadeusItinerary {
  duration: string;
  segments: AmadeusFlightSegment[];
}

interface AmadeusFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags?: {
        weight?: number;
        weightUnit?: string;
        quantity?: number;
      };
    }>;
  }>;
}

interface AmadeusResponse {
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: AmadeusFlightOffer[];
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
  };
}

class AmadeusClient {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private token: AmadeusToken | null = null;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY;
    this.apiSecret = process.env.AMADEUS_API_SECRET;
    this.baseUrl = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
  }

  private isConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret);
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.accessToken;
    }

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Amadeus API credentials not configured');
    }

    const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Amadeus access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };

    this.token = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return this.token.accessToken;
  }

  private mapAmadeusResponse(
    response: AmadeusResponse,
    carrierDict: Record<string, string>
  ): FlightOffer[] {
    return response.data.map((offer) => ({
      id: offer.id,
      source: offer.source,
      instantTicketingRequired: offer.instantTicketingRequired,
      nonHomogeneous: offer.nonHomogeneous,
      oneWay: offer.oneWay,
      lastTicketingDate: offer.lastTicketingDate,
      numberOfBookableSeats: offer.numberOfBookableSeats,
      itineraries: offer.itineraries.map((itinerary) => ({
        duration: itinerary.duration,
        segments: itinerary.segments.map((segment) => ({
          departure: segment.departure,
          arrival: segment.arrival,
          carrierCode: segment.carrierCode,
          carrierName: carrierDict[segment.carrierCode] || airlines[segment.carrierCode] || segment.carrierCode,
          number: segment.number,
          aircraft: segment.aircraft,
          duration: segment.duration,
          numberOfStops: segment.numberOfStops,
        })),
      })),
      price: offer.price,
      pricingOptions: offer.pricingOptions,
      validatingAirlineCodes: offer.validatingAirlineCodes,
      travelerPricings: offer.travelerPricings,
    }));
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    if (!this.isConfigured()) {
      console.log('Amadeus API not configured, using mock data');
      return generateMockFlights(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate,
        params.passengers
      );
    }

    try {
      const token = await this.getAccessToken();

      const queryParams = new URLSearchParams({
        originLocationCode: params.origin.toUpperCase(),
        destinationLocationCode: params.destination.toUpperCase(),
        departureDate: params.departureDate,
        adults: String(params.passengers),
        currencyCode: 'USD',
        max: '50',
      });

      if (params.returnDate) {
        queryParams.append('returnDate', params.returnDate);
      }

      const response = await fetch(
        `${this.baseUrl}/v2/shopping/flight-offers?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Amadeus API error: ${response.status} - ${errorText}`);
        console.log('Falling back to mock data');
        return generateMockFlights(
          params.origin,
          params.destination,
          params.departureDate,
          params.returnDate,
          params.passengers
        );
      }

      const data = await response.json() as AmadeusResponse;
      const carrierDict = data.dictionaries?.carriers || {};

      const flights = this.mapAmadeusResponse(data, carrierDict);
      return flights.sort((a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal));
    } catch (error) {
      console.error('Error calling Amadeus API:', error);
      console.log('Falling back to mock data');
      return generateMockFlights(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate,
        params.passengers
      );
    }
  }

  async getDeals(): Promise<ReturnType<typeof generateMockDeals>> {
    return generateMockDeals();
  }

  getStatus(): { configured: boolean; baseUrl: string } {
    return {
      configured: this.isConfigured(),
      baseUrl: this.baseUrl,
    };
  }
}

export const amadeusClient = new AmadeusClient();
export default amadeusClient;
