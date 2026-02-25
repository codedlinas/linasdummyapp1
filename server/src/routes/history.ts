import { Router, Request, Response } from 'express';
import { getRecentSearchHistory } from '../db.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = getRecentSearchHistory(Math.min(limit, 100));
    
    res.json({
      data: history,
      meta: {
        count: history.length,
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

export default router;
