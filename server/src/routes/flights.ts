import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

interface SearchQuery {
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

interface FlightSearchResponse {
  data: FlightOffer[];
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    locations?: Record<string, { cityCode: string; countryCode: string }>;
  };
}

interface FlightOffer {
  id: string;
  price: { grandTotal: string; currency: string };
  [key: string]: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mockFlights: FlightSearchResponse = JSON.parse(
  readFileSync(join(__dirname, '../mocks/flights.json'), 'utf-8')
);
const airports: Airport[] = JSON.parse(
  readFileSync(join(__dirname, '../mocks/airports.json'), 'utf-8')
);

const router = Router();

const USE_MOCK = !process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET;

async function getAmadeusToken(): Promise<string> {
  const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_API_KEY!,
      client_secret: process.env.AMADEUS_API_SECRET!,
    }),
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

async function searchAmadeusFlights(query: SearchQuery): Promise<FlightSearchResponse> {
  const token = await getAmadeusToken();
  
  const params = new URLSearchParams({
    originLocationCode: query.originLocationCode,
    destinationLocationCode: query.destinationLocationCode,
    departureDate: query.departureDate,
    adults: String(query.adults || 1),
    currencyCode: query.currencyCode || 'USD',
    max: String(query.max || 10),
  });

  if (query.returnDate) {
    params.append('returnDate', query.returnDate);
  }
  if (query.children) {
    params.append('children', String(query.children));
  }
  if (query.infants) {
    params.append('infants', String(query.infants));
  }
  if (query.travelClass) {
    params.append('travelClass', query.travelClass);
  }
  if (query.nonStop) {
    params.append('nonStop', String(query.nonStop));
  }
  if (query.maxPrice) {
    params.append('maxPrice', String(query.maxPrice));
  }

  const response = await fetch(
    `https://api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json() as Promise<FlightSearchResponse>;
}

function getMockFlights(_query: SearchQuery): FlightSearchResponse {
  return mockFlights as FlightSearchResponse;
}

router.post('/search', async (req: Request, res: Response) => {
  try {
    const query: SearchQuery = req.body;

    if (!query.originLocationCode || !query.destinationLocationCode || !query.departureDate) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: originLocationCode, destinationLocationCode, departureDate',
      } as ApiResponse<null>);
      return;
    }

    let result: FlightSearchResponse;

    if (USE_MOCK) {
      result = getMockFlights(query);
    } else {
      result = await searchAmadeusFlights(query);
    }

    const sortedData = [...result.data].sort(
      (a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal)
    );

    const db = getDb();
    const lowestPrice = sortedData.length > 0 ? parseFloat(sortedData[0].price.grandTotal) : null;
    
    db.prepare(`
      INSERT INTO search_history (
        origin_location_code, destination_location_code, departure_date,
        return_date, adults, children, infants, travel_class, non_stop,
        results_count, lowest_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      query.originLocationCode,
      query.destinationLocationCode,
      query.departureDate,
      query.returnDate || null,
      query.adults || 1,
      query.children || 0,
      query.infants || 0,
      query.travelClass || 'ECONOMY',
      query.nonStop ? 1 : 0,
      sortedData.length,
      lowestPrice
    );

    res.json({
      success: true,
      data: {
        ...result,
        data: sortedData,
      },
      meta: {
        count: sortedData.length,
        useMock: USE_MOCK,
      },
    } as ApiResponse<FlightSearchResponse>);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search flights',
    } as ApiResponse<null>);
  }
});

router.get('/airports', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: airports,
  });
});

router.get('/airports/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  
  if (!query || query.length < 2) {
    res.json({ success: true, data: [] });
    return;
  }

  const filtered = airports.filter(
    (airport) =>
      airport.iataCode.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    data: filtered.slice(0, 10),
  });
});

export default router;
