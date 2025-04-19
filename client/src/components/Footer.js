import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, MessageSquare } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#000000] py-6">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
      <p className="text-sm text-white/90">© 2025 ClinSearch. All rights reserved.</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ul className="flex gap-6">
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/about"
              aria-label="About ClinSearch"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              About
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/contact"
              aria-label="Contact Us"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Contact
            </a>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/privacy"
              aria-label="Privacy Policy"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Privacy
            </a>
          </motion.li>
        </ul>
        <div className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
            aria-label="LinkedIn Profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={18} className="text-white/90 hover:text-white" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://x.com/farouq_jjingo"
            aria-label="X Profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={18} className="text-white/90 hover:text-white" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            href="https://wa.me/+256751360385"
            aria-label="WhatsApp Contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare size={18} className="text-white/90 hover:text-white" />
          </motion.a>
        </div>
      </div>
    </div>
    <style jsx>{`
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      @media (max-width: 640px) {
        .py-6 {
          padding-top: 16px;
          padding-bottom: 16px;
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

        .flex {
          flex-direction: column;
          align-items: center;
        }
      }

      @media (min-width: 641px) and (max-width: 1023px) {
        .gap-6 {
          gap: 20px;
        }

        .py-6 {
          padding-top: 20px;
          padding-bottom: 20px;
        }
      }
    `}</style>
  </footer>
);

export default Footer;