import React from 'react';
import { Github, Linkedin, X, MessageSquare, ChevronRight, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* NoScript Warning */}
      <noscript>
        <div className="bg-red-900 text-white p-4 text-center">
          <p className="mb-2">
            JavaScript is disabled in your browser. Please enable JavaScript or switch to a supported browser to continue using Dwaliro.
          </p>
          <p className="text-sm">Some privacy extensions may cause issues. Try disabling them and refreshing.</p>
        </div>
      </noscript>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Company & Mission */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Dwaliro</h2>
            <p className="text-gray-400 mb-6">
              Empowering healthcare professionals with innovative digital tools for better patient care.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/faroukj" 
                 className="text-gray-400 hover:text-white transition-colors duration-300"
                 aria-label="GitHub Profile" 
                 title="Visit our GitHub"
                 target="_blank" 
                 rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/farouk-jjingo-0341b01a5" 
                 className="text-gray-400 hover:text-white transition-colors duration-300"
                 aria-label="LinkedIn Profile" 
                 title="Visit our LinkedIn"
                 target="_blank" 
                 rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="https://x.com/farouq_jjingo" 
                 className="text-gray-400 hover:text-white transition-colors duration-300"
                 aria-label="X Profile" 
                 title="Visit our X profile"
                 target="_blank" 
                 rel="noopener noreferrer">
                <X size={20} />
              </a>
              <a href="https://wa.me/+256751360385" 
                 className="text-gray-400 hover:text-white transition-colors duration-300"
                 aria-label="WhatsApp Contact" 
                 title="Contact us on WhatsApp"
                 target="_blank" 
                 rel="noopener noreferrer">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Our Projects</h3>
            <ul className="space-y-3">
              <li className="group">
                <a href="/projects/clinical-calculators" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">Clinical Calculators</span>
                </a>
              </li>
              <li className="group">
                <a href="/projects/drug-interaction-checker" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">Drug Interaction Checker</span>
                </a>
              </li>
              <li className="group">
                <a href="/projects/history-taking-app" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">History Taking App</span>
                </a>
              </li>
              <li className="group">
                <a href="/projects" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">Explore All Projects</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li className="group">
                <a href="/about" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">About Us</span>
                </a>
              </li>
              <li className="group">
                <a href="/contact" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">Contact</span>
                </a>
              </li>
              <li className="group">
                <a href="/privacy" 
                   className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  <span className="ml-1 group-hover:ml-2 transition-all duration-300">Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Dwaliro. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> in Uganda
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

