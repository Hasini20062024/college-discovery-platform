import express from 'express';
import * as compareController from '../controllers/compareController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, compareController.compareColleges);
router.post('/save', authMiddleware, compareController.saveComparison);
router.get('/saved', authMiddleware, compareController.getSavedComparisons);
router.delete('/:id', authMiddleware, compareController.deleteComparison);

export default router;
