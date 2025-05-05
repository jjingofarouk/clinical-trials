import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, setShowFilters, searchTrials }) => {
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
      { label: 'Other U.S. Federal Agency', value: 'FED' },
      { label: 'Other', value: 'OTHER' },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="filter-sidebar active"
      aria-hidden={false}
    >
      <div className="filter-modal">
        <div className="sidebar-header">
          <h3>Filter Trials</h3>
          <button
            className="close-btn"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            <X size={20} color="#1E293B" />
          </button>
        </div>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">Status</label>
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
            <label htmlFor="phase-filter" className="filter-label">Phase</label>
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
            <label htmlFor="studyType-filter" className="filter-label">Study Type</label>
            <select
              id="studyType-filter"
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
            <label htmlFor="ageGroup-filter" className="filter-label">Age Group</label>
            <select
              id="ageGroup-filter"
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
            <label htmlFor="gender-filter" className="filter-label">Gender</label>
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
            <label htmlFor="fundingType-filter" className="filter-label">Funding Type</label>
            <select
              id="fundingType-filter"
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
            <label htmlFor="interventionType-filter" className="filter-label">Intervention Type</label>
            <select
              id="interventionType-filter"
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
            <label htmlFor="healthy-volunteers-filter" className="filter-label">
              Healthy Volunteers
            </label>
            <label className="filter-switch">
              <input
                id="healthy-volunteers-filter"
                type="checkbox"
                checked={filters.healthyVolunteers}
                onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="filter-group">
            <label htmlFor="has-results-filter" className="filter-label">
              Has Results
            </label>
            <label className="filter-switch">
              <input
                id="has-results-filter"
                type="checkbox"
                checked={filters.hasResults}
                onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="filter-group">
            <label htmlFor="conditions-filter" className="filter-label">Conditions</label>
            <input
              id="conditions-filter"
              type="text"
              placeholder="Enter conditions, comma-separated"
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
              placeholder="Enter locations, comma-separated"
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
                placeholder="Min Age"
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
                placeholder="Max Age"
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
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;