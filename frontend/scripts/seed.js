import pool from '../lib/db/index.js';
import { v4 as uuidv4 } from 'uuid';

const COLLEGES_DATA = [
  {
    name: 'Indian Institute of Technology Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 4.8,
    type: 'Government',
    description: 'IIT Delhi is one of the premier engineering institutions in India.',
    founded_year: 1961,
    website: 'https://home.iitd.ac.in',
    student_count: 10000,
    faculty_count: 450,
    annual_fee: 200000,
    placement_rate: 98,
    average_salary: 1200000,
    highest_salary: 4500000,
  },
  {
    name: 'Delhi University',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 4.5,
    type: 'Government',
    description: 'Delhi University is one of the oldest universities in India.',
    founded_year: 1922,
    website: 'https://du.ac.in',
    student_count: 150000,
    faculty_count: 3000,
    annual_fee: 50000,
    placement_rate: 70,
    average_salary: 500000,
    highest_salary: 2000000,
  },
  {
    name: 'Ashoka University',
    city: 'Sonipat',
    state: 'Haryana',
    rating: 4.6,
    type: 'Private',
    description: 'Ashoka University is a leading private research university.',
    founded_year: 2014,
    website: 'https://www.ashoka.edu.in',
    student_count: 2500,
    faculty_count: 300,
    annual_fee: 1500000,
    placement_rate: 95,
    average_salary: 1000000,
    highest_salary: 3500000,
  },
  {
    name: 'Mumbai University',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.4,
    type: 'Government',
    description: 'One of the oldest universities in Asia.',
    founded_year: 1857,
    website: 'https://mu.ac.in',
    student_count: 200000,
    faculty_count: 3500,
    annual_fee: 60000,
    placement_rate: 65,
    average_salary: 450000,
    highest_salary: 1800000,
  },
  {
    name: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.9,
    type: 'Government',
    description: 'IIT Bombay is consistently ranked among the top engineering colleges.',
    founded_year: 1958,
    website: 'https://www.iitb.ac.in',
    student_count: 12000,
    faculty_count: 500,
    annual_fee: 200000,
    placement_rate: 99,
    average_salary: 1350000,
    highest_salary: 5000000,
  },
  {
    name: 'Symbiosis International University',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.3,
    type: 'Private',
    description: 'Symbiosis is a leading private university known for management and law.',
    founded_year: 1971,
    website: 'https://www.siu.edu.in',
    student_count: 25000,
    faculty_count: 1500,
    annual_fee: 800000,
    placement_rate: 85,
    average_salary: 750000,
    highest_salary: 2500000,
  },
  {
    name: 'Bangalore University',
    city: 'Bangalore',
    state: 'Karnataka',
    rating: 4.2,
    type: 'Government',
    description: 'Bangalore University is a leading university in South India.',
    founded_year: 1964,
    website: 'https://bangalore-university.ac.in',
    student_count: 180000,
    faculty_count: 2800,
    annual_fee: 55000,
    placement_rate: 60,
    average_salary: 400000,
    highest_salary: 1500000,
  },
  {
    name: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    rating: 4.7,
    type: 'Private',
    description: 'BITS Pilani is known for excellence in engineering and sciences.',
    founded_year: 1964,
    website: 'https://www.bits-pilani.ac.in',
    student_count: 8000,
    faculty_count: 400,
    annual_fee: 1200000,
    placement_rate: 97,
    average_salary: 1100000,
    highest_salary: 4000000,
  },
  {
    name: 'Chennai Mathematical Institute',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 4.5,
    type: 'Private',
    description: 'CMI is a leading institution for mathematics, physics and computer science.',
    founded_year: 1989,
    website: 'https://www.cmi.ac.in',
    student_count: 400,
    faculty_count: 50,
    annual_fee: 300000,
    placement_rate: 100,
    average_salary: 1400000,
    highest_salary: 3000000,
  },
  {
    name: 'Manipal Academy of Higher Education',
    city: 'Manipal',
    state: 'Karnataka',
    rating: 4.4,
    type: 'Private',
    description: 'MAHE is one of the oldest private institutions in India.',
    founded_year: 1953,
    website: 'https://www.manipal.edu',
    student_count: 35000,
    faculty_count: 2000,
    annual_fee: 600000,
    placement_rate: 80,
    average_salary: 650000,
    highest_salary: 2200000,
  },
];

export const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const collegeData of COLLEGES_DATA) {
      const collegeId = uuidv4();

      await client.query(
        `INSERT INTO colleges (id, name, city, state, rating, website, founded_year)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [collegeId, collegeData.name, collegeData.city, collegeData.state, collegeData.rating, collegeData.website, collegeData.founded_year]
      );

      await client.query(
        `INSERT INTO college_details (college_id, description, type, student_count, faculty_count)
         VALUES ($1, $2, $3, $4, $5)`,
        [collegeId, collegeData.description, collegeData.type, collegeData.student_count, collegeData.faculty_count]
      );

      await client.query(
        `INSERT INTO fees (college_id, program_name, course_type, annual_fee)
         VALUES ($1, $2, $3, $4)`,
        [collegeId, 'General', 'UG', collegeData.annual_fee]
      );

      await client.query(
        `INSERT INTO placements (college_id, year, average_salary, highest_salary, placement_rate, total_offers)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [collegeId, 2024, collegeData.average_salary, collegeData.highest_salary, collegeData.placement_rate, Math.floor(Math.random() * 200) + 100]
      );

      const courses = [
        { name: 'B.Tech Computer Science', duration: 4, degree_type: 'Bachelor', specialization: 'Computer Science' },
        { name: 'B.Tech Mechanical Engineering', duration: 4, degree_type: 'Bachelor', specialization: 'Mechanical Engineering' },
        { name: 'M.Tech Computer Science', duration: 2, degree_type: 'Master', specialization: 'Computer Science' },
      ];

      for (const course of courses) {
        await client.query(
          `INSERT INTO courses (college_id, name, duration, degree_type, specialization, seats)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [collegeId, course.name, course.duration, course.degree_type, course.specialization, Math.floor(Math.random() * 100) + 50]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Database seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  seedDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
