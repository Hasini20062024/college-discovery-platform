import * as User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const signup = asyncHandler(async (req, res) => {
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
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.getUserByEmail(email);
  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValidPassword = await User.verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = User.generateToken(user.id, user.email);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    token,
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { googleId, email, firstName, lastName } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ error: 'Google ID and email are required' });
  }

  const user = await User.createOrUpdateGoogleUser(googleId, email, firstName || '', lastName || '');
  const token = User.generateToken(user.id, user.email);

  res.json({
    user,
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.getUserById(req.user.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});
