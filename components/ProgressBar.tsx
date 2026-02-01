
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  thin?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = 'bg-green-600', thin = false }) => {
  const heightClass = thin ? 'h-1.5' : 'h-2.5';
  return (
    <div className={`w-full bg-slate-200 rounded-full ${heightClass}`}>
      <div className={`${color} ${heightClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;
