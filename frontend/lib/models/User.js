import pool from '../db/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (email, password, firstName, lastName) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const id = uuidv4();

  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, created_at`,
    [id, email, hashedPassword, firstName, lastName]
  );

  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const verifyPassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const createOrUpdateGoogleUser = async (googleId, email, firstName, lastName) => {
  let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

  if (result.rows.length > 0) {
    const userId = result.rows[0].id;
    const updateResult = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING id, email, first_name, last_name, created_at`,
      [firstName, lastName, userId]
    );
    return updateResult.rows[0];
  }

  const id = uuidv4();
  const createResult = await pool.query(
    `INSERT INTO users (id, email, google_id, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, created_at`,
    [id, email, googleId, firstName, lastName]
  );

  return createResult.rows[0];
};
