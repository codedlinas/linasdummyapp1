import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';

interface SearchHistoryRow {
  id: number;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  nonStop: number;
  resultsCount: number;
  lowestPrice?: number;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const db = getDb();

    const history = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        children,
        infants,
        travel_class as travelClass,
        non_stop as nonStop,
        results_count as resultsCount,
        lowest_price as lowestPrice,
        created_at as createdAt
      FROM search_history
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(Number(limit), Number(offset)) as SearchHistoryRow[];

    const total = db.prepare('SELECT COUNT(*) as count FROM search_history').get() as { count: number };

    res.json({
      success: true,
      data: history.map(item => ({
        ...item,
        nonStop: Boolean(item.nonStop),
        query: {
          originLocationCode: item.originLocationCode,
          destinationLocationCode: item.destinationLocationCode,
          departureDate: item.departureDate,
          returnDate: item.returnDate,
          adults: item.adults,
          children: item.children,
          infants: item.infants,
          travelClass: item.travelClass,
          nonStop: Boolean(item.nonStop),
        },
      })),
      meta: {
        count: history.length,
        total: total.count,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    } as ApiResponse<null>);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const item = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        children,
        infants,
        travel_class as travelClass,
        non_stop as nonStop,
        results_count as resultsCount,
        lowest_price as lowestPrice,
        created_at as createdAt
      FROM search_history WHERE id = ?
    `).get(id) as SearchHistoryRow | undefined;

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Search history item not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...item,
        query: {
          originLocationCode: item.originLocationCode,
          destinationLocationCode: item.destinationLocationCode,
          departureDate: item.departureDate,
          returnDate: item.returnDate,
          adults: item.adults,
          children: item.children,
          infants: item.infants,
          travelClass: item.travelClass,
          nonStop: Boolean(item.nonStop),
        },
      },
    });
  } catch (error) {
    console.error('Get history item error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history item',
    } as ApiResponse<null>);
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM search_history WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Search history item not found',
      } as ApiResponse<null>);
      return;
    }

    db.prepare('DELETE FROM search_history WHERE id = ?').run(id);

    res.json({
      success: true,
      data: { id: Number(id) },
    } as ApiResponse<{ id: number }>);
  } catch (error) {
    console.error('Delete history item error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete history item',
    } as ApiResponse<null>);
  }
});

router.delete('/', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM search_history').run();

    res.json({
      success: true,
      data: { message: 'All search history cleared' },
    } as ApiResponse<{ message: string }>);
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear history',
    } as ApiResponse<null>);
  }
});

export default router;
