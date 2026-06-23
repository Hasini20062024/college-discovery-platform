import * as UserSavedItems from '../models/UserSavedItems.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getSavedColleges = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { page = 1, limit = 10 } = req.query;

  const result = await UserSavedItems.getSavedColleges(req.user.userId, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json(result);
});

export const saveCollege = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { collegeId } = req.body;

  if (!collegeId) {
    return res.status(400).json({ error: 'College ID is required' });
  }

  const saved = await UserSavedItems.saveCollege(req.user.userId, collegeId);

  res.status(201).json(saved);
});

export const removeCollege = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { collegeId } = req.params;

  await UserSavedItems.removeSavedCollege(req.user.userId, collegeId);

  res.json({ message: 'College removed from saved list' });
});

export const checkIfSaved = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({ saved: false });
  }

  const { collegeId } = req.params;

  const saved = await UserSavedItems.isSavedCollege(req.user.userId, collegeId);

  res.json({ saved });
});
