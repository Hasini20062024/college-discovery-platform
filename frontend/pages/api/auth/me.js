import * as User from '../../../lib/models/User';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const decoded = requireAuth(req);

      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await User.getUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Auth error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
