import React, { useState, useEffect } from 'react';
import { Shuffle, Eye, Layout, Target, Columns, AlertCircle } from 'lucide-react';

const DesignItem = ({ Icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2 flex-1">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon size={16} className="text-gray-600" />
      </div>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </div>
    <span className="text-sm text-gray-600 flex-1 text-right truncate">
      {value || 'Not specified'}
    </span>
  </div>
);

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

  return (
    <div
      className={`
        bg-white rounded-2xl my-3 overflow-hidden transition-all duration-300 max-w-7xl mx-auto
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
    >
      <div className="flex items-center p-3 bg-[#000000]">
        <Columns className="w-5 h-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Study Design</h2>
      </div>
      {!design ? (
        <div className="flex flex-col items-center py-6 bg-white">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <p className="text-sm text-gray-400 mt-2">No study design data available</p>
        </div>
      ) : (
        <div className="p-4 bg-white">
          {designItems.map((item, index) => (
            <DesignItem key={index} Icon={item.Icon} label={item.label} value={item.value} />
          ))}
        </div>
      )}
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 640px) {
          .rounded-2xl {
            border-radius: 12px;
          }

          .my-3 {
            margin-top: 12px;
            margin-bottom: 12px;
          }

          .p-3 {
            padding: 10px;
          }

          .p-4 {
            padding: 12px;
          }

          .py-3 {
            padding-top: 8px;
            padding-bottom: 8px;
          }

          .text-lg {
            font-size: 16px;
          }

          .text-sm {
            font-size: 12px;
          }

          .w-8 {
            width: 28px;
          }

          .h-8 {
            height: 28px;
          }

          .w-5 {
            width: 18px;
          }

          .h-5 {
            height: 18px;
          }

          .py-6 {
            padding-top: 20px;
            padding-bottom: 20px;
          }

          .max-w-7xl {
            margin-left: 12px;
            margin-right: 12px;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .rounded-2xl {
            border-radius: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudyDesign;