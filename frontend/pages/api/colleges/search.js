import * as College from '../../../lib/models/College';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { q = '', page = 1, limit = 10 } = req.query;

      const result = await College.searchColleges(q, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
