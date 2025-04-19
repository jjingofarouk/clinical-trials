import { useState, useCallback, useEffect } from 'react';
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
    status: '',
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
      { label: 'All Statuses', value: '' },
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

  const searchTrials = useCallback(async (isRandom = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        'pageSize': '50',
        'sort': isRandom ? 'random' : '',
      });

      if (!isRandom && searchQuery) queryParams.append('query.term', searchQuery);
      if (filters.status) queryParams.append('filter.overallStatus', filters.status);
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

  useEffect(() => {
    searchTrials(true); // Fetch random trials on mount
  }, []);

  const resetFilters = () => {
    setFilters({
      status: '',
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
        whileHover={{ backgroundColor: '#2D6A6F' }}
        className="trial-list-item"
        onClick={() => navigate(`/trials/${nctId}`)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate(`/trials/${nctId}`)}
        aria-label={`View trial ${title}`}
      >
        <div className="trial-list-content">
          <h3 className="trial-title">{title}</h3>
          <p className="trial-meta">NCT ID: {nctId}</p>
          <p className="trial-meta">Status: {status}</p>
          <p className="trial-meta">Phase: {phase}</p>
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
        {Object.entries(filterOptions).map(([key, options]) => (
          <div className="filter-group" key={key}>
            <label htmlFor={`${key}-filter`} className="filter-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <select
              id={`${key}-filter`}
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              className="filter-input"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="filter-group">
          <label htmlFor="healthy-volunteers-filter" className="filter-label flex items-center gap-2">
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
          <label htmlFor="has-results-filter" className="filter-label flex items-center gap-2">
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
          <label htmlFor="start-date-filter" className="filter-label">Start Date</label>
          <input
            id="start-date-filter"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="completion-date-filter" className="filter-label">Completion Date</label>
          <input
            id="completion-date-filter"
            type="date"
            value={filters.completionDate}
            onChange={(e) => setFilters({ ...filters, completionDate: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="conditions-filter" className="filter-label">Conditions</label>
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
          <label htmlFor="locations-filter" className="filter-label">Locations</label>
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
          <label className="filter-label">Participant Age Range</label>
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
          <label className="filter-label">Enrollment Count Range</label>
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
        <AnimatePresence>
          {showFilters && <FilterSidebar />}
        </AnimatePresence>
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
    </div>
  );
};

export default ClinicalTrials;