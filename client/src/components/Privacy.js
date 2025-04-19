import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto p-6 my-4 bg-white rounded-2xl shadow-sm"
  >
    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Privacy Policy</h1>
    <div className="space-y-6">
      <p className="text-sm text-gray-600 leading-relaxed">
        At ClinSearch, your privacy is our top priority. This Privacy Policy explains how we collect, use, protect, and disclose your personal information to provide a seamless and secure experience while exploring clinical trial opportunities.
      </p>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Data Collection</h2>
        <p className="text-xs text-gray-600">
          We collect only the information necessary to deliver our services, such as your name, email, and preferences for trial participation. This data is gathered through forms you voluntarily submit, such as contact or inquiry forms.
        </p>
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Data Usage</h2>
        <p className="text-xs text-gray-600">
          Your information is used to personalize your experience, respond to inquiries, and connect you with relevant clinical trials. We may also use anonymized data to improve our platform’s functionality and user experience.
        </p>
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Data Protection</h2>
        <p className="text-xs text-gray-600">
          We employ industry-standard encryption and security protocols to safeguard your data. Your information is stored securely and is never shared with third parties without your explicit consent, except as required by law.
        </p>
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Your Rights</h2>
        <p className="text-xs text-gray-600">
          You have the right to access, update, or delete your personal information at any time. Contact us at{' '}
          <a href="mailto:support@clinsearch.com" className="text-gray-900 underline hover:text-gray-700">
            support@clinsearch.com
          </a>{' '}
          to exercise these rights or for any privacy-related concerns.
        </p>
      </div>
    </div>
    <style jsx>{`
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      @media (max-width: 640px) {
        .max-w-4xl {
          margin-left: 12px;
          margin-right: 12px;
        }

        .p-6 {
          padding: 16px;
        }

        .my-4 {
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .rounded-2xl {
          border-radius: 12px;
        }

        .text-2xl {
          font-size: 1.5rem;
        }

        .text-base {
          font-size: 14px;
        }

        .text-sm {
          font-size: 12px;
        }

        .text-xs {
          font-size: 11px;
        }

        .mb-6 {
          margin-bottom: 16px;
        }

        .mb-3 {
          margin-bottom: 12px;
        }

        .space-y-6 {
          gap: 16px;
        }
      }

      @media (min-width: 641px) and (max-width: 1023px) {
        .rounded-2xl {
          border-radius: 14px;
        }

        .p-6 {
          padding: 20px;
        }
      }
    `}</style>
  </motion.div>
);

export default Privacy;