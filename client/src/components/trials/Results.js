import React, { useState, useEffect } from 'react';
import { AlertOctagon, FileText, BookOpen, Clipboard, AlertCircle, ChevronDown } from 'lucide-react';

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

const ResultSection = ({ label, content, icon: Icon, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden ${isLast ? '' : 'mb-3'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="bg-white p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <Icon size={16} className="text-gray-600" />
          </div>
          <span className="flex-1 text-sm font-semibold text-gray-900">{label}</span>
          <ChevronDown
            size={16}
            className={`text-gray-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
        {expanded && (
          <div className="p-3 pt-2 bg-white">
            <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
          </div>
        )}
      </button>
    </div>
  );
};

const Results = ({ results }) => {
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
      <CardHeader icon={Clipboard} title="Study Results" />
      {!results || Object.keys(results).length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <AlertCircle size={20} className="text-gray-400" />
          <p className="text-sm text-gray-400 mt-2">No results available at this time.</p>
        </div>
      ) : (
        <div className="p-4">
          {results.adverseEvents && (
            <ResultSection
              label="Adverse Events"
              content={results.adverseEvents}
              icon={AlertOctagon}
              isLast={!results.studyResults && !results.publications}
            />
          )}
          {results.studyResults && (
            <ResultSection
              label="Study Results"
              content={results.studyResults}
              icon={FileText}
              isLast={!results.publications}
            />
          )}
          {results.publications && (
            <ResultSection
              label="Publications"
              content={results.publications}
              icon={BookOpen}
              isLast
            />
          )}
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

          .mb-3 {
            margin-bottom: 8px;
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

export default Results;