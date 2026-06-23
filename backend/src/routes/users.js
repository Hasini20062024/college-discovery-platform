import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/saved-colleges', authMiddleware, userController.getSavedColleges);
router.post('/save-college', authMiddleware, userController.saveCollege);
router.delete('/save-college/:collegeId', authMiddleware, userController.removeCollege);
router.get('/check-saved/:collegeId', optionalAuth, userController.checkIfSaved);

export default router;
