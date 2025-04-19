import React, { useEffect, useState } from 'react';
import { Users, Calendar, User } from 'lucide-react';

const AnimatedCounter = ({ endValue, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let frameId = null;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      setCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [endValue, duration]);

  return <span className="text-2 AscendantsCounter">{count}</span>;
};

const ParticipantCard = ({ Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } bg-[#000000] rounded-xl p-4 flex flex-col items-center justify-between h-32 w-full`}
    >
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <Icon className="text-white" size={18} />
      </div>
      {isNumeric ? (
        <AnimatedCounter endValue={numericValue} />
      ) : (
        <span className="text-2xl font-semibold text-white">{value || 'N/A'}</span>
      )}
      <span className="text-xs font-medium text-white/90">{label}</span>
    </div>
  );
};

const Participants = ({ participants }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transform transition-all duration-300 ease-out ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      } max-w-7xl mx-auto`}
    >
      <div className="bg-[#000000] px-4 py-3 flex items-center gap-2">
        <Users size={20} className="text-white" />
        <h2 className="text-lg font-semibold text-white">Participant Information</h2>
      </div>

      {!participants ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 text-sm">No participant data available</p>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ParticipantCard
              Icon={Calendar}
              value={participants.ageRange}
              label="Age Range"
              delay={0}
            />
            <ParticipantCard
              Icon={User}
              value={participants.sex}
              label="Sex"
              delay={100}
            />
            <ParticipantCard
              Icon={Users}
              value={participants.enrollment}
              label="Enrollment"
              delay={200}
            />
          </div>

          {participants.eligibility && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Eligibility Criteria</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {participants.eligibility}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Participants;

<style>
.participants-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

@media (max-width: 640px) {
  .participants-container {
    border-radius: 12px;
  }

  .bg-[#000000] {
    padding: 12px;
  }

  .text-lg {
    font-size: 16px;
  }

  .p-4 {
    padding: 12px;
  }

  .gap-3 {
    gap: 8px;
  }

  .h-32 {
    height: 120px;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .text-xs {
    font-size: 11px;
  }

  .w-8 {
    width: 32px;
  }

  .h-8 {
    height: 32px;
  }

  .mt-4 {
    margin-top: 12px;
  }

  .pt-4 {
    padding-top: 12px;
  }

  .text-base {
    font-size: 14px;
  }

  .text-sm {
    font-size: 12px;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .participants-container {
    border-radius: 14px;
  }

  .h-32 {
    height: 130px;
  }
}
</style>