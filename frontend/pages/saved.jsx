import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/index.js';
import { userAPI, compareAPI } from '../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SavedPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('colleges');

  useEffect(() => {
    hydrate();
    if (isAuthenticated) {
      loadSavedItems();
    } else {
      router.push('/login');
    }
  }, [isAuthenticated]);

  const loadSavedItems = async () => {
    setIsLoading(true);
    try {
      const collegesResult = await userAPI.getSavedColleges();
      setSavedColleges(collegesResult.data.data || []);

      const comparisonsResult = await compareAPI.getSaved();
      setSavedComparisons(comparisonsResult.data || []);
    } catch (error) {
      console.error('Failed to load saved items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollege = async (collegeId) => {
    try {
      await userAPI.removeCollege(collegeId);
      setSavedColleges(savedColleges.filter((c) => c.id !== collegeId));
    } catch (error) {
      console.error('Failed to remove college:', error);
    }
  };

  const handleDeleteComparison = async (comparisonId) => {
    try {
      await compareAPI.delete(comparisonId);
      setSavedComparisons(savedComparisons.filter((c) => c.id !== comparisonId));
    } catch (error) {
      console.error('Failed to delete comparison:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('colleges')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'colleges'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600'
              }`}
            >
              Saved Colleges ({savedColleges.length})
            </button>
            <button
              onClick={() => setActiveTab('comparisons')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'comparisons'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600'
              }`}
            >
              Saved Comparisons ({savedComparisons.length})
            </button>
          </div>

          {/* Saved Colleges */}
          {activeTab === 'colleges' && (
            <div>
              {isLoading ? (
                <p>Loading...</p>
              ) : savedColleges.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No saved colleges yet</p>
                  <Link
                    href="/colleges"
                    className="text-primary hover:underline"
                  >
                    Explore colleges
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedColleges.map((college) => (
                    <div key={college.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                      <Link href={`/college/${college.id}`}>
                        <h3 className="text-lg font-bold text-primary mb-2 hover:underline">
                          {college.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">📍 {college.city}, {college.state}</p>
                      <p className="text-gray-600 mb-4">⭐ {college.rating} / 5</p>
                      <div className="flex gap-2">
                        <Link
                          href={`/college/${college.id}`}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded text-center hover:bg-secondary"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemoveCollege(college.id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Comparisons */}
          {activeTab === 'comparisons' && (
            <div>
              {isLoading ? (
                <p>Loading...</p>
              ) : savedComparisons.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No saved comparisons yet</p>
                  <Link
                    href="/compare"
                    className="text-primary hover:underline"
                  >
                    Create a comparison
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedComparisons.map((comparison) => (
                    <div key={comparison.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{comparison.name}</h3>
                          <p className="text-sm text-gray-600">
                            {comparison.college_ids?.length || 0} colleges • Created {new Date(comparison.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComparison(comparison.id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
