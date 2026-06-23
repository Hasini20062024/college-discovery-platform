import * as College from '../../../lib/models/College';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'College ID is required' });
      }

      const college = await College.getCollegeById(id);
      res.json(college);
    } catch (error) {
      if (error.message === 'College not found') {
        return res.status(404).json({ error: 'College not found' });
      }
      console.error('College detail error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
