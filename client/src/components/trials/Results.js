import React, { useState, useEffect } from 'react';
import { AlertOctagon, FileText, BookOpen, Clipboard, AlertCircle, ChevronDown } from 'lucide-react';

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

const ResultSection = ({ label, content, icon: Icon, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${!isLast ? 'mb-4' : ''}`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Icon size={20} className="text-blue-600" />
            </div>
            <span className="flex-1 text-base font-semibold text-blue-900">
              {label}
            </span>
            <ChevronDown 
              size={20} 
              className={`text-blue-600 transform transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </div>
          
          {expanded && (
            <div className="pt-4 bg-white">
              <p className="text-[15px] leading-6 text-slate-700">
                {content}
              </p>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

const Results = ({ results }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerClasses = `
    transform transition-all duration-500 ease-out
    ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
    my-4
  `;

  if (!results || Object.keys(results).length === 0) {
    return (
      <Card className={containerClasses}>
        <CardHeader icon={Clipboard} title="Study Results" />
        <div className="flex flex-col items-center py-8">
          <AlertCircle size={24} className="text-slate-400" />
          <p className="text-base text-slate-400 mt-2">
            No results available at this time.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={containerClasses}>
      <CardHeader icon={Clipboard} title="Study Results" />
      
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
            isLast={true}
          />
        )}
      </div>
    </Card>
  );
};

export default Results;