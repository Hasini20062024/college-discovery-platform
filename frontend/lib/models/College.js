import pool from '../db/index.js';

export const getAllColleges = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    city = '',
    sortBy = 'rating',
    order = 'DESC',
    minRating = 0,
  } = options;

  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM colleges WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND name ILIKE $' + (params.length + 1);
    params.push(`%${search}%`);
  }

  if (city) {
    query += ' AND city ILIKE $' + (params.length + 1);
    params.push(`%${city}%`);
  }

  if (minRating) {
    query += ' AND rating >= $' + (params.length + 1);
    params.push(minRating);
  }

  const validSortColumns = ['rating', 'name', 'created_at'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'rating';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  let countQuery = 'SELECT COUNT(*) as total FROM colleges WHERE 1=1';
  const countParams = [];

  if (search) {
    countQuery += ' AND name ILIKE $' + (countParams.length + 1);
    countParams.push(`%${search}%`);
  }

  if (city) {
    countQuery += ' AND city ILIKE $' + (countParams.length + 1);
    countParams.push(`%${city}%`);
  }

  if (minRating) {
    countQuery += ' AND rating >= $' + (countParams.length + 1);
    countParams.push(minRating);
  }

  const countResult = await pool.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].total);

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getCollegeById = async (id) => {
  const collegeResult = await pool.query('SELECT * FROM colleges WHERE id = $1', [id]);

  if (collegeResult.rows.length === 0) {
    throw new Error('College not found');
  }

  const college = collegeResult.rows[0];

  const detailsResult = await pool.query('SELECT * FROM college_details WHERE college_id = $1', [id]);
  college.details = detailsResult.rows[0] || {};

  const feesResult = await pool.query('SELECT * FROM fees WHERE college_id = $1', [id]);
  college.fees = feesResult.rows;

  const coursesResult = await pool.query('SELECT * FROM courses WHERE college_id = $1', [id]);
  college.courses = coursesResult.rows;

  const placementsResult = await pool.query('SELECT * FROM placements WHERE college_id = $1 ORDER BY year DESC', [id]);
  college.placements = placementsResult.rows;

  const reviewsResult = await pool.query(
    `SELECT r.*, u.first_name, u.last_name FROM reviews r
     LEFT JOIN users u ON r.user_id = u.id
     WHERE r.college_id = $1 ORDER BY r.created_at DESC LIMIT 50`,
    [id]
  );
  college.reviews = reviewsResult.rows;

  return college;
};

export const searchColleges = async (query, options = {}) => {
  return getAllColleges({
    search: query,
    ...options,
  });
};

export const getCollegesByCity = async (city, options = {}) => {
  return getAllColleges({
    city,
    ...options,
  });
};
