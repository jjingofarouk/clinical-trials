import React from 'react';

const Privacy = () => (
  <div className="max-w-4xl mx-auto p-4 my-3 bg-white rounded-2xl">
    <h1 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policy</h1>
    <p className="text-sm text-gray-600 leading-relaxed">
      At ClinSearch, we prioritize your privacy. This policy outlines how we collect, use, and protect your personal information. We only gather data necessary to provide our services, such as contact details for inquiries or trial participation. All data is securely stored and never shared with third parties without your consent, except as required by law.
    </p>
    <style jsx>{`
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      @media (max-width: 640px) {
        .rounded-2xl {
          border-radius: 12px;
        }

        .p-4 {
          padding: 12px;
        }

        .my-3 {
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .text-lg {
          font-size: 16px;
        }

        .text-sm {
          font-size: 12px;
        }

        .mb-4 {
          margin-bottom: 12px;
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
      }
    `}</style>
  </div>
);

export default Privacy;