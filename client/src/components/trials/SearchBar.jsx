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
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search clinical trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search clinical trials"
          />
          <button
            type="button"
            className="btn btn-filter"
            onClick={() => setShowFilters(true)}
            aria-label="Open filters"
          >
            <Filter size={18} />
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <style jsx>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1e293b;
          padding: 8px 16px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        .search-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
        }
        .search-input {
          flex: 1;
          padding: 10px 12px 10px 36px;
          border: none;
          font-size: 14px;
          color: #1e293b;
          background: transparent;
        }
        .search-input:focus {
          outline: none;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
        }
        .btn {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
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
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
        }
        .btn-filter {
          background: transparent;
          border: none;
          color: #64748b;
          padding: 10px;
          display: flex;
          align-items: center;
        }
        .btn-filter:hover {
          color: #f97316;
        }
        @media (max-width: 768px) {
          .search-bar {
            padding: 6px 12px;
            gap: 8px;
          }
          .btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;