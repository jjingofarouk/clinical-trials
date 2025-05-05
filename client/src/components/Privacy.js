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
        This Privacy Policy ("Policy") outlines the practices of Dwaliro ("we," "us," or "our") regarding the collection, use, protection, and disclosure of personal and non-personal information when you access or use the Dwaliro platform ("Service"). By accessing or using our Service, you agree to the terms and conditions set forth in this Policy. If you do not agree with the practices described herein, you should not use the Service.
      </p>

      {/* 1. Introduction */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">1. Introduction</h2>
        <p className="privacy-section-text">
          Dwaliro is committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This Policy explains how we collect, use, disclose, and safeguard the information you provide to us or that we collect automatically when you interact with our Service. Our data practices comply with applicable data protection laws and regulations, including but not limited to the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other relevant privacy laws.
        </p>
      </div>

      {/* 2. Information We Collect */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">2. Information We Collect</h2>
        <p className="privacy-section-text">
          We collect the following types of information to provide, improve, and personalize your experience with our Service:
        </p>
        <ul className="privacy-section-text">
          <li><strong>Personally Identifiable Information (PII):</strong> Such as your full name, email address, phone number, age, gender, professional background, location, and any other information you voluntarily submit through forms or account registration.</li>
          <li><strong>Health and Research Preferences:</strong> Any health-related interests, medical conditions, or clinical trial preferences you voluntarily disclose to help match you with suitable trials.</li>
          <li><strong>Usage Data:</strong> Such as your browser type, IP address, pages visited, time spent on pages, and device type, collected automatically through cookies and similar technologies.</li>
          <li><strong>Communication Data:</strong> Information you submit when contacting our support team, participating in surveys, or submitting feedback.</li>
        </ul>
      </div>

      {/* 3. How We Use Your Information */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">3. How We Use Your Information</h2>
        <p className="privacy-section-text">
          We may use the information we collect for the following purposes:
        </p>
        <ul className="privacy-section-text">
          <li>To provide and manage access to the Service.</li>
          <li>To match you with relevant clinical trials based on your preferences and profile.</li>
          <li>To personalize your user experience.</li>
          <li>To respond to inquiries, support requests, and feedback.</li>
          <li>To send important updates and notifications related to the Service.</li>
          <li>To analyze trends, usage patterns, and preferences to improve the Service.</li>
          <li>To comply with legal obligations, protect our legal rights, and enforce our Terms of Service.</li>
        </ul>
      </div>

      {/* 4. Legal Basis for Processing */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">4. Legal Basis for Processing</h2>
        <p className="privacy-section-text">
          We process your personal data under one or more of the following legal bases:
        </p>
        <ul className="privacy-section-text">
          <li>With your consent, which you may withdraw at any time.</li>
          <li>For the performance of a contract to which you are a party.</li>
          <li>To comply with a legal obligation.</li>
          <li>For our legitimate interests, provided those interests are not overridden by your rights and freedoms.</li>
        </ul>
      </div>

      {/* 5. Sharing and Disclosure */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">5. Sharing and Disclosure of Information</h2>
        <p className="privacy-section-text">
          We do not sell, rent, or trade your personal data. However, we may share your data with third parties under the following circumstances:
        </p>
        <ul className="privacy-section-text">
          <li>With clinical trial partners, researchers, or institutions for the purpose of matching you with relevant opportunities — only with your explicit consent.</li>
          <li>With service providers who perform services on our behalf, such as hosting, analytics, and email communication services.</li>
          <li>As required by law, such as to comply with a subpoena or other legal process.</li>
          <li>To protect our rights, safety, and property, or that of others.</li>
        </ul>
      </div>

      {/* 6. Data Security */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">6. Data Security</h2>
        <p className="privacy-section-text">
          We implement appropriate administrative, technical, and physical safeguards to protect your information against unauthorized access, alteration, disclosure, or destruction. These include, but are not limited to, secure servers, encrypted communications (e.g., HTTPS), limited access protocols, and periodic security assessments. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet or electronic storage is 100% secure.
        </p>
      </div>

      {/* 7. Data Retention */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">7. Data Retention</h2>
        <p className="privacy-section-text">
          We retain your personal data only for as long as is necessary for the purposes set out in this Policy, or as required to comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer required, we will securely delete or anonymize it.
        </p>
      </div>

      {/* 8. Your Rights */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">8. Your Rights</h2>
        <p className="privacy-section-text">
          You have the following rights regarding your personal information:
        </p>
        <ul className="privacy-section-text">
          <li>The right to access the information we hold about you.</li>
          <li>The right to request corrections or updates to your information.</li>
          <li>The right to request the deletion of your personal data.</li>
          <li>The right to restrict or object to certain types of processing.</li>
          <li>The right to withdraw consent at any time, where processing is based on consent.</li>
          <li>The right to data portability (where applicable).</li>
        </ul>
        <p className="privacy-section-text">
          To exercise these rights, please contact us at{' '}
          <a href="mailto:support@dwaliro.com" className="privacy-link">
            support@dwaliro.com
          </a>.
        </p>
      </div>

      {/* 9. International Data Transfers */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">9. International Data Transfers</h2>
        <p className="privacy-section-text">
          If you are accessing the Service from outside the country in which our servers are located, your data may be transferred to, stored, and processed in a country with different data protection laws. In such cases, we will take all necessary steps to ensure your data is protected according to applicable legal standards.
        </p>
      </div>

      {/* 10. Cookies and Tracking Technologies */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">10. Cookies and Tracking Technologies</h2>
        <p className="privacy-section-text">
          We use cookies, beacons, and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can manage your cookie preferences through your browser settings. By continuing to use our Service, you consent to our use of cookies.
        </p>
      </div>

      {/* 11. Children's Privacy */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">11. Children’s Privacy</h2>
        <p className="privacy-section-text">
          Our Service is not intended for children under the age of 13 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will delete it immediately.
        </p>
      </div>

      {/* 12. Changes to This Policy */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">12. Changes to This Privacy Policy</h2>
        <p className="privacy-section-text">
          We reserve the right to modify this Privacy Policy at any time. Changes will become effective when posted on this page. We encourage you to review this Policy periodically to stay informed about how we protect your data.
        </p>
      </div>

      {/* 13. Contact Information */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">13. Contact Us</h2>
        <p className="privacy-section-text">
          If you have any questions or concerns regarding this Privacy Policy, our data practices, or your dealings with our Service, please contact us at:
        </p>
        <p className="privacy-section-text">
          Dwaliro Support Team<br />
          Email: <a href="mailto:support@dwaliro.com" className="privacy-link">support@dwaliro.com</a>
        </p>
      </div>
    </div>
  </motion.div>
);

export default Privacy;