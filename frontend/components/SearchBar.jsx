import { useState } from 'react';
import { collegeAPI } from '../lib/api';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await collegeAPI.search(query);
      onSearch(result.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityFilter = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    if (!selectedCity) return;

    setIsLoading(true);
    try {
      const result = await collegeAPI.getByCity(selectedCity);
      onSearch(result.data);
    } catch (error) {
      console.error('City filter failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search colleges..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-400"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by City</label>
          <select
            value={city}
            onChange={handleCityFilter}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Cities</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Sonipat">Sonipat</option>
            <option value="Pilani">Pilani</option>
          </select>
        </div>
      </form>
    </div>
  );
}
