import express from 'express';
import * as collegeController from '../controllers/collegeController.js';

const router = express.Router();

router.get('/', collegeController.list);
router.get('/search', collegeController.search);
router.get('/city/:city', collegeController.getByCity);
router.get('/:id', collegeController.getById);

export default router;
