import Header from '../components/Header';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useAuthStore } from '../store/index.js';
import { useEffect } from 'react';

export default function Home() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <>
      <Layout>
        <div className="container py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-10">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect College</h1>
            <p className="text-xl mb-8">
              Search, compare, and choose from 1000+ colleges across India
            </p>
            <div className="flex gap-4">
              <Link
                href="/colleges"
                className="px-6 py-3 bg-white text-primary font-bold rounded hover:bg-gray-100"
              >
                Explore Colleges
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-white text-primary font-bold rounded hover:bg-gray-100"
              >
                Compare Colleges
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">🔍 Search & Filter</h3>
              <p className="text-gray-600">
                Find colleges by location, fees, ratings, and more with advanced filters
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">📊 Compare</h3>
              <p className="text-gray-600">
                Side-by-side comparison of up to 4 colleges with all key metrics
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">💾 Save & Track</h3>
              <p className="text-gray-600">
                Save your favorite colleges and comparisons for later reference
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
