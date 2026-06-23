import Link from 'next/link';
import { useAuthStore } from '../store/index.js';
import { userAPI } from '../lib/api';
import { useState } from 'react';

export default function CollegeCard({ college }) {
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCollege = async () => {
    if (!isAuthenticated) {
      alert('Please login to save colleges');
      return;
    }

    setIsLoading(true);
    try {
      if (!isSaved) {
        await userAPI.saveCollege(college.id);
      } else {
        await userAPI.removeCollege(college.id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to save college:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <Link href={`/college/${college.id}`}>
        <h2 className="text-xl font-bold text-primary mb-2 hover:underline">{college.name}</h2>
      </Link>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>📍 {college.city}, {college.state}</p>
        <p>⭐ Rating: {college.rating} / 5</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/college/${college.id}`}
          className="flex-1 px-4 py-2 bg-primary text-white rounded text-center hover:bg-secondary"
        >
          View Details
        </Link>
        <button
          onClick={handleSaveCollege}
          disabled={isLoading}
          className={`px-4 py-2 rounded border ${
            isSaved
              ? 'bg-blue-100 border-primary text-primary'
              : 'border-gray-300 text-gray-700 hover:border-primary'
          }`}
        >
          {isLoading ? '...' : isSaved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
