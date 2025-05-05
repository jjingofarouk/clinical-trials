import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserAssessmentForm = ({ setAssessmentData }) => {
  const [formData, setFormData] = useState({
    userCategory: '',
    location: '',
    specialty: '',
    age: '',
    gender: '',
    medicalConditions: '',
    interests: '',
    experienceLevel: '',
    studyPhase: '',
    studyType: '',
    trialStatus: '',
    enrollmentSize: '',
    sponsorType: '',
    interventionType: '',
    outcomeMeasures: '',
    distanceWillingToTravel: '',
    languagePreference: '',
    accessibilityNeeds: '',
    timeCommitment: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAssessmentData(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="userCategory">User Category</label>
          <select name="userCategory" value={formData.userCategory} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Researcher">Researcher</option>
            <option value="Medical Student">Medical Student</option>
            <option value="Clinician">Clinician</option>
            <option value="Patient">Patient</option>
            <option value="Nurse">Nurse</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Public Health Professional">Public Health Professional</option>
            <option value="Biotech Professional">Biotech Professional</option>
            <option value="General User">General User</option>
          </select>
        </div>
        <div>
          <label htmlFor="location">Location (City, Country)</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="specialty">Specialty (e.g., Oncology, Cardiology)</label>
          <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} min="0" />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="medicalConditions">Medical Conditions (comma-separated)</label>
          <input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="interests">Research Interests (comma-separated)</label>
          <input type="text" name="interests" value={formData.interests} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="experienceLevel">Experience Level</label>
          <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div>
          <label htmlFor="studyPhase">Preferred Study Phase</label>
          <select name="studyPhase" value={formData.studyPhase} onChange={handleChange}>
            <option value="">Any</option>
            <option value="PHASE_1">Phase 1</option>
            <option value="PHASE_2">Phase 2</option>
            <option value="PHASE_3">Phase 3</option>
            <option value="PHASE_4">Phase 4</option>
          </select>
        </div>
        <div>
          <label htmlFor="studyType">Study Type</label>
          <select name="studyType" value={formData.studyType} onChange={handleChange}>
            <option value="">Any</option>
            <option value="INTERVENTIONAL">Interventional</option>
            <option value="OBSERVATIONAL">Observational</option>
          </select>
        </div>
        <div>
          <label htmlFor="trialStatus">Trial Status</label>
          <select name="trialStatus" value={formData.trialStatus} onChange={handleChange}>
            <option value="">Any</option>
            <option value="RECRUITING">Recruiting</option>
            <option value="ACTIVE_NOT_RECRUITING">Active, Not Recruiting</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="enrollmentSize">Preferred Enrollment Size</label>
          <input type="number" name="enrollmentSize" value={formData.enrollmentSize} onChange={handleChange} min="0" />
        </div>
        <div>
          <label htmlFor="sponsorType">Sponsor Type</label>
          <select name="sponsorType" value={formData.sponsorType} onChange={handleChange}>
            <option value="">Any</option>
            <option value="INDUSTRY">Industry</option>
            <option value="ACADEMIC">Academic</option>
            <option value="GOVERNMENT">Government</option>
          </select>
        </div>
        <div>
          <label htmlFor="interventionType">Intervention Type</label>
          <input type="text" name="interventionType" value={formData.interventionType} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="outcomeMeasures">Outcome Measures (comma-separated)</label>
          <input type="text" name="outcomeMeasures" value={formData.outcomeMeasures} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="distanceWillingToTravel">Distance Willing to Travel (km)</label>
          <input type="number" name="distanceWillingToTravel" value={formData.distanceWillingToTravel} onChange={handleChange} min="0" />
        </div>
        <div>
          <label htmlFor="languagePreference">Language Preference</label>
          <input type="text" name="languagePreference" value={formData.languagePreference} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="accessibilityNeeds">Accessibility Needs</label>
          <input type="text" name="accessibilityNeeds" value={formData.accessibilityNeeds} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="timeCommitment">Max Time Commitment (hours/week)</label>
          <input type="number" name="timeCommitment" value={formData.timeCommitment} onChange={handleChange} min="0" />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#FF8C00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Get Recommendations
        </button>
      </form>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
      `}</style>
    </motion.div>
  );
};

export default UserAssessmentForm;