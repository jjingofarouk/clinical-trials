import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="max-w-5xl mx-auto p-8 my-6 bg-white rounded-3xl shadow-lg"
  >
    <h1 className="text-3xl font-bold text-primary mb-8">About Dwaliro</h1>
    <div className="space-y-8">
      {/* Introduction */}
      <p className="text-base text-gray-700 leading-relaxed">
        Dwaliro is a platform that aims to improve medical research by connecting patients, researchers, and healthcare providers with global clinical trial opportunities. Our mission is to make cutting-edge medical advancements accessible, so as to empower individuals to shape their health through informed choices.
      </p>

      {/* Mission and Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="p-6 bg-primary rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-white mb-3">Our Mission</h2>
          <p className="text-sm text-white">
            To deliver transparent, accessible, and up-to-date clinical study information that strengthens trust and collaboration in the global medical community.
          </p>
        </motion.div>
        <motion.div
          className="p-6 bg-primary rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-white mb-3">Our Impact</h2>
          <p className="text-sm text-white">
            Since our launch, Dwaliro has enabled thousands of connections that have advanced medical research and improved patient outcomes across diverse populations.
          </p>
        </motion.div>
      </div>

      {/* Our Team */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Our Team</h2>
        <p className="text-sm text-gray-700">
          Driven by a team of innovators, Dwaliro is led by our founder{' '}
          <a
            href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Farouk Jjingo's LinkedIn profile"
          >
            Farouk Jjingo
          </a>
          , blending expertise in technology and healthcare to create lasting impact.
        </p>
      </div>

      {/* Connect with Farouk */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-primary mb-6">Meet Our Founder</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Founder Image */}
          <motion.div
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/path-to-founder-image.jpg" // Replace with actual image path
              alt="Farouk Jjingo, Founder of Dwaliro"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Founder Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-4">
              Farouk Jjingo, a Full Stack Developer and former medical officer, brings a unique blend of clinical expertise and technical prowess to Dwaliro. His passion for solving healthcare challenges drives our mission forward.
            </p>
            <ul className="text-sm text-accent space-y-3">
              <li>
                <a
                  href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Farouk Jjingo's LinkedIn profile"
                >
                  LinkedIn: Farouk Jjingo
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/256751360385"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Contact Farouk Jjingo via WhatsApp"
                >
                  WhatsApp: +256751360385
                </a>
              </li>
              <li>
                <a
                  href="https://jjingofarouk.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Farouk Jjingo's personal website"
                >
                  Website: jjingofarouk.xyz
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      :root {
        --primary: #1A4A4F;
        --accent: #2D6A6F;
        --gray: #374151;
      }

      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .max-w-5xl {
        max-width: 80rem;
      }

      .rounded-3xl {
        border-radius: 1.5rem;
      }

      .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }

      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }

      .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
      }

      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      /* Mobile Styles */
      @media (max-width: 640px) {
        .max-w-5xl {
          margin-left: 1rem;
          margin-right: 1rem;
        }

        .p-8 {
          padding: 1.5rem;
        }

        .my-6 {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .text-3xl {
          font-size: 1.5rem;
        }

        .text-lg {
          font-size: 1rem;
        }

        .text-base {
          font-size: 0.875rem;
        }

        .text-sm {
          font-size: 0.75rem;
        }

        .gap-6 {
          gap: 1rem;
        }

        .space-y-8 {
          gap: 1.5rem;
        }
      }

      /* Tablet Styles */
      @media (min-width: 641px) and (max-width: 1023px) {
        .p-8 {
          padding: 2rem;
        }

        .rounded-3xl {
          border-radius: 1.25rem;
        }
      }
    `}</style>
  </motion.div>
);

export default About;