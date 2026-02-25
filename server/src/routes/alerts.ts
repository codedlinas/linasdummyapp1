import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';

interface PriceAlert {
  id: number;
  userId?: number;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  targetPrice: number;
  currentPrice?: number;
  isActive: boolean | number;
  notificationEmail?: string;
  createdAt: string;
  updatedAt: string;
  lastCheckedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const alerts = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        target_price as targetPrice,
        current_price as currentPrice,
        is_active as isActive,
        notification_email as notificationEmail,
        created_at as createdAt,
        updated_at as updatedAt,
        last_checked_at as lastCheckedAt
      FROM price_alerts
      ORDER BY created_at DESC
    `).all() as PriceAlert[];

    res.json({
      success: true,
      data: alerts.map(alert => ({
        ...alert,
        isActive: Boolean(alert.isActive),
      })),
      meta: { count: alerts.length },
    } as ApiResponse<PriceAlert[]>);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch alerts',
    } as ApiResponse<null>);
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      targetPrice,
      notificationEmail,
    } = req.body;

    if (!originLocationCode || !destinationLocationCode || !departureDate || !targetPrice) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: originLocationCode, destinationLocationCode, departureDate, targetPrice',
      } as ApiResponse<null>);
      return;
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO price_alerts (
        origin_location_code, destination_location_code, departure_date,
        return_date, adults, target_price, notification_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate || null,
      adults || 1,
      targetPrice,
      notificationEmail || null
    );

    const alert = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        target_price as targetPrice,
        current_price as currentPrice,
        is_active as isActive,
        notification_email as notificationEmail,
        created_at as createdAt,
        updated_at as updatedAt,
        last_checked_at as lastCheckedAt
      FROM price_alerts WHERE id = ?
    `).get(result.lastInsertRowid) as PriceAlert;

    res.status(201).json({
      success: true,
      data: { ...alert, isActive: Boolean(alert.isActive) },
    } as ApiResponse<PriceAlert>);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create alert',
    } as ApiResponse<null>);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const alert = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        target_price as targetPrice,
        current_price as currentPrice,
        is_active as isActive,
        notification_email as notificationEmail,
        created_at as createdAt,
        updated_at as updatedAt,
        last_checked_at as lastCheckedAt
      FROM price_alerts WHERE id = ?
    `).get(id) as PriceAlert | undefined;

    if (!alert) {
      res.status(404).json({
        success: false,
        error: 'Alert not found',
      } as ApiResponse<null>);
      return;
    }

    res.json({
      success: true,
      data: { ...alert, isActive: Boolean(alert.isActive) },
    } as ApiResponse<PriceAlert>);
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch alert',
    } as ApiResponse<null>);
  }
});

router.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetPrice, isActive, notificationEmail } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM price_alerts WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Alert not found',
      } as ApiResponse<null>);
      return;
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (targetPrice !== undefined) {
      updates.push('target_price = ?');
      values.push(targetPrice);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }
    if (notificationEmail !== undefined) {
      updates.push('notification_email = ?');
      values.push(notificationEmail);
    }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(id);
      
      db.prepare(`UPDATE price_alerts SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const alert = db.prepare(`
      SELECT 
        id,
        origin_location_code as originLocationCode,
        destination_location_code as destinationLocationCode,
        departure_date as departureDate,
        return_date as returnDate,
        adults,
        target_price as targetPrice,
        current_price as currentPrice,
        is_active as isActive,
        notification_email as notificationEmail,
        created_at as createdAt,
        updated_at as updatedAt,
        last_checked_at as lastCheckedAt
      FROM price_alerts WHERE id = ?
    `).get(id) as PriceAlert;

    res.json({
      success: true,
      data: { ...alert, isActive: Boolean(alert.isActive) },
    } as ApiResponse<PriceAlert>);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update alert',
    } as ApiResponse<null>);
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM price_alerts WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Alert not found',
      } as ApiResponse<null>);
      return;
    }

    db.prepare('DELETE FROM price_alerts WHERE id = ?').run(id);

    res.json({
      success: true,
      data: { id: Number(id) },
    } as ApiResponse<{ id: number }>);
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete alert',
    } as ApiResponse<null>);
  }
});

export default router;
