import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import CollegeCard from '../components/CollegeCard';
import { collegeAPI } from '../lib/api';

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadColleges();
  }, [currentPage]);

  const loadColleges = async () => {
    setIsLoading(true);
    try {
      const result = await collegeAPI.list(currentPage, 10);
      setColleges(result.data.data);
      setPagination(result.data.pagination);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (result) => {
    setColleges(result.data || []);
    setPagination(result.pagination);
    setCurrentPage(1);
  };

  return (
    <>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Search Colleges</h1>

          <SearchBar onSearch={handleSearch} />

          {isLoading ? (
            <div className="text-center py-12">Loading colleges...</div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-12">No colleges found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {pagination && (
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white border rounded">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(pagination.pages, currentPage + 1))
                    }
                    disabled={currentPage === pagination.pages}
                    className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
