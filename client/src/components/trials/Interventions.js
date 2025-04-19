import React from 'react';
import { ChevronDown, Pill, Box, Users, Activity, ArrowRight, AlertCircle } from 'lucide-react';

const getStatusStyle = (status) => {
  const styleMap = {
    'ACTIVE': { bg: '#000000', text: '#FFFFFF', iconBg: '#333333' },
    'PENDING': { bg: '#000000', text: '#FFFFFF', iconBg: '#333333' },
    'COMPLETED': { bg: '#000000', text: '#FFFFFF', iconBg: '#333333' },
    'SUSPENDED': { bg: '#000000', text: '#FFFFFF', iconBg: '#333333' },
  };
  return styleMap[status?.toUpperCase()] || { bg: '#000000', text: '#FFFFFF', iconBg: '#333333' };
};

const getInterventionIcon = (type) => {
  const iconMap = {
    'DRUG': Pill,
    'DEVICE': Box,
    'PROCEDURE': Activity,
    'BEHAVIORAL': Users,
    'OTHER': Box,
  };
  const IconComponent = iconMap[type?.toUpperCase()] || Box;
  return <IconComponent className="w-4 h-4" />;
};

const InterventionCard = ({ intervention, isLast }) => {
  const [expanded, setExpanded] = React.useState(false);
  const statusStyle = getStatusStyle(intervention.status);

  return (
    <div className={`bg-white rounded-2xl ${!isLast ? 'mb-3' : ''} transition-all duration-300`}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer p-4 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: statusStyle.bg }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: statusStyle.iconBg }}
          >
            {getInterventionIcon(intervention.type)}
          </div>
          <div>
            <h3 className="font-semibold text-base" style={{ color: statusStyle.text }}>
              {intervention.name || 'Unnamed Intervention'}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs" style={{ color: statusStyle.text + '90' }}>
                {intervention.type || 'Type not specified'}
              </span>
              {intervention.status && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: statusStyle.text + '20', color: statusStyle.text }}
                >
                  {intervention.status}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          style={{ color: statusStyle.text }}
        />
      </div>
      {expanded && (
        <div className="p-4 border-t border-gray-100">
          {intervention.dosage && (
            <div className="flex items-center mb-2 text-gray-800">
              <Pill className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium text-sm mr-1">Dosage:</span>
              <span className="text-sm">{intervention.dosage}</span>
            </div>
          )}
          {intervention.route && (
            <div className="flex items-center text-gray-800">
              <ArrowRight className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium text-sm mr-1">Route:</span>
              <span className="text-sm">{intervention.route}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Interventions = ({ interventions = [] }) => {
  if (interventions.length === 0) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="bg-black p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-white mr-2" />
          <h2 className="text-lg font-semibold text-white">Trial Interventions</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle className="w-6 h-6 mb-2 text-gray-400" />
          <span className="text-sm">No intervention data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="bg-black p-4 flex items-center">
        <AlertCircle className="w-5 h-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Trial Interventions</h2>
      </div>
      <div className="p-4">
        {interventions.map((intervention, index) => (
          <InterventionCard
            key={intervention.id || index}
            intervention={intervention}
            isLast={index === interventions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Interventions;