import React from 'react';
import { ChevronDown, Pill, Box, Users, Activity, Clock, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

const getStatusStyle = (status) => {
  const styleMap = {
    'ACTIVE': {
      background: '#00A9B5',
      color: '#FFFFFF',
      iconBg: '#008891'
    },
    'PENDING': {
      background: '#FFB648',
      color: '#2D3C4E',
      iconBg: '#F59E0B'
    },
    'COMPLETED': {
      background: '#4A90E2',
      color: '#FFFFFF',
      iconBg: '#2563EB'
    },
    'SUSPENDED': {
      background: '#FF6B6B',
      color: '#FFFFFF',
      iconBg: '#DC2626'
    }
  };
  return styleMap[status?.toUpperCase()] || {
    background: '#5B6B7C',
    color: '#FFFFFF',
    iconBg: '#4A5568'
  };
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
  return <IconComponent className="w-5 h-5" />;
};

const InterventionCard = ({ intervention, isLast }) => {
  const [expanded, setExpanded] = React.useState(false);
  const statusStyle = getStatusStyle(intervention.status);

  return (
    <div className={`
      bg-white rounded-xl shadow-sm
      ${!isLast ? 'mb-4' : ''}
      transition-all duration-200 hover:shadow-md
    `}>
      <div
        onClick={() => setExpanded(!expanded)}
        className={`
          cursor-pointer p-4 rounded-xl
          flex items-center justify-between
          transition-colors duration-200
        `}
        style={{ backgroundColor: statusStyle.background }}
      >
        <div className="flex items-center space-x-4">
          <div className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-white
          `}
          style={{ backgroundColor: statusStyle.iconBg }}>
            {getInterventionIcon(intervention.type)}
          </div>
          
          <div>
            <h3 className={`
              font-medium text-lg
              ${statusStyle.color === '#FFFFFF' ? 'text-white' : 'text-[#2D3C4E]'}
            `}>
              {intervention.name || 'Unnamed Intervention'}
            </h3>
            
            <div className="flex items-center space-x-3 mt-1">
              <span className={`
                text-sm
                ${statusStyle.color === '#FFFFFF' ? 'text-white/90' : 'text-[#5B6B7C]'}
              `}>
                {intervention.type || 'Type not specified'}
              </span>
              
              {intervention.status && (
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${statusStyle.color === '#FFFFFF' ? 'bg-white/20 text-white' : 'bg-[#2D3C4E]/10 text-[#2D3C4E]'}
                `}>
                  {intervention.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <ChevronDown 
          className={`
            w-5 h-5 transition-transform duration-200
            ${expanded ? 'rotate-180' : ''}
            ${statusStyle.color === '#FFFFFF' ? 'text-white' : 'text-[#2D3C4E]'}
          `}
        />
      </div>

      {expanded && (
        <div className="p-4 border-t border-[#E4EEF1]">
          {intervention.dosage && (
            <div className="flex items-center mb-3 text-[#2D3C4E]">
              <Pill className="w-4 h-4 mr-3 text-[#00A9B5]" />
              <span className="font-medium mr-2">Dosage:</span>
              <span>{intervention.dosage}</span>
            </div>
          )}
          
          {intervention.route && (
            <div className="flex items-center text-[#2D3C4E]">
              <ArrowRight className="w-4 h-4 mr-3 text-[#00A9B5]" />
              <span className="font-medium mr-2">Route:</span>
              <span>{intervention.route}</span>
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#00A9B5] p-5 flex items-center">
          <AlertCircle className="w-6 h-6 text-white mr-3" />
          <h2 className="text-xl font-semibold text-white">Trial Interventions</h2>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center text-[#5B6B7C]">
          <AlertCircle className="w-8 h-8 mb-3 text-[#C5D5DA]" />
          <span className="text-sm">No intervention data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#00A9B5] p-5 flex items-center">
        <AlertCircle className="w-6 h-6 text-white mr-3" />
        <h2 className="text-xl font-semibold text-white">Trial Interventions</h2>
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