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

  return (
    <span className="text-3xl font-bold text-white">
      {count}
    </span>
  );
};

const ParticipantCard = ({ Icon, value, label, gradient, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);

  return (
    <div 
      className={`transform transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className={`h-36 rounded-xl p-4 ${gradient}`}>
        <div className="flex flex-col items-center justify-between h-full">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <Icon className="text-white" size={24} />
          </div>
          {isNumeric ? (
            <AnimatedCounter endValue={numericValue} />
          ) : (
            <span className="text-3xl font-bold text-white">{value || 'N/A'}</span>
          )}
          <span className="text-sm font-semibold text-white opacity-90">{label}</span>
        </div>
      </div>
    </div>
  );
};

const Participants = ({ participants }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!participants) {
    return (
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Users size={28} className="text-white" />
            <h2 className="text-2xl font-extrabold text-white">
              Participant Information
            </h2>
          </div>
        </div>
        <div className="p-10 text-center">
          <p className="text-gray-400 italic">No participant data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out ${
      isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <Users size={28} className="text-white" />
          <h2 className="text-2xl font-extrabold text-white">
            Participant Information
          </h2>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ParticipantCard
            Icon={Calendar}
            value={participants.ageRange}
            label="Age Range"
            gradient="bg-gradient-to-br from-red-400 to-red-500"
            delay={0}
          />
          <ParticipantCard
            Icon={User}
            value={participants.sex}
            label="Sex"
            gradient="bg-gradient-to-br from-teal-400 to-teal-500"
            delay={100}
          />
          <ParticipantCard
            Icon={Users}
            value={participants.enrollment}
            label="Enrollment"
            gradient="bg-gradient-to-br from-indigo-400 to-indigo-500"
            delay={200}
          />
        </div>

        {participants.eligibility && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Eligibility Criteria
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {participants.eligibility}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Participants;