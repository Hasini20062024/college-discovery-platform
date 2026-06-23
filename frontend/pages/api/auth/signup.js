import * as User from '../../../lib/models/User';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const user = await User.createUser(email, password, firstName || '', lastName || '');
      const token = User.generateToken(user.id, user.email);

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
