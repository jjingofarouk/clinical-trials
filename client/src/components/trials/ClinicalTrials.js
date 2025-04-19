import React, { useState, useCallback } from 'react';
import './ClinicalTrials.css';
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Participants from './Participants';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';
import Statistics from './Statistics';
import StudyDesign from './StudyDesign';
import StudyDetails from './StudyDetails';

const ClinicalTrials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTrialId, setExpandedTrialId] = useState(null);
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

  const TrialCard = ({ trial }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId;
    const isExpanded = expandedTrialId === nctId;

    const toggleExpand = () => {
      setExpandedTrialId(isExpanded ? null : nctId);
    };

    const studyData = {
      title: protocolSection?.identificationModule?.briefTitle || 'No Title',
      type: protocolSection?.designModule?.studyType || 'Unknown',
      phase: protocolSection?.designModule?.phases?.join(', ') || 'N/A',
      description: protocolSection?.descriptionModule?.briefSummary || 'No Description',
      startDate: protocolSection?.statusModule?.startDateStruct?.date || 'N/A',
      completionDate:
        protocolSection?.statusModule?.completionDateStruct?.date || 'N/A',
      status: protocolSection?.statusModule?.overallStatus || 'Unknown',
    };

    const interventionsData = protocolSection?.armsInterventionsModule?.interventions || [];
    const locationsData = protocolSection?.contactsLocationsModule?.locations || [];
    const outcomesData = {
      primary:
        protocolSection?.outcomesModule?.primaryOutcomes?.map((o) => o.measure).join(', ') ||
        'N/A',
      secondary:
        protocolSection?.outcomesModule?.secondaryOutcomes
          ?.map((o) => o.measure)
          .join(', ') || 'N/A',
      timeFrames:
        protocolSection?.outcomesModule?.primaryOutcomes
          ?.map((o) => o.timeFrame)
          .join(', ') || 'N/A',
    };

    const participantsData = {
      eligibility: protocolSection?.eligibilityModule?.eligibilityCriteria || 'N/A',
      ageRange: `${protocolSection?.eligibilityModule?.minimumAge || 'N/A'} - ${
        protocolSection?.eligibilityModule?.maximumAge || 'N/A'
      }`,
      sex: protocolSection?.eligibilityModule?.sex || 'N/A',
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count || 'N/A',
    };

    const regulatoryData = {
      nctId: nctId || 'N/A',
      fdaRegulated: protocolSection?.oversightModule?.isFdaRegulatedDrug ? 'Yes' : 'No',
      sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name || 'N/A',
    };

    const resultsData = {
      adverseEvents:
        protocolSection?.resultsSection?.adverseEventsModule?.description || 'N/A',
      studyResults: protocolSection?.resultsSection?.baselineModule?.description || 'N/A',
      publications:
        protocolSection?.referencesModule?.references
          ?.map((r) => r.citation)
          .join(', ') || 'N/A',
    };

    const statsData = {
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count || 0,
      primary: protocolSection?.outcomesModule?.primaryOutcomes?.length || 0,
      secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.length || 0,
    };

    const designData = {
      allocation: protocolSection?.designModule?.allocation || 'N/A',
      masking: protocolSection?.designModule?.masking?.masking || 'N/A',
      model: protocolSection?.designModule?.interventionModel || 'N/A',
      endpoint: protocolSection?.designModule?.primaryPurpose || 'N/A',
    };

    return (
      <div className="trial-card" role="region" aria-label={`Trial ${studyData.title}`}>
        <div
          className="trial-card-header"
          onClick={toggleExpand}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && toggleExpand()}
          aria-expanded={isExpanded}
        >
          <StudyDetails study={studyData} />
          <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>
        {isExpanded && (
          <div className="trial-expanded-content">
            <div className="trial-grid">
              <StudyDesign design={designData} />
              <Participants participants={participantsData} />
              <Interventions interventions={interventionsData} />
              <Locations locations={locationsData} />
              <Outcomes outcomes={outcomesData} />
              <Statistics stats={statsData} />
              <RegulatoryInfo regulatory={regulatoryData} />
              <Results results={resultsData} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const FilterModal = () => (
    <div className={`filter-modal ${showFilters ? 'active' : ''}`} aria-hidden={!showFilters}>
      <div
        className="modal-overlay"
        onClick={() => setShowFilters(false)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setShowFilters(false)}
      />
      <div className="modal-content" role="dialog" aria-labelledby="filter-modal-title">
        <div className="modal-header">
          <h3 id="filter-modal-title">Advanced Filters</h3>
          <button
            className="close-btn"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {filterOptions.status.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="phase-filter">Phase</label>
            <select
              id="phase-filter"
              value={filters.phase}
              onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
            >
              {filterOptions.phase.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="study-type-filter">Study Type</label>
            <select
              id="study-type-filter"
              value={filters.studyType}
              onChange={(e) => setFilters({ ...filters, studyType: e.target.value })}
            >
              {filterOptions.studyType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="age-group-filter">Age Group</label>
            <select
              id="age-group-filter"
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
            >
              {filterOptions.ageGroup.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="gender-filter">Gender</label>
            <select
              id="gender-filter"
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            >
              {filterOptions.gender.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="funding-type-filter">Funding Type</label>
            <select
              id="funding-type-filter"
              value={filters.fundingType}
              onChange={(e) => setFilters({ ...filters, fundingType: e.target.value })}
            >
              {filterOptions.fundingType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="intervention-type-filter">Intervention Type</label>
            <select
              id="intervention-type-filter"
              value={filters.interventionType}
              onChange={(e) => setFilters({ ...filters, interventionType: e.target.value })}
            >
              {filterOptions.interventionType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="healthy-volunteers-filter">Healthy Volunteers</label>
            <input
              id="healthy-volunteers-filter"
              type="checkbox"
              checked={filters.healthyVolunteers}
              onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="has-results-filter">Has Results</label>
            <input
              id="has-results-filter"
              type="checkbox"
              checked={filters.hasResults}
              onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="start-date-filter">Start Date</label>
            <input
              id="start-date-filter"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="completion-date-filter">Completion Date</label>
            <input
              id="completion-date-filter"
              type="date"
              value={filters.completionDate}
              onChange={(e) => setFilters({ ...filters, completionDate: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="conditions-filter">Conditions (comma-separated)</label>
            <input
              id="conditions-filter"
              type="text"
              value={filters.conditions.join(',')}
              onChange={(e) =>
                setFilters({ ...filters, conditions: e.target.value.split(',').map((c) => c.trim()) })
              }
            />
          </div>
          <div className="filter-group">
            <label htmlFor="locations-filter">Locations (comma-separated)</label>
            <input
              id="locations-filter"
              type="text"
              value={filters.locations.join(',')}
              onChange={(e) =>
                setFilters({ ...filters, locations: e.target.value.split(',').map((l) => l.trim()) })
              }
            />
          </div>
          <div className="filter-group">
            <label>Participant Age Range</label>
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
                aria-label="Maximum age"
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Enrollment Count Range</label>
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
                aria-label="Maximum enrollment"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
          <button
            className="btn btn-primary"
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

  return (
    <div className="clinical-trials-container">
      <header className="search-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search clinical trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchTrials()}
            aria-label="Search clinical trials"
          />
          <button
            className="btn btn-filter"
            onClick={() => setShowFilters(true)}
            aria-label="Open advanced filters"
          >
            <span className="filter-icon">⚙️</span> Filters
          </button>
          <button className="btn btn-primary" onClick={searchTrials} aria-label="Search trials">
            Search
          </button>
        </div>
      </header>
      <FilterModal />
      <main className="trials-content">
        {loading ? (
          <div className="loading-spinner" aria-live="polite">
            <div className="spinner" />
            Loading trials...
          </div>
        ) : trials.length > 0 ? (
          <div className="trials-grid">
            {trials.map((trial) => (
              <TrialCard
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
  );
};

export default ClinicalTrials;