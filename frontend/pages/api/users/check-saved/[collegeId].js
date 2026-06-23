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
      const { collegeId } = req.query;

      if (!collegeId) {
        return res.status(400).json({ error: 'College ID is required' });
      }

      const isSaved = await UserSavedItems.isSavedCollege(decoded.userId, collegeId);
      res.json({ isSaved });
    } catch (error) {
      console.error('Check saved error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
