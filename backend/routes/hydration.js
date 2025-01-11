import express from 'express';
import { addEntry, getHydrationLogs } from '../controllers/hydration.js';
// import { auth } from '../middleware/auth.js';
// import { hydrationValidator } from '../middleware/validator.js';
import { logger } from '../middleware/logger.js';

const router = express.Router();

router.use(logger);
// router.use(auth);

router.post('/add', addEntry);
router.get('/log', getHydrationLogs);

export default router;
