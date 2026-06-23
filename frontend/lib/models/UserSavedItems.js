import pool from '../db/index.js';

export const getSavedColleges = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT c.* FROM colleges c
     INNER JOIN saved_colleges sc ON c.id = sc.college_id
     WHERE sc.user_id = $1
     ORDER BY sc.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const countResult = await pool.query(
    'SELECT COUNT(*) as total FROM saved_colleges WHERE user_id = $1',
    [userId]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].total),
    },
  };
};

export const saveCollege = async (userId, collegeId) => {
  const result = await pool.query(
    `INSERT INTO saved_colleges (user_id, college_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, college_id) DO NOTHING
     RETURNING *`,
    [userId, collegeId]
  );

  return result.rows[0];
};

export const removeSavedCollege = async (userId, collegeId) => {
  await pool.query(
    'DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2',
    [userId, collegeId]
  );
};

export const isSavedCollege = async (userId, collegeId) => {
  const result = await pool.query(
    'SELECT 1 FROM saved_colleges WHERE user_id = $1 AND college_id = $2',
    [userId, collegeId]
  );

  return result.rows.length > 0;
};

export const getSavedComparisons = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM saved_comparisons WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const saveComparison = async (userId, collegeIds, name) => {
  const result = await pool.query(
    `INSERT INTO saved_comparisons (user_id, college_ids, name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, collegeIds, name]
  );

  return result.rows[0];
};

export const deleteComparison = async (userId, comparisonId) => {
  await pool.query(
    'DELETE FROM saved_comparisons WHERE id = $1 AND user_id = $2',
    [comparisonId, userId]
  );
};
