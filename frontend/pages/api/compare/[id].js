import * as UserSavedItems from '../../../lib/models/UserSavedItems';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const decoded = requireAuth(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Comparison ID is required' });
      }

      await UserSavedItems.deleteComparison(decoded.userId, id);
      res.json({ message: 'Comparison deleted successfully' });
    } catch (error) {
      console.error('Delete comparison error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
