import React, { useState, useEffect } from 'react';
import './ClinicalTrials.css'; // Import the CSS file

// Import all components
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
      });

      if (filters.phase) queryParams.append('filter.phase', filters.phase);
      if (filters.studyType) queryParams.append('filter.studyType', filters.studyType);
      if (filters.gender) queryParams.append('filter.sex', filters.gender);
      if (filters.ageGroup) queryParams.append('filter.ageGroup', filters.ageGroup);
      if (filters.healthyVolunteers) queryParams.append('filter.healthyVolunteers', 'true');
      if (filters.hasResults) queryParams.append('filter.hasResults', 'true');
      if (filters.fundingType) queryParams.append('filter.fundingType', filters.fundingType);

      if (filters.enrollmentCount.min || filters.enrollmentCount.max) {
        queryParams.append('filter.enrollment.min', filters.enrollmentCount.min || '0');
        if (filters.enrollmentCount.max) {
          queryParams.append('filter.enrollment.max', filters.enrollmentCount.max);
        }
      }

      const response = await fetch(
        `https://clinicaltrials.gov/api/v2/studies?${queryParams.toString()}`
      );
      const data = await response.json();
      setTrials(data.studies || []);
    } catch (error) {
      console.error('Error fetching trials:', error);
    }
    setLoading(false);
  };

  const TrialCard = ({ trial }) => {
    const protocolSection = trial.protocolSection;
    const nctId = protocolSection?.identificationModule?.nctId;
    const isExpanded = expandedTrialId === nctId;

    const toggleExpand = () => {
      setExpandedTrialId(isExpanded ? null : nctId);
    };

    const openTrialDetails = () => {
      const url = `https://clinicaltrials.gov/study/${nctId}`;
      window.open(url, '_blank');
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
      <div className="card">
        <div className="card-header" onClick={toggleExpand}>
          <StudyDetails study={studyData} />
          <span className="icon">{isExpanded ? "▲" : "▼"}</span>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <StudyDesign design={designData} />
            <Participants participants={participantsData} />
            <Interventions interventions={interventionsData} />
            <Locations locations={locationsData} />
            <Outcomes outcomes={outcomesData} />
            <Statistics stats={statsData} />
            <RegulatoryInfo regulatory={regulatoryData} />
            <Results results={resultsData} />
          </div>
        )}
      </div>
    );
  };

  const FilterModal = () => (
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
            {/* Add other filter inputs similarly */}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => setFilters({
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
            Reset
          </button>
          <button onClick={() => { searchTrials(); setShowFilters(false); }}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search clinical trials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilters(true)}>Filter</button>
        <button onClick={searchTrials}>Search</button>
      </div>

      <FilterModal />
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="list-container">
          {trials.length > 0 ? (
            trials.map((trial) => <TrialCard key={trial.protocolSection?.identificationModule?.nctId} trial={trial} />)
          ) : (
            <div className="empty-text">No trials found. Try adjusting your search criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicalTrials;