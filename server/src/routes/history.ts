import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { getHistory, clearHistory } from '../db.js';
import { SearchHistory, ApiResponse } from '../../../types/index.js';

const router = Router();

router.get(
  '/',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  async (req: Request, res: Response<ApiResponse<SearchHistory[]>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const limit = parseInt(req.query.limit as string, 10) || 20;

    try {
      const history = getHistory(limit);

      return res.json({
        success: true,
        data: history,
        message: `Found ${history.length} recent searches`,
      });
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch history',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

router.delete('/', async (_req: Request, res: Response<ApiResponse<{ cleared: boolean }>>) => {
  try {
    clearHistory();

    return res.json({
      success: true,
      data: { cleared: true },
      message: 'Search history cleared',
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear history',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

export default router;
