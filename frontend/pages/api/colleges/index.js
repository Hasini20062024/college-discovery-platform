import * as College from '../../../lib/models/College';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search = '', city = '', sortBy = 'rating', order = 'DESC' } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        city,
        sortBy,
        order,
      };

      const result = await College.getAllColleges(options);
      res.json(result);
    } catch (error) {
      console.error('College listing error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
