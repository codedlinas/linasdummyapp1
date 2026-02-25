import { FlightSearchParams, FlightSearchResponse } from '../../../types/index.js';
import { searchMockFlights } from '../mocks/flights.js';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

export function isLiveMode(): boolean {
  return !!(AMADEUS_API_KEY && AMADEUS_API_SECRET);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    throw new Error('Amadeus API credentials not configured');
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Amadeus access token: ${error}`);
  }

  const data = (await response.json()) as TokenResponse;
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  if (!isLiveMode()) {
    console.log('[Amadeus] Using mock data (API keys not configured)');
    return searchMockFlights(
      params.origin,
      params.destination,
      params.departureDate,
      params.returnDate || null,
      params.adults
    );
  }

  try {
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      originLocationCode: params.origin.toUpperCase(),
      destinationLocationCode: params.destination.toUpperCase(),
      departureDate: params.departureDate,
      adults: String(params.adults || 1),
      currencyCode: params.currencyCode || 'USD',
      max: '50',
    });

    if (params.returnDate) {
      queryParams.set('returnDate', params.returnDate);
    }
    if (params.children) {
      queryParams.set('children', String(params.children));
    }
    if (params.infants) {
      queryParams.set('infants', String(params.infants));
    }
    if (params.travelClass) {
      queryParams.set('travelClass', params.travelClass);
    }
    if (params.nonStop !== undefined) {
      queryParams.set('nonStop', String(params.nonStop));
    }
    if (params.maxPrice) {
      queryParams.set('maxPrice', String(params.maxPrice));
    }

    const response = await fetch(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[Amadeus] API error:', error);
      console.log('[Amadeus] Falling back to mock data');
      return searchMockFlights(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate || null,
        params.adults
      );
    }

    return (await response.json()) as FlightSearchResponse;
  } catch (error) {
    console.error('[Amadeus] Error:', error);
    console.log('[Amadeus] Falling back to mock data');
    return searchMockFlights(
      params.origin,
      params.destination,
      params.departureDate,
      params.returnDate || null,
      params.adults
    );
  }
}
