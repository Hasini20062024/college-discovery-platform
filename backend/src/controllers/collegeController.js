import * as College from '../models/College.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', city = '', sortBy = 'rating', order = 'DESC', minRating = 0 } = req.query;

  const result = await College.getAllColleges({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    city,
    sortBy,
    order,
    minRating: parseFloat(minRating),
  });

  res.json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const college = await College.getCollegeById(id);
  res.json(college);
});

export const search = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const result = await College.searchColleges(q, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json(result);
});

export const getByCity = asyncHandler(async (req, res) => {
  const { city } = req.params;
  const { page = 1, limit = 10, sortBy = 'rating' } = req.query;

  const result = await College.getCollegesByCity(city, {
    page: parseInt(page),
    limit: parseInt(limit),
    sortBy,
  });

  res.json(result);
});
