import TrialListItem from './TrialListItem';

const TrialsSection = ({ title, trials, savedTrials, saveTrial, loading }) => (
  <section className="trials-section">
    <h2 className="section-title">{title}</h2>
    {loading ? (
      <div className="loading-spinner" aria-live="polite">
        <div className="spinner" />
        Loading trials...
      </div>
    ) : trials.length > 0 ? (
      <div className="trials-list">
        {trials.map((trial) => (
          <TrialListItem
            key={trial.protocolSection?.identificationModule?.nctId}
            trial={trial}
            isSaved={savedTrials.some(
              (saved) => saved.protocolSection?.identificationModule?.nctId === trial.protocolSection?.identificationModule?.nctId
            )}
            saveTrial={saveTrial}
          />
        ))}
      </div>
    ) : (
      <div className="no-results" aria-live="polite">
        No trials found. Try broadening your search criteria or resetting filters.
      </div>
    )}
  </section>
);

export default TrialsSection;