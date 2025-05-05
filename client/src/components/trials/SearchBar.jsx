import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, searchTrials, setShowFilters }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    searchTrials();
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search clinical trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search clinical trials"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button
          type="button"
          className="btn btn-filter"
          onClick={() => setShowFilters(true)}
          aria-label="Open filters"
        >
          <Filter size={20} />
          Filters
        </button>
      </form>

      <style jsx>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #1e293b;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .search-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          color: #1e293b;
          background: #ffffff;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: #64748b;
        }
        .btn {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary {
          background: linear-gradient(90deg, #f97316, #ea580c);
          color: #ffffff;
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(90deg, #fb923c, #f97316);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .btn-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
        }
        .btn-filter:hover {
          background: #f8fafc;
          border-color: #f97316;
        }
        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
            padding: 12px;
            gap: 12px;
          }
          .btn {
            width: 100%;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;