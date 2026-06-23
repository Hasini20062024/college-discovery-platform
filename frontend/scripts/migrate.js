import pool from '../lib/db/index.js';

export const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL DEFAULT 'India',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        rating DECIMAL(3, 1) DEFAULT 0,
        total_reviews INT DEFAULT 0,
        founded_year INT,
        website VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
      CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
      CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS college_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        description TEXT,
        type VARCHAR(50),
        accreditation VARCHAR(100),
        student_count INT,
        faculty_count INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_college_details_college_id ON college_details(college_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        program_name VARCHAR(255) NOT NULL,
        course_type VARCHAR(50),
        annual_fee DECIMAL(12, 2),
        total_fee DECIMAL(12, 2),
        currency VARCHAR(3) DEFAULT 'INR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_fees_college_id ON fees(college_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        duration INT,
        degree_type VARCHAR(50),
        specialization VARCHAR(255),
        seats INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS placements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        year INT,
        average_salary DECIMAL(12, 2),
        highest_salary DECIMAL(12, 2),
        placement_rate DECIMAL(5, 2),
        total_offers INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_placements_college_id ON placements(college_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_college_id ON reviews(college_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_colleges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, college_id)
      );
      CREATE INDEX IF NOT EXISTS idx_saved_colleges_user_id ON saved_colleges(user_id);
      CREATE INDEX IF NOT EXISTS idx_saved_colleges_college_id ON saved_colleges(college_id);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_comparisons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        college_ids UUID[] NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_saved_comparisons_user_id ON saved_comparisons(user_id);
    `);

    await client.query('COMMIT');
    console.log('✓ Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  initializeDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
