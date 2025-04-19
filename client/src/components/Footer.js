import React from 'react';

const Footer = () => (
  <footer className="bg-[#000000] py-4">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-white/90">© 2025 ClinSearch</p>
      <ul className="flex gap-6">
        <li>
          <a
            href="/about"
            aria-label="About ClinSearch"
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="/contact"
            aria-label="Contact Us"
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            Contact
          </a>
        </li>
        <li>
          <a
            href="/privacy"
            aria-label="Privacy Policy"
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            Privacy
          </a>
        </li>
      </ul>
    </div>
    <style jsx>{`
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      @media (max-width: 640px) {
        .py-4 {
          padding-top: 12px;
          padding-bottom: 12px;
        }

        .px-4 {
          padding-left: 12px;
          padding-right: 12px;
        }

        .text-sm {
          font-size: 12px;
        }

        .gap-6 {
          gap: 16px;
        }

        .gap-4 {
          gap: 12px;
        }

        .max-w-7xl {
          margin-left: 12px;
          margin-right: 12px;
        }
      }

      @media (min-width: 641px) and (max-width: 1023px) {
        .gap-6 {
          gap: 20px;
        }
      }
    `}</style>
  </footer>
);

export default Footer;