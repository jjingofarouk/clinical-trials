import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, setShowFilters, searchTrials }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    searchTrials();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      phase: '',
      studyType: '',
      condition: '',
      location: '',
      sponsor: '',
    });
    setShowFilters(false);
    searchTrials();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="filter-sidebar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="filter-modal">
          <div className="sidebar-header">
            <h2>Filter Trials</h2>
            <button
              className="close-btn"
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
            >
              <X size={24} />
            </button>
          </div>
          <div className="filter-grid">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">All</option>
                <option value="Recruiting">Recruiting</option>
                <option value="Active, Not Recruiting">Active, Not Recruiting</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Phase</label>
              <select
                name="phase"
                value={filters.phase}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">All</option>
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
                <option value="Phase 4">Phase 4</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Study Type</label>
              <select
                name="studyType"
                value={filters.studyType}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">All</option>
                <option value="Interventional">Interventional</option>
                <option value="Observational">Observational</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Condition</label>
              <input
                type="text"
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="e.g., Cancer, Diabetes"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="e.g., New York, CA"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Sponsor</label>
              <input
                type="text"
                name="sponsor"
                value={filters.sponsor}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="e.g., Pfizer, NIH"
              />
            </div>
          </div>
          <div className="sidebar-footer">
            <button className="btn btn-secondary" onClick={resetFilters}>
              Reset
            </button>
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>

        <style jsx>{`
          .filter-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .filter-modal {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            position: relative;
          }
          .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .sidebar-header h2 {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
          }
          .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #64748b;
            position: absolute;
            top: 16px;
            right: 16px;
          }
          .close-btn:hover {
            color: #1e293b;
          }
          .filter-grid {
            display: grid;
            gap: 16px;
            margin: 16px 0;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .filter-label {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
          }
          .filter-input {
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            color: #1e293b;
            background: #f8fafc;
            transition: border-color 0.3s ease;
          }
          .filter-input:focus {
            outline: none;
            border-color: #f97316;
          }
          .sidebar-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .btn {
            padding: 10px 20px;
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
          .btn-secondary {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #1e293b;
          }
          .btn-secondary:hover {
            background: #f8fafc;
            border-color: #f97316;
          }
          @media (max-width: 768px) {
            .filter-modal {
              margin: 12px;
              padding: 16px;
            }
            .btn {
              padding: 8px 12px;
              font-size: 12px;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterSidebar;