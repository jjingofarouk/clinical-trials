import React, { useEffect, useState } from 'react';
import { Activity, Users, Target, Layers } from 'lucide-react';

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
    <span className="text-2xl font-semibold text-white">
      {count}
      <span className="text-base font-medium ml-1">+</span>
    </span>
  );
};

const StatCard = ({ Icon, value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex-1 rounded-xl transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } bg-[#000000]`}
    >
      <div className="p-4 flex flex-col items-center justify-between h-28">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-2">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <AnimatedCounter endValue={value} />
        <span className="text-xs font-medium text-white/90 text-center">{label}</span>
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
      className={`bg-white rounded-2xl my-3 overflow-hidden transition-all duration-300 max-w-7xl mx-auto ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="flex items-center p-3 bg-[#000000]">
        <Activity className="w-5 h-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Study Analytics</h2>
      </div>
      <div className="p-4 flex gap-3">
        <StatCard
          Icon={Users}
          value={stats.enrollment}
          label="Participants"
          delay={0}
        />
        <StatCard
          Icon={Target}
          value={stats.primary}
          label="Primary Outcomes"
          delay={100}
        />
        <StatCard
          Icon={Layers}
          value={stats.secondary}
          label="Secondary Outcomes"
          delay={200}
        />
      </div>
      <style jsx>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 640px) {
          .rounded-2xl {
            border-radius: 12px;
          }

          .my-3 {
            margin-top: 12px;
            margin-bottom: 12px;
          }

          .p-3 {
            padding: 10px;
          }

          .p-4 {
            padding: 12px;
          }

          .flex {
            flex-direction: column;
          }

          .gap-3 {
            gap: 8px;
          }

          .h-28 {
            height: 110px;
          }

          .text-2xl {
            font-size: 1.5rem;
          }

          .text-base {
            font-size: 14px;
          }

          .text-xs {
            font-size: 11px;
          }

          .w-8 {
            width: 28px;
          }

          .h-8 {
            height: 28px;
          }

          .w-5 {
            width: 18px;
          }

          .h-5 {
            height: 18px;
          }

          .text-lg {
            font-size: 16px;
          }

          .max-w-7xl {
            margin-left: 12px;
            margin-right: 12px;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .rounded-2xl {
            border-radius: 14px;
          }

          .h-28 {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default Statistics;