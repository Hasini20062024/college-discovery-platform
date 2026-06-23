import * as UserSavedItems from '../../../lib/models/UserSavedItems';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const decoded = requireAuth(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await UserSavedItems.getSavedColleges(decoded.userId, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json(result);
    } catch (error) {
      console.error('Get saved colleges error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
