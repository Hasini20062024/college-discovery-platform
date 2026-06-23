import * as UserSavedItems from '../models/UserSavedItems.js';
import * as College from '../models/College.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const compareColleges = asyncHandler(async (req, res) => {
  const { collegeIds } = req.body;

  if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 4) {
    return res.status(400).json({ error: 'Please provide 2-4 college IDs' });
  }

  const colleges = [];
  for (const id of collegeIds) {
    const college = await College.getCollegeById(id);
    colleges.push(college);
  }

  res.json({
    colleges,
    comparisonMetrics: extractComparisonMetrics(colleges),
  });
});

export const saveComparison = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { collegeIds, name } = req.body;

  if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
    return res.status(400).json({ error: 'At least 2 college IDs are required' });
  }

  const comparison = await UserSavedItems.saveComparison(req.user.userId, collegeIds, name || 'My Comparison');

  res.status(201).json(comparison);
});

export const getSavedComparisons = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const comparisons = await UserSavedItems.getSavedComparisons(req.user.userId);
  res.json(comparisons);
});

export const deleteComparison = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { id } = req.params;
  await UserSavedItems.deleteComparison(req.user.userId, id);

  res.json({ message: 'Comparison deleted' });
});

function extractComparisonMetrics(colleges) {
  return colleges.map((college) => ({
    id: college.id,
    name: college.name,
    rating: college.rating,
    city: college.city,
    fees: college.fees?.[0]?.annual_fee || 0,
    placements: {
      rate: college.placements?.[0]?.placement_rate || 0,
      avgSalary: college.placements?.[0]?.average_salary || 0,
      highestSalary: college.placements?.[0]?.highest_salary || 0,
    },
    coursesCount: college.courses?.length || 0,
    studentCount: college.details?.student_count || 0,
  }));
}
