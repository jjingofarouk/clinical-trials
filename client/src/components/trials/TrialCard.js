import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import StudyDetails from './StudyDetails';
import StudyDesign from './StudyDesign';
import Participants from './Participants';
import Interventions from './Interventions';
import Locations from './Locations';
import Outcomes from './Outcomes';
import Statistics from './Statistics';
import RegulatoryInfo from './RegulatoryInfo';
import Results from './Results';

const TrialCard = ({ trial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const protocolSection = trial.protocolSection;
  const nctId = protocolSection?.identificationModule?.nctId;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const openTrialDetails = () => {
    window.open(`https://clinicaltrials.gov/study/${nctId}`, '_blank');
  };

  // Extract all required data from protocolSection
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
      <div className="relative">
        <button 
          onClick={toggleExpand} 
          className="w-full text-left focus:outline-none"
        >
          <div className="flex justify-between items-center p-4">
            <div className="flex-grow">
              <StudyDetails study={studyData} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openTrialDetails();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open trial details"
              >
                <ExternalLink size={20} className="text-gray-500" />
              </button>
              {isExpanded ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </div>
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
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

export default TrialCard;