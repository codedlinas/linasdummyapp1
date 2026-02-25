import { Router, Request, Response } from 'express';
import { searchFlights, isLiveMode } from '../services/amadeus.js';
import { addSearchHistory } from '../db.js';
import { FlightSearchParams } from '../../../types/index.js';

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { origin, destination, departureDate, returnDate, adults, children, infants, travelClass, nonStop, maxPrice } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        error: 'Missing required parameters: origin, destination, and departureDate are required',
      });
    }

    const originCode = (origin as string).toUpperCase();
    const destCode = (destination as string).toUpperCase();

    if (originCode.length !== 3 || destCode.length !== 3) {
      return res.status(400).json({
        error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
      });
    }

    const params: FlightSearchParams = {
      origin: originCode,
      destination: destCode,
      departureDate: departureDate as string,
      returnDate: returnDate as string | undefined,
      adults: parseInt(adults as string) || 1,
      children: children ? parseInt(children as string) : undefined,
      infants: infants ? parseInt(infants as string) : undefined,
      travelClass: travelClass as FlightSearchParams['travelClass'],
      nonStop: nonStop === 'true',
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
    };

    const results = await searchFlights(params);

    addSearchHistory(
      params.origin,
      params.destination,
      params.departureDate,
      params.returnDate || null,
      params.adults,
      results.data.length
    );

    res.json(results);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

router.get('/status', (req: Request, res: Response) => {
  const mode = isLiveMode() ? 'live' : 'mock';
  res.json({
    mode,
    message: mode === 'live'
      ? 'Connected to Amadeus API'
      : 'Using mock data (set AMADEUS_API_KEY and AMADEUS_API_SECRET for live data)',
  });
});

export default router;
