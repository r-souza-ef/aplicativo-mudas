
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'text-slate-800' }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;
