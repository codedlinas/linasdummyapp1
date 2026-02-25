import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { amadeusClient } from '../services/amadeus.js';
import { insertSearch } from '../db.js';
import { FlightSearchParams, ApiResponse, FlightOffer } from '../../../types/index.js';

const router = Router();

const searchValidation = [
  query('origin')
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Origin must be a 3-letter IATA code'),
  query('destination')
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination must be a 3-letter IATA code'),
  query('departureDate')
    .isISO8601()
    .withMessage('Departure date must be in YYYY-MM-DD format'),
  query('returnDate')
    .optional()
    .isISO8601()
    .withMessage('Return date must be in YYYY-MM-DD format'),
  query('passengers')
    .optional()
    .isInt({ min: 1, max: 9 })
    .withMessage('Passengers must be between 1 and 9'),
];

router.get(
  '/search',
  searchValidation,
  async (req: Request, res: Response<ApiResponse<FlightOffer[]>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = '1',
    } = req.query as Record<string, string>;

    const searchParams: FlightSearchParams = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      returnDate: returnDate || undefined,
      passengers: parseInt(passengers, 10),
    };

    try {
      insertSearch(
        searchParams.origin,
        searchParams.destination,
        searchParams.departureDate,
        searchParams.returnDate,
        searchParams.passengers
      );
    } catch (dbError) {
      console.error('Failed to save search history:', dbError);
    }

    try {
      const flights = await amadeusClient.searchFlights(searchParams);

      return res.json({
        success: true,
        data: flights,
        message: `Found ${flights.length} flights from ${searchParams.origin} to ${searchParams.destination}`,
      });
    } catch (error) {
      console.error('Flight search error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to search flights',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

router.get('/status', (_req: Request, res: Response) => {
  const status = amadeusClient.getStatus();
  res.json({
    success: true,
    data: {
      ...status,
      message: status.configured
        ? 'Amadeus API is configured and ready'
        : 'Using mock data (no API keys configured)',
    },
  });
});

export default router;
