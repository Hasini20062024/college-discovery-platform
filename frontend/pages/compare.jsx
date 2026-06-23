import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import { useCompareStore } from '../store/index.js';
import { useAuthStore } from '../store/index.js';
import { collegeAPI, compareAPI } from '../lib/api';
import { useRouter } from 'next/router';

export default function ComparePage() {
  const router = useRouter();
  const { selectedColleges, addCollege, removeCollege, clearSelection, setComparisonResult } =
    useCompareStore();
  const { isAuthenticated } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparisonName, setComparisonName] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      const result = await collegeAPI.search(searchInput);
      setSearchResults(result.data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddCollege = (college) => {
    if (selectedColleges.find((c) => c.id === college.id)) return;
    addCollege(college);
    setSearchInput('');
    setSearchResults([]);
  };

  const handleCompare = async () => {
    if (selectedColleges.length < 2) {
      alert('Select at least 2 colleges to compare');
      return;
    }

    try {
      const result = await compareAPI.compare(selectedColleges.map((c) => c.id));
      setComparison(result.data);
      setComparisonResult(result.data);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  };

  const handleSaveComparison = async () => {
    if (!isAuthenticated) {
      alert('Please login to save comparisons');
      return;
    }

    try {
      await compareAPI.save(
        selectedColleges.map((c) => c.id),
        comparisonName || 'My Comparison'
      );
      alert('Comparison saved successfully!');
      setComparisonName('');
    } catch (error) {
      console.error('Failed to save comparison:', error);
    }
  };

  return (
    <>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Compare Colleges</h1>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search colleges to add to comparison..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
              >
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((college) => (
                  <div
                    key={college.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">{college.name}</p>
                      <p className="text-sm text-gray-600">{college.city}</p>
                    </div>
                    <button
                      onClick={() => handleAddCollege(college)}
                      disabled={selectedColleges.find((c) => c.id === college.id)}
                      className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Colleges */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              Selected Colleges ({selectedColleges.length}/4)
            </h2>
            {selectedColleges.length === 0 ? (
              <p className="text-gray-600">No colleges selected yet</p>
            ) : (
              <div className="space-y-2">
                {selectedColleges.map((college) => (
                  <div
                    key={college.id}
                    className="flex justify-between items-center p-3 border rounded-lg bg-blue-50"
                  >
                    <p className="font-semibold">{college.name}</p>
                    <button
                      onClick={() => removeCollege(college.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedColleges.length > 1 && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleCompare}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  Compare
                </button>
                <button
                  onClick={clearSelection}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Comparison Results</h2>

                {/* Save Comparison */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Give this comparison a name..."
                      value={comparisonName}
                      onChange={(e) => setComparisonName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg mb-3"
                    />
                    <button
                      onClick={handleSaveComparison}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                    >
                      Save This Comparison
                    </button>
                  </div>
                )}

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-4 px-4 font-bold">College</th>
                        <th className="text-center py-4 px-4 font-bold">Rating</th>
                        <th className="text-center py-4 px-4 font-bold">Annual Fees</th>
                        <th className="text-center py-4 px-4 font-bold">Placement %</th>
                        <th className="text-center py-4 px-4 font-bold">Avg Salary</th>
                        <th className="text-center py-4 px-4 font-bold">Highest Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.comparisonMetrics.map((metric) => (
                        <tr key={metric.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{metric.name}</td>
                          <td className="text-center py-4 px-4">
                            <span className="text-lg font-bold text-primary">{metric.rating}</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            ₹{(metric.fees / 100000).toFixed(1)}L
                          </td>
                          <td className="text-center py-4 px-4">{metric.placements.rate}%</td>
                          <td className="text-center py-4 px-4">
                            ₹{(metric.placements.avgSalary / 100000).toFixed(1)}L
                          </td>
                          <td className="text-center py-4 px-4">
                            ₹{(metric.placements.highestSalary / 100000).toFixed(1)}L
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
