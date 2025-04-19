import React from 'react';

const About = () => (
  <div className="max-w-4xl mx-auto p-4 my-3 bg-white rounded-2xl">
    <h1 className="text-lg font-semibold text-gray-900 mb-4">About ClinSearch</h1>
    <p className="text-sm text-gray-600 leading-relaxed">
      ClinSearch is dedicated to advancing medical research by connecting patients, researchers, and healthcare providers with clinical trial opportunities. Our mission is to provide accessible, transparent, and up-to-date information about clinical studies worldwide, empowering individuals to make informed decisions about their health.
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

export default About;