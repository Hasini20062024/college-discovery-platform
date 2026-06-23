import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import { collegeAPI, userAPI } from '../../lib/api';
import { useAuthStore } from '../../store/index.js';

export default function CollegeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    loadCollege();
    checkIfSaved();
  }, [id]);

  const loadCollege = async () => {
    try {
      const result = await collegeAPI.getById(id);
      setCollege(result.data);
    } catch (error) {
      console.error('Failed to load college:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await userAPI.checkIfSaved(id);
      setIsSaved(result.data.saved);
    } catch (error) {
      console.error('Failed to check saved status:', error);
    }
  };

  const handleSaveCollege = async () => {
    if (!isAuthenticated) {
      alert('Please login to save colleges');
      return;
    }

    try {
      if (!isSaved) {
        await userAPI.saveCollege(id);
      } else {
        await userAPI.removeCollege(id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to save college:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Layout>
          <div className="container py-12">Loading...</div>
        </Layout>
      </>
    );
  }

  if (!college) {
    return (
      <>
        <Layout>
          <div className="container py-12">College not found</div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <div className="container py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
                <p className="text-gray-600">
                  📍 {college.city}, {college.state}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{college.rating}</div>
                <p className="text-gray-600">/ 5.0 Rating</p>
              </div>
            </div>
            <button
              onClick={handleSaveCollege}
              className={`px-6 py-2 rounded ${
                isSaved
                  ? 'bg-blue-100 text-primary'
                  : 'bg-primary text-white'
              }`}
            >
              {isSaved ? '✓ Saved' : '+ Save'}
            </button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">Founded</h3>
              <p className="text-gray-600">{college.founded_year}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">Students</h3>
              <p className="text-gray-600">
                {college.details?.student_count?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">Faculty</h3>
              <p className="text-gray-600">
                {college.details?.faculty_count?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

          {/* Details */}
          {college.details?.description && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700">{college.details.description}</p>
            </div>
          )}

          {/* Fees */}
          {college.fees && college.fees.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Fees</h2>
              <div className="space-y-3">
                {college.fees.map((fee, idx) => (
                  <div key={idx} className="border-b pb-3 last:border-b-0">
                    <p className="font-semibold">{fee.program_name} ({fee.course_type})</p>
                    <p className="text-gray-600">
                      Annual: ₹{fee.annual_fee?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placements */}
          {college.placements && college.placements.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Placements (2024)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Placement Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {college.placements[0]?.placement_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Avg Salary</p>
                  <p className="text-lg font-bold">
                    ₹{(college.placements[0]?.average_salary / 100000).toFixed(1)}L
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Highest Salary</p>
                  <p className="text-lg font-bold">
                    ₹{(college.placements[0]?.highest_salary / 100000).toFixed(1)}L
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Offers</p>
                  <p className="text-2xl font-bold">
                    {college.placements[0]?.total_offers}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Courses */}
          {college.courses && college.courses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Courses Offered</h2>
              <div className="space-y-3">
                {college.courses.map((course, idx) => (
                  <div key={idx} className="border-b pb-3 last:border-b-0">
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-sm text-gray-600">
                      {course.degree_type} • {course.duration} years • {course.seats} seats
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
