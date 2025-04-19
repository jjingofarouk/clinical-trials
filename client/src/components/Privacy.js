import { motion } from 'framer-motion';
import './Privacy.css';

const Privacy = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="privacy-container"
  >
    <h1 className="privacy-title">Privacy Policy</h1>
    <div className="privacy-content">
      <p className="privacy-text">
        At ClinSearch, your privacy is our top priority. This Privacy Policy explains how we collect, use, protect, and disclose your personal information to provide a seamless and secure experience while exploring clinical trial opportunities.
      </p>
      <div className="privacy-section">
        <h2 className="privacy-section-title">Data Collection</h2>
        <p className="privacy-section-text">
          We collect only the information necessary to deliver our services, such as your name, email, and preferences for trial participation. This data is gathered through forms you voluntarily submit, such as contact or inquiry forms.
        </p>
      </div>
      <div className="privacy-section">
        <h2 className="privacy-section-title">Data Usage</h2>
        <p className="privacy-section-text">
          Your information is used to personalize your experience, respond to inquiries, and connect you with relevant clinical trials. We may also use anonymized data to improve our platform’s functionality and user experience.
        </p>
      </div>
      <div className="privacy-section">
        <h2 className="privacy-section-title">Data Protection</h2>
        <p className="privacy-section-text">
          We employ industry-standard encryption and security protocols to safeguard your data. Your information is stored securely and is never shared with third parties without your explicit consent, except as required by law.
        </p>
      </div>
      <div className="privacy-section">
        <h2 className="privacy-section-title">Your Rights</h2>
        <p className="privacy-section-text">
          You have the right to access, update, or delete your personal information at any time. Contact us at{' '}
          <a href="mailto:support@clinsearch.com" className="privacy-link">
            support@clinsearch.com
          </a>{' '}
          to exercise these rights or for any privacy-related concerns.
        </p>
      </div>
    </div>
  </motion.div>
);

export default Privacy;