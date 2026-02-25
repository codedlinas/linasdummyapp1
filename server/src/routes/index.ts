import { Router } from 'express';
import flightsRouter from './flights.js';
import dealsRouter from './deals.js';
import alertsRouter from './alerts.js';
import historyRouter from './history.js';

const router = Router();

router.use('/flights', flightsRouter);
router.use('/deals', dealsRouter);
router.use('/alerts', alertsRouter);
router.use('/history', historyRouter);

export default router;
