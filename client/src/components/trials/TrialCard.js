import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink, Clock, Users, BeakerIcon, MapPin, Target, ChartBar, Shield, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge, Tabs, TabList, Tab, TabPanel, Box, Text } from '@shadcn/ui';

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
    <Card className="bg-white overflow-hidden shadow-sm border rounded-md p-4">
      <CardHeader className="flex justify-between items-center">
        <div>
          <Badge className={`mr-2 ${getStatusColor(studyData.status)} text-sm font-medium`}>
            {studyData.status}
          </Badge>
          {studyData.phase && (
            <Badge className="bg-purple-100 text-purple-800 text-sm font-medium">
              Phase {studyData.phase}
            </Badge>
          )}
          <Text className="font-semibold text-xl mt-2">{studyData.title}</Text>
        </div>
        <Button
          onClick={openTrialDetails}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="View on ClinicalTrials.gov"
        >
          <ExternalLink size={20} className="text-gray-500" />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <Text className="text-sm text-gray-600">
            <Clock size={16} className="inline-block mr-1" />
            {studyData.startDate} - {studyData.completionDate || 'Ongoing'}
          </Text>
          <Text className="text-sm text-gray-600">
            <Users size={16} className="inline-block mr-1" />
            NCT{nctId}
          </Text>
        </div>

        <Text className="text-gray-600 mt-2 line-clamp-2">{studyData.description}</Text>

        {isExpanded && (
          <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab}>
            <TabList className="mt-4 flex justify-between space-x-2 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <Tab key={id} value={id} className={`text-sm font-medium flex items-center gap-2 py-1 px-3 transition-colors rounded-md
                  ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon size={16} />
                  {label}
                </Tab>
              ))}
            </TabList>

            <Box className="mt-6">
              {activeTab === 'design' && <StudyDesign design={studyData} />}
              {activeTab === 'participants' && <Participants participants={studyData} />}
              {activeTab === 'interventions' && <Interventions interventions={studyData} />}
              {activeTab === 'locations' && <Locations locations={studyData} />}
              {activeTab === 'outcomes' && <Outcomes outcomes={studyData} />}
              {activeTab === 'regulatory' && <RegulatoryInfo regulatory={studyData} />}
              {activeTab === 'results' && <Results results={studyData} />}
            </Box>
          </Tabs>
        )}

        <Button 
          onClick={toggleExpand} 
          className="w-full mt-4 text-blue-600 text-sm font-medium flex items-center justify-center gap-2 py-2 hover:bg-blue-50"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrialCard;
