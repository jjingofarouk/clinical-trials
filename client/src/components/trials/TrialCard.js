import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink, Clock, Users, BeakerIcon, MapPin, Target, ChartBar, Shield, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  const [activeTab, setActiveTab] = useState('design');
  
  const protocolSection = trial.protocolSection;
  const nctId = protocolSection?.identificationModule?.nctId;

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const openTrialDetails = (e) => {
    e.stopPropagation();
    window.open(`https://clinicaltrials.gov/study/${nctId}`, '_blank');
  };

  // Data extraction code remains the same...
  const studyData = {
    title: protocolSection?.identificationModule?.briefTitle,
    type: protocolSection?.designModule?.studyType,
    phase: protocolSection?.designModule?.phases?.join(', '),
    description: protocolSection?.descriptionModule?.briefSummary,
    startDate: protocolSection?.statusModule?.startDateStruct?.date,
    completionDate: protocolSection?.statusModule?.completionDateStruct?.date,
    status: protocolSection?.statusModule?.overallStatus
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Recruiting': 'bg-green-100 text-green-800',
      'Active, not recruiting': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Not yet recruiting': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800',
      'Withdrawn': 'bg-red-100 text-red-800',
      'Suspended': 'bg-orange-100 text-orange-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'design', label: 'Study Design', icon: BeakerIcon },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'interventions', label: 'Interventions', icon: Target },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'outcomes', label: 'Outcomes', icon: ChartBar },
    { id: 'regulatory', label: 'Regulatory', icon: Shield },
    { id: 'results', label: 'Results', icon: FileText }
  ];

  return (
    <Card className="bg-white overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div 
          onClick={toggleExpand}
          className="cursor-pointer transition-colors hover:bg-gray-50"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(studyData.status)}`}>
                    {studyData.status}
                  </span>
                  {studyData.phase && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Phase {studyData.phase}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {studyData.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{studyData.startDate} - {studyData.completionDate || 'Ongoing'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>NCT{nctId}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openTrialDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="View on ClinicalTrials.gov"
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
            {studyData.description && (
              <p className="text-gray-600 line-clamp-2">{studyData.description}</p>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200">
            <div className="border-b border-gray-200 px-4 overflow-x-auto">
              <div className="flex space-x-4">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                      ${activeTab === id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'design' && <StudyDesign design={designData} />}
              {activeTab === 'participants' && <Participants participants={participantsData} />}
              {activeTab === 'interventions' && <Interventions interventions={interventionsData} />}
              {activeTab === 'locations' && <Locations locations={locationsData} />}
              {activeTab === 'outcomes' && <Outcomes outcomes={outcomesData} />}
              {activeTab === 'regulatory' && <RegulatoryInfo regulatory={regulatoryData} />}
              {activeTab === 'results' && <Results results={resultsData} />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialCard;