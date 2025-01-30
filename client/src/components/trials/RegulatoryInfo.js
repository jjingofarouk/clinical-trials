import React, { useState, useEffect } from 'react';
import { Shield, Hash, CheckSquare, Briefcase, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-5 py-5 border-b border-white/10 flex items-center">
    <Icon size={28} className="text-white mr-3" />
    <h2 className="text-2xl font-extrabold text-white tracking-wide">
      {title}
    </h2>
  </div>
);

const RegulatoryItem = ({ label, value, icon: Icon, isStatus = false }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-200">
    <div className="flex items-center">
      <Icon size={16} className="text-blue-600 mr-2" />
      <span className="text-base font-semibold text-blue-900">{label}</span>
    </div>
    {isStatus ? (
      <div className={`flex items-center px-3 py-1.5 rounded-full ${
        value === 'Yes' ? 'bg-emerald-600' : 'bg-red-600'
      }`}>
        {value === 'Yes' ? (
          <CheckCircle size={14} className="text-white mr-1" />
        ) : (
          <XCircle size={14} className="text-white mr-1" />
        )}
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
    ) : (
      <span className="text-[15px] text-slate-700 text-right">
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

  const containerClasses = `
    transform transition-all duration-500 ease-out
    ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
    my-4
  `;

  if (!regulatory) {
    return (
      <Card className={containerClasses}>
        <CardHeader icon={Shield} title="Regulatory Information" />
        <div className="flex flex-col items-center py-8">
          <AlertCircle size={24} className="text-slate-400" />
          <p className="text-base text-slate-400 mt-2">
            No regulatory data available
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={containerClasses}>
      <CardHeader icon={Shield} title="Regulatory Information" />
      
      <div className="p-5">
        <RegulatoryItem
          label="NCT ID"
          value={regulatory.nctId}
          icon={Hash}
        />
        <RegulatoryItem
          label="FDA Regulated"
          value={regulatory.fdaRegulated ? 'Yes' : 'No'}
          icon={CheckSquare}
          isStatus={true}
        />
        <RegulatoryItem
          label="Sponsor"
          value={regulatory.sponsor}
          icon={Briefcase}
        />
      </div>
    </Card>
  );
};

export default RegulatoryInfo;