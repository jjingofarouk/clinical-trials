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
    setFilters({ status: '', phase: '', studyType: '' });
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
              </