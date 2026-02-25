import { Router, Request, Response } from 'express';
import { amadeusClient } from '../services/amadeus.js';
import { Deal, ApiResponse } from '../../../types/index.js';

const router = Router();

interface CachedDeals {
  deals: Deal[];
  cachedAt: number;
}

let dealsCache: CachedDeals | null = null;
const CACHE_DURATION_MS = 15 * 60 * 1000;

router.get('/', async (_req: Request, res: Response<ApiResponse<Deal[]>>) => {
  try {
    const now = Date.now();
    
    if (dealsCache && (now - dealsCache.cachedAt) < CACHE_DURATION_MS) {
      return res.json({
        success: true,
        data: dealsCache.deals,
        message: `Returning ${dealsCache.deals.length} cached deals`,
      });
    }

    const deals = await amadeusClient.getDeals();
    
    dealsCache = {
      deals,
      cachedAt: now,
    };

    return res.json({
      success: true,
      data: deals,
      message: `Found ${deals.length} trending deals`,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch deals',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

router.get('/refresh', async (_req: Request, res: Response<ApiResponse<Deal[]>>) => {
  try {
    const deals = await amadeusClient.getDeals();
    
    dealsCache = {
      deals,
      cachedAt: Date.now(),
    };

    return res.json({
      success: true,
      data: deals,
      message: `Refreshed ${deals.length} deals`,
    });
  } catch (error) {
    console.error('Error refreshing deals:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to refresh deals',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

export default router;
