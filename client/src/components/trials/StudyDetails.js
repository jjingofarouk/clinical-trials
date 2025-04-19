import React, { useState } from 'react';
import { ChevronUp, ChevronDown, AlertCircle, Info, FileText, Calendar, Activity, Layers, UserPlus, Clock, CheckCircle, CheckSquare, XCircle, MinusCircle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Recruiting': { icon: UserPlus },
      'Not Yet Recruiting': { icon: Clock },
      'Active, not recruiting': { icon: CheckCircle },
      'Completed': { icon: CheckSquare },
      'Terminated': { icon: XCircle },
      'Withdrawn': { icon: MinusCircle },
      'Unknown': { icon: HelpCircle },
    };
    return configs[status] || configs['Unknown'];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/10">
      <Icon size={14} className="text-white mr-1" />
      <span className="text-xs font-medium text-white">{status}</span>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex-1 bg-white rounded-xl p-3 text-center border border-gray-100">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
      <Icon size={16} className="text-gray-600" />
    </div>
    <div className="text-xs text-gray-900 mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-900">{value || 'Not specified'}</div>
  </div>
);

const DateInfo = ({ icon: Icon, label, date }) => (
  <div className="flex items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center mr-2">
      <Icon size={14} className="text-gray-600" />
    </div>
    <span className="text-xs text-gray-900 flex-1">{label}</span>
    <span className="text-xs font-medium text-gray-900">{date || 'Not specified'}</span>
  </div>
);

const AccordionSection = ({ title, icon: Icon, children, initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div className="bg-white rounded-xl mb-2 overflow-hidden border border-gray-100">
      <button
        className="w-full flex items-center justify-between p-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon size={16} className="text-gray-600" />
          </div>
          <span className="ml-2 text-sm font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
};

const StudyDetails = ({ study }) => {
  return (
    <div
      className="bg-white rounded-2xl my-3 overflow-hidden max-w-4xl mx-auto"
    >
      {!study ? (
        <div className="p-6 text-center">
          <AlertCircle size={24} className="text-gray-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">No study details available</div>
        </div>
      ) : (
        <>
          <div className="bg-[#000000] p-4 space-y-3">
            <h1 className="text-lg font-semibold text-white leading-tight">{study.title}</h1>
            <StatusBadge status={study.status} />
          </div>
          <div className="p-4">
            <AccordionSection title="Overview" icon={Info} initiallyExpanded>
              <div className="flex gap-3">
                <InfoCard icon={Activity} label="Study Type" value={study.type} />
                <InfoCard icon={Layers} label="Phase" value={study.phase} />
              </div>
            </AccordionSection>
            <AccordionSection title="Description" icon={FileText}>
              {study.description ? (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 leading-relaxed">{study.description}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-xs text-gray-400">No description available</span>
                </div>
              )}
            </AccordionSection>
            <AccordionSection title="Timeline" icon={Calendar}>
              <div className="space-y-2">
                <DateInfo icon={Calendar} label="Start Date" date={study.startDate} />
                <DateInfo icon={Calendar} label="Primary Completion" date={study.primaryCompletionDate} />
                <DateInfo icon={Calendar} label="Study Completion" date={study.completionDate} />
                <DateInfo icon={Calendar} label="First Posted" date={study.firstPostedDate} />
                <DateInfo icon={Calendar} label="Last Updated" date={study.lastUpdateDate} />
              </div>
            </AccordionSection>
          </div>
        </>
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

          .p-4 {
            padding: 12px;
          }

          .p-6 {
            padding: 16px;
          }

          .space-y-3 {
            gap: 8px;
          }

          .flex {
            flex-direction: column;
          }

          .gap-3 {
            gap: 8px;
          }

          .p-3 {
            padding: 8px;
          }

          .text-lg {
            font-size: 16px;
          }

          .text-sm {
            font-size: 12px;
          }

          .text-xs {
            font-size: 11px;
          }

          .w-8 {
            width: 28px;
          }

          .h-8 {
            height: 28px;
          }

          .w-7 {
            width: 24px;
          }

          .h-7 {
            height: 24px;
          }

          .space-y-2 {
            gap: 6px;
          }

          .rounded-xl {
            border-radius: 10px;
          }

          .mb-2 {
            margin-bottom: 6px;
          }

          .max-w-4xl {
            margin-left: 12px;
            margin-right: 12px;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .rounded-2xl {
            border-radius: 14px;
          }

          .flex {
            flex-direction: row;
          }

          .p-3 {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudyDetails;