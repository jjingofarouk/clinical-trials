import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, searchTrials, setShowFilters }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    searchTrials();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="search-bar"
    >
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search clinical trials..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
        <button
          type="button"
          className="filter-button"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <Filter size={20} />
        </button>
      </form>
      <style jsx>{`
        .search-bar {
          padding: 20px;
          background: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
        }
        .search-form {
          display: flex;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          gap: 10px;
        }
        .search-input-container {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 10px;
          color: #6b7280;
        }
        .search-input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 16px;
        }
        .search-button {
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .search-button:hover {
          background-color: #2980b9;
        }
        .filter-button {
          padding: 10px;
          background-color: #6b7280;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .filter-button:hover {
          background-color: #4b5563;
        }
        @media (max-width: 640px) {
          .search-form {
            flex-direction: column;
          }
          .search-input-container {
            width: 100%;
          }
          .search-button,
          .filter-button {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SearchBar;