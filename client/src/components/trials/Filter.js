import React from 'react';
import './FilterModal.css'; // Import the CSS file

const FilterModal = ({ showFilters, setShowFilters, filters, setFilters, searchTrials }) => {
  const filterOptions = {
    status: [
      { label: 'Recruiting', value: 'RECRUITING' },
      { label: 'Not Yet Recruiting', value: 'NOT_YET_RECRUITING' },
      { label: 'Active, not recruiting', value: 'ACTIVE_NOT_RECRUITING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Enrolling by invitation', value: 'ENROLLING_BY_INVITATION' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Terminated', value: 'TERMINATED' },
      { label: 'Withdrawn', value: 'WITHDRAWN' }
    ],
    phase: [
      { label: 'All Phases', value: '' },
      { label: 'Early Phase 1', value: 'EARLY_PHASE1' },
      { label: 'Phase 1', value: 'PHASE1' },
      { label: 'Phase 1/Phase 2', value: 'PHASE1_PHASE2' },
      { label: 'Phase 2', value: 'PHASE2' },
      { label: 'Phase 2/Phase 3', value: 'PHASE2_PHASE3' },
      { label: 'Phase 3', value: 'PHASE3' },
      { label: 'Phase 4', value: 'PHASE4' }
    ],
    studyType: [
      { label: 'All Types', value: '' },
      { label: 'Interventional', value: 'INTERVENTIONAL' },
      { label: 'Observational', value: 'OBSERVATIONAL' },
      { label: 'Patient Registry', value: 'PATIENT_REGISTRY' },
      { label: 'Expanded Access', value: 'EXPANDED_ACCESS' }
    ],
    ageGroup: [
      { label: 'All Ages', value: '' },
      { label: 'Child (0-17)', value: 'CHILD' },
      { label: 'Adult (18-64)', value: 'ADULT' },
      { label: 'Older Adult (65+)', value: 'OLDER_ADULT' }
    ],
    gender: [
      { label: 'All', value: '' },
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
      { label: 'All Genders', value: 'ALL' }
    ],
    fundingType: [
      { label: 'All', value: '' },
      { label: 'NIH', value: 'NIH' },
      { label: 'Industry', value: 'INDUSTRY' },
      { label: 'Other U.S. Federal Agency', value: 'OTHER_US_FED' },
      { label: 'Academic/University', value: 'ACADEMIC' }
    ],
    interventionType: [
      { label: 'All', value: '' },
      { label: 'Drug', value: 'DRUG' },
      { label: 'Device', value: 'DEVICE' },
      { label: 'Biological', value: 'BIOLOGICAL' },
      { label: 'Procedure', value: 'PROCEDURE' },
      { label: 'Behavioral', value: 'BEHAVIORAL' },
      { label: 'Dietary Supplement', value: 'DIETARY_SUPPLEMENT' }
    ]
  };

  return (
    <div className={`modal ${showFilters ? 'visible' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Advanced Filters</h3>
          <button onClick={() => setShowFilters(false)}>×</button>
        </div>

        <div className="filter-scroll">
          <div className="filter-section">
            <h4>Basic Information</h4>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {filterOptions.status.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.phase}
              onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
            >
              {filterOptions.phase.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.studyType}
              onChange={(e) => setFilters({ ...filters, studyType: e.target.value })}
            >
              {filterOptions.studyType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="distance-container">
              <input
                type="text"
                placeholder="Distance (miles)"
                value={filters.distance}
                onChange={(e) => setFilters({ ...filters, distance: e.target.value })}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Participant Criteria</h4>
            <select
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
            >
              {filterOptions.ageGroup.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            >
              {filterOptions.gender.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="range-input-container">
              <label>Enrollment Count</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.enrollmentCount.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    enrollmentCount: { ...filters.enrollmentCount, min: e.target.value }
                  })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.enrollmentCount.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    enrollmentCount: { ...filters.enrollmentCount, max: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Study Details</h4>
            <select
              value={filters.fundingType}
              onChange={(e) => setFilters({ ...filters, fundingType: e.target.value })}
            >
              {filterOptions.fundingType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.interventionType}
              onChange={(e) => setFilters({ ...filters, interventionType: e.target.value })}
            >
              {filterOptions.interventionType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={filters.hasResults}
                  onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
                />
                Has Results
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.healthyVolunteers}
                  onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
                />
                Healthy Volunteers
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="reset-button"
            onClick={() => {
              setFilters({
                status: 'RECRUITING',
                phase: '',
                distance: '',
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
                sponsorType: '',
                participantAge: { min: '', max: '' },
                enrollmentCount: { min: '', max: '' },
              });
            }}
          >
            Reset
          </button>
          <button
            className="apply-button"
            onClick={() => {
              searchTrials();
              setShowFilters(false);
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;