import React from 'react';
import { AlertOctagon, FileText, BookOpen, AlertCircle } from 'lucide-react';

const Section = ({ icon: Icon, title, content }) => (
  <div className="section">
    <div className="section-header">
      <div className="section-icon">
        <Icon size={16} className="text-gray-600" />
      </div>
      <h3 className="section-title">{title}</h3>
    </div>
    <p className="section-content">{content}</p>
  </div>
);

const Results = ({ results }) => {
  return (
    <div className="results-container">
      <h2 className="results-title">Study Results</h2>
      {!results || Object.keys(results).length === 0 ? (
        <div className="no-results">
          <AlertCircle size={20} className="text-gray-400" />
          <p className="text-sm text-gray-400 mt-2">No results available at this time.</p>
        </div>
      ) : (
        <div className="results-content">
          {results.adverseEvents && (
            <Section
              icon={AlertOctagon}
              title="Adverse Events"
              content={results.adverseEvents}
            />
          )}
          {results.studyResults && (
            <Section
              icon={FileText}
              title="Study Results"
              content={results.studyResults}
            />
          )}
          {results.publications && (
            <Section
              icon={BookOpen}
              title="Publications"
              content={results.publications}
            />
          )}
        </div>
      )}
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .results-container {
          margin: 16px 0;
        }

        .results-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          padding: 16px;
        }

        .results-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .section-content {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .results-container {
            margin: 12px 0;
          }

          .results-title {
            font-size: 16px;
          }

          .section-title {
            font-size: 12px;
          }

          .section-content {
            font-size: 11px;
          }

          .section-icon {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;