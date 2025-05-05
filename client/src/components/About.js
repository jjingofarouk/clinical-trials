import React from 'react';
import { motion } from 'framer-motion';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="max-w-6xl mx-auto p-10 my-8 bg-beige rounded-3xl shadow-xl relative overflow-hidden"
  >
    {/* Subtle background texture */}
    <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />

    <h1 className="text-4xl font-bold text-teal mb-10">About Dwaliro</h1>
    <div className="space-y-10">
      {/* Introduction */}
      <p className="text-lg text-gray-800 leading-relaxed max-w-3xl">
        Dwaliro is redefining medical research by connecting patients, researchers, and healthcare providers with global clinical trial opportunities. Our vision is to democratize access to groundbreaking medical advancements, empowering individuals to shape their health journey.
      </p>

      {/* Mission and Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="p-6 bg-gradient-to-br from-teal to-teal-dark rounded-2xl shadow-md"
          whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(13, 148, 136, 0.2)' }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-sm text-white/90">
            To provide transparent, accessible, and real-time information about clinical studies, fostering trust and collaboration in the global medical community.
          </p>
        </motion.div>
        <motion.div
          className="p-6 bg-gradient-to-br from-teal to-teal-dark rounded-2xl shadow-md"
          whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(13, 148, 136, 0.2)' }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Our Impact</h2>
          <p className="text-sm text-white/90">
            Since launching, Dwaliro has powered thousands of connections, advancing medical research and enhancing patient outcomes worldwide.
          </p>
        </motion.div>
      </div>

      {/* Our Team */}
      <div>
        <h2 className="text-xl font-semibold text-teal mb-5">Our Team</h2>
        <p className="text-base text-gray-800 max-w-3xl">
          Led by a dynamic group of innovators, including our founder{' '}
          <a
            href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal underline hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal"
            aria-label="Farouk Jjingo's LinkedIn profile"
          >
            Farouk Jjingo
          </a>
          , Dwaliro merges technology and healthcare expertise to drive transformative change.
        </p>
      </div>

      {/* Connect with Farouk */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-teal mb-8">Meet Our Founder</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Founder Image */}
          <motion.div
            className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg border-4 border-teal/20"
            whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(13, 148, 136, 0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/farouk.png" // Replace with actual image path
              alt="Farouk Jjingo, Founder of Dwaliro"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Founder Info */}
          <div className="flex-1">
            <p className="text-base text-gray-800 mb-6">
              Farouk Jjingo, a Full Stack Developer and former medical officer, combines clinical insight with technical expertise to lead Dwaliro’s mission of solving critical healthcare challenges.
            </p>
            <ul className="text-base text-teal space-y-4">
              <li>
                <a
                  href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal transition-colors duration-200"
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
                  className="underline hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal transition-colors duration-200"
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
                  className="underline hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal transition-colors duration-200"
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
        --teal: #0d9488;
        --teal-dark: #0b8276;
        --beige: #f5f3e7;
        --gray: #2d3748;
      }

      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      h1,
      h2 {
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .max-w-6xl {
        max-width: 90rem;
      }

      .bg-beige {
        background-color: var(--beige);
      }

      .text-teal {
        color: var(--teal);
      }

      .text-teal-dark {
        color: var(--teal-dark);
      }

      .text-gray-800 {
        color: var(--gray);
      }

      .rounded-3xl {
        border-radius: 1.75rem;
      }

      .rounded-2xl {
        border-radius: 1rem;
      }

      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }

      .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
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

      /* Grain texture for background */
      .bg-grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      /* Mobile Styles */
      @media (max-width: 640px) {
        .max-w-6xl {
          margin-left: 1.25rem;
          margin-right: 1.25rem;
        }

        .p-10 {
          padding: 2rem;
        }

        .my-8 {
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .text-4xl {
          font-size: 1.75rem;
          line-height: 2rem;
        }

        .text-xl {
          font-size: 1.125rem;
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

        .gap-8 {
          gap: 1.5rem;
        }

        .space-y-10 {
          gap: 2rem;
        }

        .w-48 {
          width: 10rem;
          height: 10rem;
        }
      }

      /* Tablet Styles */
      @media (min-width: 641px) and (max-width: 1023px) {
        .p-10 {
          padding: 2.5rem;
        }

        .rounded-3xl {
          border-radius: 1.5rem;
        }

        .w-56 {
          width: 12rem;
          height: 12rem;
        }
      }
    `}</style>
  </motion.div>
);

export default About;