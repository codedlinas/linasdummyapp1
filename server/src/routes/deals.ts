import { Router, Request, Response } from 'express';
import { getMockDeals } from '../mocks/flights.js';
import { Deal } from '../../../types/index.js';

const router = Router();

let cachedDeals: Deal[] | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000;

router.get('/', (req: Request, res: Response) => {
  try {
    const now = Date.now();
    
    if (!cachedDeals || now - cacheTime > CACHE_DURATION) {
      cachedDeals = getMockDeals();
      cacheTime = now;
      console.log('[Deals] Cache refreshed');
    }

    res.json({
      data: cachedDeals,
      meta: {
        count: cachedDeals.length,
        cached: now - cacheTime < 1000 ? false : true,
        cacheAge: Math.round((now - cacheTime) / 1000),
      },
    });
  } catch (error) {
    console.error('Deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

export default router;
