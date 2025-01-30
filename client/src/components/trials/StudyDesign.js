import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Eye, 
  Layout, 
  Target, 
  Columns, 
  AlertCircle 
} from 'lucide-react';

const DesignItem = ({ Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
          <Icon size={16} className="text-blue-600" />
        </div>
        <span className="text-base font-semibold text-blue-900">{label}</span>
      </div>
      <span className="text-[15px] text-gray-700 flex-1 text-right">
        {value || 'Not specified'}
      </span>
    </div>
  );
};

const StudyDesign = ({ design }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const designItems = [
    { Icon: Shuffle, label: 'Allocation', value: design?.allocation },
    { Icon: Eye, label: 'Masking', value: design?.masking },
    { Icon: Layout, label: 'Model', value: design?.model },
    { Icon: Target, label: 'Endpoint', value: design?.endpoint },
  ];

  const containerClasses = `
    bg-white 
    rounded-2xl 
    my-4 
    overflow-hidden 
    shadow-lg 
    transition-all 
    duration-600
    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
  `;

  if (!design) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center p-5 border-b border-white/10 bg-gradient-to-r from-blue-600 to-blue-800">
          <Columns className="w-7 h-7 text-white mr-3" />
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            Study Design
          </h2>
        </div>
        <div className="bg-white flex flex-col items-center py-8">
          <AlertCircle className="w-6 h-6 text-gray-400" />
          <p className="text-base text-gray-400 mt-2">
            No study design data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center p-5 border-b border-white/10 bg-gradient-to-r from-blue-600 to-blue-800">
        <Columns className="w-7 h-7 text-white mr-3" />
        <h2 className="text-2xl font-extrabold text-white tracking-wide">
          Study Design
        </h2>
      </div>

      <div className="p-5 bg-white">
        {designItems.map((item, index) => (
          <DesignItem
            key={index}
            Icon={item.Icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyDesign;