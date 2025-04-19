import React, { useState, useEffect } from 'react';
import { Shield, Hash, CheckSquare, Briefcase, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="bg-[#000000] px-4 py-3 flex items-center gap-2">
    <Icon size={20} className="text-white" />
    <h2 className="text-lg font-semibold text-white">{title}</h2>
  </div>
);

const RegulatoryItem = ({ label, value, icon: Icon, isStatus = false }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-gray-600" />
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </div>
    {isStatus ? (
      <div
        className={`flex items-center px-2 py-1 rounded-full ${
          value === 'Yes' ? 'bg-black/10' : 'bg-black/10'
        }`}
      >
        {value === 'Yes' ? (
          <CheckCircle size={12} className="text-black mr-1" />
        ) : (
          <XCircle size={12} className="text-black mr-1" />
        )}
        <span className="text-xs font-medium text-gray-900">{value}</span>
      </div>
    ) : (
      <span className="text-sm text-gray-600 text-right max-w-[50%] truncate">
        {value || 'Not specified'}
      </span>
    )}
  </div>
);

const RegulatoryInfo = ({ regulatory }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card
      className={`
        transform transition-all duration-300 ease-out max-w-7xl mx-auto
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
        my-3
      `}
    >
      <CardHeader icon={Shield} title="Regulatory Information" />
      {!regulatory ? (
        <div className="flex flex-col items-center py-6">
          <AlertCircle size={20} className="text-gray-400" />
          <p className="text-sm text-gray-400 mt-2">No regulatory data available</p>
        </div>
      ) : (
        <div className="p-4">
          <RegulatoryItem label="NCT ID" value={regulatory.nctId} icon={Hash} />
          <RegulatoryItem
            label="FDA Regulated"
            value={regulatory.fdaRegulated ? 'Yes' : 'No'}
            icon={CheckSquare}
            isStatus
          />
          <RegulatoryItem label="Sponsor" value={regulatory.sponsor} icon={Briefcase} />
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

          .px-4 {
            padding-left: 12px;
            padding-right: 12px;
          }

          .py-3 {
            padding-top: 10px;
            padding-bottom: 10px;
          }

          .text-lg {
            font-size: 16px;
          }

          .p-4 {
            padding: 12px;
          }

          .text-sm {
            font-size: 12px;
          }

          .text-xs {
            font-size: 11px;
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

          .my-3 {
            margin-top: 12px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </Card>
  );
};

export default RegulatoryInfo;