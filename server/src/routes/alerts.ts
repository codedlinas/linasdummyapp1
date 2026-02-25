import { Router, Request, Response } from 'express';
import { createAlert, getAllAlerts, deleteAlert, getAlertById } from '../db.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { origin, destination, maxPrice, email } = req.body;

    if (!origin || !destination || !maxPrice || !email) {
      return res.status(400).json({
        error: 'Missing required fields: origin, destination, maxPrice, and email are required',
      });
    }

    const originCode = origin.toUpperCase();
    const destCode = destination.toUpperCase();

    if (originCode.length !== 3 || destCode.length !== 3) {
      return res.status(400).json({
        error: 'Invalid airport codes. Origin and destination must be 3-letter IATA codes.',
      });
    }

    const price = parseFloat(maxPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        error: 'Invalid maxPrice. Must be a positive number.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email address.',
      });
    }

    const alert = createAlert(originCode, destCode, price, email);
    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const alerts = getAllAlerts(email as string | undefined);
    res.json({
      data: alerts,
      meta: {
        count: alerts.length,
      },
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid alert ID' });
    }

    const alert = getAlertById(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const deleted = deleteAlert(id);
    
    if (deleted) {
      res.json({ success: true, message: 'Alert deleted' });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
