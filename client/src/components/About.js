/* About Component */
import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto p-6 my-4 bg-white rounded-2xl shadow-sm"
  >
    <h1 className="text-2xl font-semibold text-[#1A4A4F] mb-6">About ClinSearch</h1>
    <div className="space-y-6">
      <p className="text-sm text-[#374151] leading-relaxed">
        ClinSearch is a pioneering platform dedicated to transforming medical research by seamlessly connecting patients, researchers, and healthcare providers with clinical trial opportunities worldwide. Our vision is to democratize access to cutting-edge medical advancements, empowering individuals to take control of their health through informed decisions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#1A4A4F] rounded-xl">
          <h2 className="text-base font-semibold text-[#FFFFFF] mb-2">Our Mission</h2>
          <p className="text-xs text-[#FFFFFF]">
            To provide transparent, accessible, and up-to-date information about clinical studies, fostering trust and collaboration in the global medical community.
          </p>
        </div>
        <div className="p-4 bg-[#1A4A4F] rounded-xl">
          <h2 className="text-base font-semibold text-[#FFFFFF] mb-2">Our Impact</h2>
          <p className="text-xs text-[#FFFFFF]">
            Since our inception, ClinSearch has facilitated thousands of connections, helping advance medical research and improve patient outcomes across diverse populations.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-base font-semibold text-[#1A4A4F] mb-3">Our Team</h2>
        <p className="text-xs text-[#374151]">
          Led by a passionate group of innovators, including our founder{' '}
          <a
            href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D6A6F] underline hover:text-[#1A4A4F]"
          >
            Farouk Jjingo
          </a>
          , ClinSearch combines expertise in technology and healthcare to drive meaningful change.
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

        .gap-4 {
          gap: 8px;
        }

        .p-4 {
          padding: 12px;
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

export default About;