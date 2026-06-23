import * as UserSavedItems from '../../../lib/models/UserSavedItems';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const decoded = requireAuth(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { collegeIds, name } = req.body;

      if (!collegeIds || !Array.isArray(collegeIds)) {
        return res.status(400).json({ error: 'College IDs are required' });
      }

      const comparison = await UserSavedItems.saveComparison(decoded.userId, collegeIds, name);
      res.status(201).json(comparison);
    } catch (error) {
      console.error('Save comparison error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const comparisons = await UserSavedItems.getSavedComparisons(decoded.userId);
      res.json(comparisons);
    } catch (error) {
      console.error('Get comparisons error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
