export const getRecommendations = async (assessmentData) => {
  const weights = {
    userCategory: 0.1,
    location: 0.15,
    specialty: 0.15,
    age: 0.05,
    gender: 0.05,
    medicalConditions: 0.1,
    interests: 0.1,
    experienceLevel: 0.05,
    studyPhase: 0.05,
    studyType: 0.05,
    trialStatus: 0.05,
    enrollmentSize: 0.03,
    sponsorType: 0.03,
    interventionType: 0.03,
    outcomeMeasures: 0.03,
    distanceWillingToTravel: 0.03,
    languagePreference: 0.03,
    accessibilityNeeds: 0.02,
    timeCommitment: 0.02,
  };

  const queryParams = new URLSearchParams({
    pageSize: '100',
    format: 'json',
  });

  if (assessmentData.medicalConditions) {
    queryParams.append('query.cond', encodeURIComponent(assessmentData.medicalConditions));
  }
  if (assessmentData.specialty) {
    queryParams.append('query.term', encodeURIComponent(assessmentData.specialty));
  }
  if (assessmentData.studyPhase) {
    queryParams.append('filter.phase', assessmentData.studyPhase.replace('PHASE_', ''));
  }
  if (assessmentData.studyType) {
    queryParams.append('filter.studyType', assessmentData.studyType.toUpperCase());
  }
  if (assessmentData.trialStatus) {
    queryParams.append('filter.overallStatus', assessmentData.trialStatus.toUpperCase());
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_CLINICAL_TRIALS_API}/studies?${queryParams.toString()}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    const trials = data.studies || [];

    const scoredTrials = trials.map((trial) => {
      let score = 0;

      // User Category
      if (assessmentData.userCategory) {
        const isRelevant = trial.protocolSection?.descriptionModule?.briefSummary?.toLowerCase().includes(
          assessmentData.userCategory.toLowerCase()
        );
        score += isRelevant ? weights.userCategory : 0;
      }

      // Location (simplified matching)
      if (assessmentData.location && trial.protocolSection?.contactsLocationsModule?.locations) {
        const locationMatch = trial.protocolSection.contactsLocationsModule.locations.some(
          (loc) => loc.city?.toLowerCase().includes(assessmentData.location.toLowerCase()) ||
                   loc.country?.toLowerCase().includes(assessmentData.location.toLowerCase())
        );
        score += locationMatch ? weights.location : 0;
      }

      // Specialty
      if (assessmentData.specialty && trial.protocolSection?.conditionsModule?.conditions) {
        const specialtyMatch = trial.protocolSection.conditionsModule.conditions.some(
          (cond) => cond.toLowerCase().includes(assessmentData.specialty.toLowerCase())
        );
        score += specialtyMatch ? weights.specialty : 0;
      }

      // Age
      if (assessmentData.age && trial.protocolSection?.eligibilityModule) {
        const minAge = parseInt(trial.protocolSection.eligibilityModule.minimumAge) || 0;
        const maxAge = parseInt(trial.protocolSection.eligibilityModule.maximumAge) || 120;
        const userAge = parseInt(assessmentData.age);
        score += (userAge >= minAge && userAge <= maxAge) ? weights.age : 0;
      }

      // Gender
      if (assessmentData.gender && trial.protocolSection?.eligibilityModule?.sex) {
        const genderMatch = trial.protocolSection.eligibilityModule.sex.toLowerCase() === assessmentData.gender.toLowerCase() ||
                            trial.protocolSection.eligibilityModule.sex.toLowerCase() === 'all';
        score += genderMatch ? weights.gender : 0;
      }

      // Medical Conditions
      if (assessmentData.medicalConditions && trial.protocolSection?.conditionsModule?.conditions) {
        const conditions = assessmentData.medicalConditions.split(',').map(c => c.trim().toLowerCase());
        const conditionMatch = trial.protocolSection.conditionsModule.conditions.some(
          (cond) => conditions.includes(cond.toLowerCase())
        );
        score += conditionMatch ? weights.medicalConditions : 0;
      }

      // Interests
      if (assessmentData.interests && trial.protocolSection?.descriptionModule?.briefSummary) {
        const interests = assessmentData.interests.split(',').map(i => i.trim().toLowerCase());
        const interestMatch = interests.some(
          (interest) => trial.protocolSection.descriptionModule.briefSummary.toLowerCase().includes(interest)
        );
        score += interestMatch ? weights.interests : 0;
      }

      // Experience Level
      if (assessmentData.experienceLevel) {
        const complexity = trial.protocolSection?.designModule?.studyType?.toLowerCase() === 'interventional' ? 'Intermediate' : 'Beginner';
        score += complexity === assessmentData.experienceLevel ? weights.experienceLevel : 0;
      }

      // Study Phase
      if (assessmentData.studyPhase && trial.protocolSection?.designModule?.phases) {
        score += trial.protocolSection.designModule.phases.includes(assessmentData.studyPhase) ? weights.studyPhase : 0;
      }

      // Study Type
      if (assessmentData.studyType && trial.protocolSection?.designModule?.studyType) {
        score += trial.protocolSection.designModule.studyType === assessmentData.studyType ? weights.studyType : 0;
      }

      // Trial Status
      if (assessmentData.trialStatus && trial.protocolSection?.statusModule?.overallStatus) {
        score += trial.protocolSection.statusModule.overallStatus === assessmentData.trialStatus ? weights.trialStatus : 0;
      }

      // Enrollment Size
      if (assessmentData.enrollmentSize && trial.protocolSection?.designModule?.enrollmentInfo?.count) {
        const sizeDiff = Math.abs(trial.protocolSection.designModule.enrollmentInfo.count - parseInt(assessmentData.enrollmentSize));
        score += sizeDiff < 100 ? weights.enrollmentSize : 0;
      }

      // Sponsor Type
      if (assessmentData.sponsorType && trial.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name) {
        const sponsor = trial.protocolSection.sponsorCollaboratorsModule.leadSponsor.name.toLowerCase();
        const sponsorMatch = (assessmentData.sponsorType.toLowerCase() === 'industry' && sponsor.includes('pharma')) ||
                             (assessmentData.sponsorType.toLowerCase() === 'academic' && sponsor.includes('university')) ||
                             (assessmentData.sponsorType.toLowerCase() === 'government' && sponsor.includes('gov'));
        score += sponsorMatch ? weights.sponsorType : 0;
      }

      // Intervention Type
      if (assessmentData.interventionType && trial.protocolSection?.armsInterventionsModule?.interventions) {
        const interventionMatch = trial.protocolSection.armsInterventionsModule.interventions.some(
          (int) => int.type?.toLowerCase().includes(assessmentData.interventionType.toLowerCase())
        );
        score += interventionMatch ? weights.interventionType : 0;
      }

      // Outcome Measures
      if (assessmentData.outcomeMeasures && trial.protocolSection?.outcomesModule?.primaryOutcomes) {
        const outcomes = assessmentData.outcomeMeasures.split(',').map(o => o.trim().toLowerCase());
        const outcomeMatch = trial.protocolSection.outcomesModule.primaryOutcomes.some(
          (out) => outcomes.includes(out.measure?.toLowerCase())
        );
        score += outcomeMatch ? weights.outcomeMeasures : 0;
      }

      // Distance Willing to Travel (simplified)
      if (assessmentData.distanceWillingToTravel) {
        score += parseInt(assessmentData.distanceWillingToTravel) > 100 ? weights.distanceWillingToTravel : 0;
      }

      // Language Preference
      if (assessmentData.languagePreference && trial.protocolSection?.descriptionModule?.briefSummary) {
        score += trial.protocolSection.descriptionModule.briefSummary.toLowerCase().includes(assessmentData.languagePreference.toLowerCase())
          ? weights.languagePreference : 0;
      }

      // Accessibility Needs
      if (assessmentData.accessibilityNeeds && trial.protocolSection?.eligibilityModule?.eligibilityCriteria) {
        score += trial.protocolSection.eligibilityModule.eligibilityCriteria.toLowerCase().includes(assessmentData.accessibilityNeeds.toLowerCase())
          ? weights.accessibilityNeeds : 0;
      }

      // Time Commitment
      if (assessmentData.timeCommitment && trial.protocolSection?.designModule?.studyType) {
        const isLowCommitment = trial.protocolSection.designModule.studyType.toLowerCase() === 'observational';
        score += isLowCommitment && parseInt(assessmentData.timeCommitment) < 10 ? weights.timeCommitment : 0;
      }

      return { trial, score };
    });

    return scoredTrials
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.trial);
  } catch (err) {
    throw new Error(`Recommendation error: ${err.message}`);
  }
};
