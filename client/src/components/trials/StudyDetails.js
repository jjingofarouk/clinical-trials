import React, { useState } from 'react';
import { ChevronUp, ChevronDown, AlertCircle, Info, FileText, Calendar, Activity, Layers, UserPlus, Clock, CheckCircle, CheckSquare, XCircle, MinusCircle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Recruiting': {
        colors: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
        icon: UserPlus
      },
      'Not Yet Recruiting': {
        colors: 'bg-gradient-to-r from-amber-500 to-amber-600',
        icon: Clock
      },
      'Active, not recruiting': {
        colors: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: CheckCircle
      },
      'Completed': {
        colors: 'bg-gradient-to-r from-gray-500 to-gray-600',
        icon: CheckSquare
      },
      'Terminated': {
        colors: 'bg-gradient-to-r from-red-500 to-red-600',
        icon: XCircle
      },
      'Withdrawn': {
        colors: 'bg-gradient-to-r from-purple-500 to-purple-600',
        icon: MinusCircle
      },
      'Unknown': {
        colors: 'bg-gradient-to-r from-gray-500 to-gray-600',
        icon: HelpCircle
      }
    };
    return configs[status] || configs['Unknown'];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${config.colors}`}>
      <Icon size={16} className="text-white mr-1.5" />
      <span className="text-white text-sm font-semibold">{status}</span>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex-1 bg-white rounded-xl p-4 text-center border border-slate-200">
    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
      <Icon size={20} className="text-blue-600" />
    </div>
    <div className="text-sm text-gray-900 mb-1">{label}</div>
    <div className="text-base font-semibold text-gray-900">{value || 'Not specified'}</div>
  </div>
);

const DateInfo = ({ icon: Icon, label, date }) => (
  <div className="flex items-center bg-gray-100 p-3 rounded-xl border border-slate-200">
    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
      <Icon size={16} className="text-blue-600" />
    </div>
    <span className="text-sm text-gray-900 flex-1">{label}</span>
    <span className="text-sm font-medium text-gray-900">{date || 'Not specified'}</span>
  </div>
);

const AccordionSection = ({ title, icon: Icon, children, initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 mb-3 overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
            <Icon size={20} className="text-blue-600" />
          </div>
          <span className="ml-3 text-base font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-slate-500" />
        ) : (
          <ChevronDown size={20} className="text-slate-500" />
        )}
      </button>
      {isExpanded && (
        <div className="transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

const StudyDetails = ({ study }) => {
  if (!study) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg my-4 p-10 text-center">
        <AlertCircle size={40} className="text-slate-400 mx-auto mb-3" />
        <div className="text-base text-slate-400">No study details available</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg my-4 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-5 space-y-4">
        <h1 className="text-2xl font-bold text-white leading-tight">{study.title}</h1>
        <StatusBadge status={study.status} />
      </div>

      <div className="p-4">
        <AccordionSection title="Overview" icon={Info} initiallyExpanded={true}>
          <div className="p-4 flex gap-4">
            <InfoCard icon={Activity} label="Study Type" value={study.type} />
            <InfoCard icon={Layers} label="Phase" value={study.phase} />
          </div>
        </AccordionSection>

        <AccordionSection title="Description" icon={FileText}>
          {study.description ? (
            <div className="p-4">
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-gray-900 text-base leading-relaxed">{study.description}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <span className="text-slate-400">No description available</span>
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Timeline" icon={Calendar}>
          <div className="p-4 space-y-3">
            <DateInfo icon={Calendar} label="Start Date" date={study.startDate} />
            <DateInfo icon={Calendar} label="Primary Completion" date={study.primaryCompletionDate} />
            <DateInfo icon={Calendar} label="Study Completion" date={study.completionDate} />
            <DateInfo icon={Calendar} label="First Posted" date={study.firstPostedDate} />
            <DateInfo icon={Calendar} label="Last Updated" date={study.lastUpdateDate} />
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default StudyDetails;