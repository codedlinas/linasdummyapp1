import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { insertAlert, getAlerts, getAlertById, deleteAlert } from '../db.js';
import { Alert, ApiResponse } from '../../../types/index.js';

const router = Router();

const createAlertValidation = [
  body('origin')
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Origin must be a 3-letter IATA code'),
  body('destination')
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination must be a 3-letter IATA code'),
  body('maxPrice')
    .isFloat({ min: 1 })
    .withMessage('Max price must be a positive number'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
];

router.post(
  '/',
  createAlertValidation,
  async (req: Request, res: Response<ApiResponse<Alert>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const { origin, destination, maxPrice, email } = req.body;

    try {
      const alert = insertAlert(origin, destination, maxPrice, email);

      return res.status(201).json({
        success: true,
        data: alert,
        message: `Alert created for ${origin} to ${destination} under $${maxPrice}`,
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create alert',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

router.get(
  '/',
  [
    query('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
  ],
  async (req: Request, res: Response<ApiResponse<Alert[]>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const { email } = req.query as { email?: string };

    try {
      const alerts = getAlerts(email);

      return res.json({
        success: true,
        data: alerts,
        message: `Found ${alerts.length} alerts`,
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

router.get(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Alert ID must be a positive integer'),
  ],
  async (req: Request, res: Response<ApiResponse<Alert>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const id = parseInt(req.params.id, 10);

    try {
      const alert = getAlertById(id);

      if (!alert) {
        return res.status(404).json({
          success: false,
          error: 'Not found',
          message: `Alert with ID ${id} not found`,
        });
      }

      return res.json({
        success: true,
        data: alert,
      });
    } catch (error) {
      console.error('Error fetching alert:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch alert',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

router.delete(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Alert ID must be a positive integer'),
  ],
  async (req: Request, res: Response<ApiResponse<{ deleted: boolean }>>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const id = parseInt(req.params.id, 10);

    try {
      const deleted = deleteAlert(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Not found',
          message: `Alert with ID ${id} not found`,
        });
      }

      return res.json({
        success: true,
        data: { deleted: true },
        message: `Alert ${id} deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete alert',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
);

export default router;
