import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

const ClinicalTrials = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: 'RECRUITING',
    phase: '',
    ageGroup: '',
    gender: '',
    healthyVolunteers: false,
    studyType: '',
    fundingType: '',
    interventionType: '',
    conditions: [],
    locations: [],
    startDate: '',
    completionDate: '',
    hasResults: false,
    participantAge: { min: '', max: '' },
    enrollmentCount: { min: '', max: '' },
  });

  const filterOptions = {
    status: [
      { label: 'Recruiting', value: 'RECRUITING' },
      { label: 'Not Yet Recruiting', value: 'NOT_YET_RECRUITING' },
      { label: 'Active, not recruiting', value: 'ACTIVE_NOT_RECRUITING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Enrolling by invitation', value: 'ENROLLING_BY_INVITATION' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Terminated', value: 'TERMINATED' },
      { label: 'Withdrawn', value: 'WITHDRAWN' },
    ],
    phase: [
      { label: 'All Phases', value: '' },
      { label: 'Early Phase 1', value: 'EARLY_PHASE1' },
      { label: 'Phase 1', value: 'PHASE1' },
      { label: 'Phase 1/Phase 2', value: 'PHASE1_PHASE2' },
      { label: 'Phase 2', value: 'PHASE2' },
      { label: 'Phase 2/Phase 3', value: 'PHASE2_PHASE3' },
      { label: 'Phase 3', value: 'PHASE3' },
      { label: 'Phase 4', value: 'PHASE4' },
    ],
    studyType: [
      { label: 'All Types', value: '' },
      { label: 'Interventional', value: 'INTERVENTIONAL' },
      { label: 'Observational', value: 'OBSERVATIONAL' },
      { label: 'Patient Registry', value: 'PATIENT_REGISTRY' },
      { label: 'Expanded Access', value: 'EXPANDED_ACCESS' },
    ],
    ageGroup: [
      { label: 'All Ages', value: '' },
      { label: 'Child (0-17)', value: 'CHILD' },
      { label: 'Adult (18-64)', value: 'ADULT' },
      { label: 'Older Adult (65+)', value: 'OLDER_ADULT' },
    ],
    gender: [
      { label: 'All', value: '' },
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
      { label: 'All Genders', value: 'ALL' },
    ],
    fundingType: [
      { label: 'All', value: '' },
      { label: 'NIH', value: 'NIH' },
      { label: 'Industry', value: 'INDUSTRY' },
      { label: 'Other U.S. Federal Agency', value: 'OTHER_US_FED' },
      { label: 'Academic/University', value: 'ACADEMIC' },
    ],
    interventionType: [
      { label: 'All', value: '' },
      { label: 'Drug', value: 'DRUG' },
      { label: 'Device', value: 'DEVICE' },
      { label: 'Biological', value: 'BIOLOGICAL' },
      { label: 'Procedure', value: 'PROCEDURE' },
      { label: 'Behavioral', value: 'BEHAVIORAL' },
      { label: 'Dietary Supplement', value: 'DIETARY_SUPPLEMENT' },
    ],
  };

  const searchTrials = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        'query.term': searchQuery,
        'filter.overallStatus': filters.status,
        'pageSize': '50',
      });

      if (filters.phase) queryParams.append('filter.phase', filters.phase);
      if (filters.studyType) queryParams.append('filter.studyType', filters.studyType);
      if (filters.gender) queryParams.append('filter.sex', filters.gender);
      if (filters.ageGroup) queryParams.append('filter.ageGroup', filters.ageGroup);
      if (filters.healthyVolunteers) queryParams.append('filter.healthyVolunteers', 'true');
      if (filters.hasResults) queryParams.append('filter.hasResults', 'true');
      if (filters.fundingType) queryParams.append('filter.fundingType', filters.fundingType);
      if (filters.interventionType)
        queryParams.append('filter.interventionType', filters.interventionType);
      if (filters.startDate) queryParams.append('filter.startDate', filters.startDate);
      if (filters.completionDate)
        queryParams.append('filter.completionDate', filters.completionDate);
      if (filters.conditions.length)
        queryParams.append('filter.conditions', filters.conditions.join(','));
      if (filters.locations.length)
        queryParams.append('filter.locations', filters.locations.join(','));
      if (filters.participantAge.min)
        queryParams.append('filter.minimumAge', filters.participantAge.min);
      if (filters.participantAge.max)
        queryParams.append('filter.maximumAge', filters.participantAge.max);
      if (filters.enrollmentCount.min)
        queryParams.append('filter.enrollment.min', filters.enrollmentCount.min);
      if (filters.enrollmentCount.max)
        queryParams.append('filter.enrollment.max', filters.enrollmentCount.max);

      const response = await fetch(
        `https://clinicaltrials.gov/api/v2/studies?${queryParams.toString()}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTrials(data.studies || []);
    } catch (error) {
      console.error('Error fetching trials:', error);
      setTrials([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  const resetFilters = () => {
    setFilters({
      status: 'RECRUITING',
      phase: '',
      ageGroup: '',
      gender: '',
      healthyVolunteers: false,
      studyType: '',
      fundingType: '',
      interventionType: '',
      conditions: [],
      locations: [],
      startDate: '',
      completionDate: '',
      hasResults: false,
      participantAge: { min: '', max: '' },
      enrollmentCount: { min: '', max: '' },
    });
  };

  const TrialListItem = ({ trial }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId;
    const title = protocolSection?.identificationModule?.briefTitle || 'No Title';
    const status = protocolSection?.statusModule?.overallStatus || 'Unknown';
    const phase = protocolSection?.designModule?.phases?.join(', ') || 'N/A';

    return (
      <motion.div
        whileHover={{ backgroundColor: '#f7f7f7' }}
        className="trial-list-item"
        onClick={() => navigate(`/trials/${nctId}`)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate(`/trials/${nctId}`)}
        aria-label={`View trial ${title}`}
      >
        <div className="trial-list-content">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
          <p className="text-xs text-gray-600">NCT ID: {nctId}</p>
          <p className="text-xs text-gray-600">Status: {status}</p>
          <p className="text-xs text-gray-600">Phase: {phase}</p>
        </div>
      </motion.div>
    );
  };

  const FilterSidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: showFilters ? 0 : -300 }}
      transition={{ duration: 0.3 }}
      className={`filter-sidebar ${showFilters ? 'active' : ''}`}
      aria-hidden={!showFilters}
    >
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button
          className="close-btn"
          onClick={() => setShowFilters(false)}
          aria-label="Close filters"
        >
          <X size={16} />
        </button>
      </div>
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="status-filter" className="text-xs">Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-input"
          >
            {filterOptions.status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="phase-filter" className="text-xs">Phase</label>
          <select
            id="phase-filter"
            value={filters.phase}
            onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
            className="filter-input"
          >
            {filterOptions.phase.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="study-type-filter" className="text-xs">Study Type</label>
          <select
            id="study-type-filter"
            value={filters.studyType}
            onChange={(e) => setFilters({ ...filters, studyType: e.target.value })}
            className="filter-input"
          >
            {filterOptions.studyType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="age-group-filter" className="text-xs">Age Group</label>
          <select
            id="age-group-filter"
            value={filters.ageGroup}
            onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
            className="filter-input"
          >
            {filterOptions.ageGroup.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="gender-filter" className="text-xs">Gender</label>
          <select
            id="gender-filter"
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="filter-input"
          >
            {filterOptions.gender.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="funding-type-filter" className="text-xs">Funding Type</label>
          <select
            id="funding-type-filter"
            value={filters.fundingType}
            onChange={(e) => setFilters({ ...filters, fundingType: e.target.value })}
            className="filter-input"
          >
            {filterOptions.fundingType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="intervention-type-filter" className="text-xs">Intervention Type</label>
          <select
            id="intervention-type-filter"
            value={filters.interventionType}
            onChange={(e) => setFilters({ ...filters, interventionType: e.target.value })}
            className="filter-input"
          >
            {filterOptions.interventionType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="healthy-volunteers-filter" className="text-xs flex items-center gap-2">
            Healthy Volunteers
            <input
              id="healthy-volunteers-filter"
              type="checkbox"
              checked={filters.healthyVolunteers}
              onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
            />
          </label>
        </div>
        <div className="filter-group">
          <label htmlFor="has-results-filter" className="text-xs flex items-center gap-2">
            Has Results
            <input
              id="has-results-filter"
              type="checkbox"
              checked={filters.hasResults}
              onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
            />
          </label>
        </div>
        <div className="filter-group">
          <label htmlFor="start-date-filter" className="text-xs">Start Date</label>
          <input
            id="start-date-filter"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="completion-date-filter" className="text-xs">Completion Date</label>
          <input
            id="completion-date-filter"
            type="date"
            value={filters.completionDate}
            onChange={(e) => setFilters({ ...filters, completionDate: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="conditions-filter" className="text-xs">Conditions (comma-separated)</label>
          <input
            id="conditions-filter"
            type="text"
            value={filters.conditions.join(',')}
            onChange={(e) =>
              setFilters({ ...filters, conditions: e.target.value.split(',').map((c) => c.trim()) })
            }
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="locations-filter" className="text-xs">Locations (comma-separated)</label>
          <input
            id="locations-filter"
            type="text"
            value={filters.locations.join(',')}
            onChange={(e) =>
              setFilters({ ...filters, locations: e.target.value.split(',').map((l) => l.trim()) })
            }
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label className="text-xs">Participant Age Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.participantAge.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  participantAge: { ...filters.participantAge, min: e.target.value },
                })
              }
              className="filter-input"
              aria-label="Minimum age"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.participantAge.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  participantAge: { ...filters.participantAge, max: e.target.value },
                })
              }
              className="filter-input"
              aria-label="Maximum age"
            />
          </div>
        </div>
        <div className="filter-group">
          <label className="text-xs">Enrollment Count Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.enrollmentCount.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  enrollmentCount: { ...filters.enrollmentCount, min: e.target.value },
                })
              }
              className="filter-input"
              aria-label="Minimum enrollment"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.enrollmentCount.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  enrollmentCount: { ...filters.enrollmentCount, max: e.target.value },
                })
              }
              className="filter-input"
              aria-label="Maximum enrollment"
            />
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <button
          className="btn btn-secondary"
          onClick={resetFilters}
          aria-label="Reset filters"
        >
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            searchTrials();
            setShowFilters(false);
          }}
          aria-label="Apply filters"
        >
          Apply
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="clinical-trials-container">
      <header className="search-header">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search clinical trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTrials()}
              aria-label="Search clinical trials"
              className="search-input"
            />
          </div>
          <button
            className="btn btn-filter"
            onClick={() => setShowFilters(true)}
            aria-label="Toggle filters"
          >
            <Filter size={16} className="mr-1" /> Filters
          </button>
          <button
            className="btn btn-primary"
            onClick={searchTrials}
            aria-label="Search trials"
          >
            Search
          </button>
        </div>
      </header>
      <div className="main-content">
        <FilterSidebar />
        <main className="trials-content">
          {loading ? (
            <div className="loading-spinner" aria-live="polite">
              <div className="spinner" />
              Loading trials...
            </div>
          ) : trials.length > 0 ? (
            <div className="trials-list">
              {trials.map((trial) => (
                <TrialListItem
                  key={trial.protocolSection?.identificationModule?.nctId}
                  trial={trial}
                />
              ))}
            </div>
          ) : (
            <div className="no-results" aria-live="polite">
              No trials found. Try adjusting your search criteria.
            </div>
          )}
        </main>
      </div>
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .clinical-trials-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 16px;
        }

        .search-header {
          padding: 16px 0;
          background: #fff;
          border-bottom: 1px solid #e5e5e5;
        }

        .search-bar {
          display: flex;
          gap: 8px;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
        }

        .search-input:focus {
          outline: none;
          border-color: #000;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-filter {
          background: #f3f4f6;
          color: #111827;
          border: 1px solid #e5e5e5;
        }

        .btn-filter:hover {
          background: #e5e7eb;
        }

        .btn-primary {
          background: #000;
          color: #fff;
          border: none;
        }

        .btn-primary:hover {
          background: #333;
        }

        .main-content {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .filter-sidebar {
          width: 280px;
          background: #fff;
          border-right: 1px solid #e5e5e5;
          padding: 16px;
          height: calc(100vh - 120px);
          overflow-y: auto;
          position: fixed;
          left: 0;
          top: 120px;
          z-index: 10;
          transform: translateX(-100%);
        }

        .filter-sidebar.active {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .sidebar-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-input {
          padding: 8px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 12px;
          color: #111827;
        }

        .filter-input:focus {
          outline: none;
          border-color: #000;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .range-inputs {
          display: flex;
          gap: 8px;
        }

        .range-inputs input {
          flex: 1;
        }

        .sidebar-footer {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #111827;
          border: 1px solid #e5e5e5;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .trials-content {
          flex: 1;
          padding: 16px;
        }

        .trials-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trial-list-item {
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .trial-list-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e5e5;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .no-results {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          padding: 32px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .clinical-trials-container {
            padding: 12px;
          }

          .search-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            font-size: 12px;
            padding: 8px 12px 8px 32px;
          }

          .btn {
            font-size: 12px;
            padding: 8px;
          }

          .filter-sidebar {
            width: 100%;
            top: 0;
            height: 100vh;
            padding: 12px;
          }

          .trial-list-item {
            padding: 8px;
          }

          .text-sm {
            font-size: 12px;
          }

          .text-xs {
            font-size: 11px;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .filter-sidebar {
            width: 240px;
          }
        }
      `}</style>
    </div>
  );
};

export default ClinicalTrials;