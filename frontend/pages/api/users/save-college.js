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
      const { collegeId } = req.body;

      if (!collegeId) {
        return res.status(400).json({ error: 'College ID is required' });
      }

      await UserSavedItems.saveCollege(decoded.userId, collegeId);
      res.json({ message: 'College saved successfully' });
    } catch (error) {
      console.error('Save college error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { collegeId } = req.body;

      if (!collegeId) {
        return res.status(400).json({ error: 'College ID is required' });
      }

      await UserSavedItems.removeSavedCollege(decoded.userId, collegeId);
      res.json({ message: 'College removed successfully' });
    } catch (error) {
      console.error('Remove college error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
