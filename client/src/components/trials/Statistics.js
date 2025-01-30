import React, { useEffect, useState } from 'react';
import { Activity, Users, Target, Layers } from 'lucide-react';

const AnimatedCounter = ({ endValue, duration = 2000, textColor = '#2D3748' }) => {
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
    <span className="text-3xl font-extrabold" style={{ color: textColor }}>
      {count}
      <span className="text-lg font-semibold ml-1">+</span>
    </span>
  );
};

const StatCard = ({ Icon, value, label, gradient, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`w-[31%] rounded-xl overflow-hidden shadow-md transition-all duration-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div 
        className="p-4 flex flex-col items-center justify-between h-36"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
        }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <AnimatedCounter endValue={value} textColor="#FFF" />
        <span className="text-sm text-white font-semibold text-center opacity-90">
          {label}
        </span>
      </div>
    </div>
  );
};

const Statistics = ({ stats = { enrollment: 0, primary: 0, secondary: 0 } }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`bg-gray-50 rounded-2xl my-4 overflow-hidden shadow-lg transition-all duration-600 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div 
        className="flex items-center p-5 border-b border-white/10"
        style={{
          background: 'linear-gradient(135deg, #4A90E2, #357ABD)'
        }}
      >
        <Activity className="w-7 h-7 text-white mr-3" />
        <h2 className="text-2xl font-extrabold text-white tracking-wide">
          Study Analytics
        </h2>
      </div>
      
      <div className="flex justify-between p-4 bg-white">
        <StatCard
          Icon={Users}
          value={stats.enrollment}
          label="Participants"
          gradient={['#FF6B6B', '#EE5253']}
          delay={0}
        />
        <StatCard
          Icon={Target}
          value={stats.primary}
          label="Primary Outcomes"
          gradient={['#4ECDC4', '#45B7AF']}
          delay={100}
        />
        <StatCard
          Icon={Layers}
          value={stats.secondary}
          label="Secondary Outcomes"
          gradient={['#6C5CE7', '#5B4BC7']}
          delay={200}
        />
      </div>
    </div>
  );
};

export default Statistics;