// ClinicalTrials.jsx
import React, { useState, useEffect } from 'react';
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

  const searchTrials = async () => {
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
      if (filters.interventionType) queryParams.append('filter.interventionType', filters.interventionType);
      if (filters.startDate) queryParams.append('filter.startDate', filters.startDate);
      if (filters.completionDate) queryParams.append('filter.completionDate', filters.completionDate);
      if (filters.conditions.length) queryParams.append('filter.conditions', filters.conditions.join(','));
      if (filters.locations.length) queryParams.append('filter.locations', filters.locations.join(','));
      if (filters.participantAge.min) queryParams.append('filter.minimumAge', filters.participantAge.min);
      if (filters.participantAge.max) queryParams.append('filter.maximumAge', filters.participantAge.max);
      if (filters.enrollmentCount.min) queryParams.append('filter.enrollment.min', filters.enrollmentCount.min);
      if (filters.enrollmentCount.max) queryParams.append('filter.enrollment.max', filters.enrollmentCount.max);

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
  };

  const TrialCard = ({ trial }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId;
    const isExpanded = expandedTrialId === nctId;

    const toggleExpand = () => {
      setExpandedTrialId(isExpanded ? null : nctId);
    };

    const studyData = {
      title: protocolSection?.identificationModule?.briefTitle,
      type: protocolSection?.designModule?.studyType,
      phase: protocolSection?.designModule?.phases?.join(', '),
      description: protocolSection?.descriptionModule?.briefSummary,
      startDate: protocolSection?.statusModule?.startDateStruct?.date,
      completionDate: protocolSection?.statusModule?.completionDateStruct?.date,
      status: protocolSection?.statusModule?.overallStatus
    };

    const interventionsData = protocolSection?.armsInterventionsModule?.interventions || [];
    const locationsData = protocolSection?.contactsLocationsModule?.locations || [];
    const outcomesData = {
      primary: protocolSection?.outcomesModule?.primaryOutcomes?.map(o => o.measure).join(', '),
      secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.map(o => o.measure).join(', '),
      timeFrames: protocolSection?.outcomesModule?.primaryOutcomes?.map(o => o.timeFrame).join(', ')
    };

    const participantsData = {
      eligibility: protocolSection?.eligibilityModule?.eligibilityCriteria,
      ageRange: `${protocolSection?.eligibilityModule?.minimumAge} - ${protocolSection?.eligibilityModule?.maximumAge}`,
      sex: protocolSection?.eligibilityModule?.sex,
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count
    };

    const regulatoryData = {
      nctId: nctId,
      fdaRegulated: protocolSection?.oversightModule?.isFdaRegulatedDrug,
      sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name
    };

    const resultsData = {
      adverseEvents: protocolSection?.resultsSection?.adverseEventsModule?.description,
      studyResults: protocolSection?.resultsSection?.baselineModule?.description,
      publications: protocolSection?.referencesModule?.references?.map(r => r.citation).join(', ')
    };

    const statsData = {
      enrollment: protocolSection?.designModule?.enrollmentInfo?.count,
      primary: protocolSection?.outcomesModule?.primaryOutcomes?.length,
      secondary: protocolSection?.outcomesModule?.secondaryOutcomes?.length
    };

    const designData = {
      allocation: protocolSection?.designModule?.allocation,
      masking: protocolSection?.designModule?.masking?.masking,
      model: protocolSection?.designModule?.interventionModel,
      endpoint: protocolSection?.designModule?.primaryPurpose
    };

    return (
      <div className="trial-card">
        <div className="trial-card-header" onClick={toggleExpand}>
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
    <div className={`filter-modal ${showFilters ? 'active' : ''}`}>
      <div className="modal-overlay" onClick={() => setShowFilters(false)}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Advanced Filters</h3>
          <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>Status</label>
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
          </div>

          <div className="filter-group">
            <label>Phase</label>
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
          </div>

          <div className="filter-group">
            <label>Study Type</label>
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
          </div>

          <div className="filter-group">
            <label>Age Group</label>
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
          </div>

          <div className="filter-group">
            <label>Gender</label>
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
          </div>

          <div className="filter-group">
            <label>Funding Type</label>
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
          </div>

          <div className="filter-group">
            <label>Intervention Type</label>
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
          </div>

          <div className="filter-group">
            <label>Healthy Volunteers</label>
            <input
              type="checkbox"
              checked={filters.healthyVolunteers}
              onChange={(e) => setFilters({ ...filters, healthyVolunteers: e.target.checked })}
            />
          </div>

          <div className="filter-group">
            <label>Has Results</label>
            <input
              type="checkbox"
              checked={filters.hasResults}
              onChange={(e) => setFilters({ ...filters, hasResults: e.target.checked })}
            />
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Completion Date</label>
            <input
              type="date"
              value={filters.completionDate}
              onChange={(e) => setFilters({ ...filters, completionDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Conditions (comma-separated)</label>
            <input
              type="text"
              value={filters.conditions.join(',')}
              onChange={(e) => setFilters({ ...filters, conditions: e.target.value.split(',') })}
            />
          </div>

          <div className="filter-group">
            <label>Locations (comma-separated)</label>
            <input
              type="text"
              value={filters.locations.join(',')}
              onChange={(e) => setFilters({ ...filters, locations: e.target.value.split(',') })}
            />
          </div>

          <div className="filter-group">
            <label>Participant Age Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.participantAge.min}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  participantAge: { ...filters.participantAge, min: e.target.value }
                })}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.participantAge.max}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  participantAge: { ...filters.participantAge, max: e.target.value }
                })}
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
                onChange={(e) => setFilters({ 
                  ...filters, 
                  enrollmentCount: { ...filters.enrollmentCount, min: e.target.value }
                })}
              />
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

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setFilters({
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
          })}>
            Reset Filters
          </button>
          <button className="btn btn-primary" onClick={() => { searchTrials(); setShowFilters(false); }}>
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
          />
          <button className="btn btn-filter" onClick={() => setShowFilters(true)}>
            <span className="filter-icon">⚙️</span> Filters
          </button>
          <button className="btn btn-primary" onClick={searchTrials}>
            Search
          </button>
        </div>
      </header>

      <FilterModal />
      
      <main className="trials-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
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
          <div className="no-results">
            No trials found. Try adjusting your search criteria.
          </div>
        )}
      </main>
    </div>
  );
};

export default ClinicalTrials;