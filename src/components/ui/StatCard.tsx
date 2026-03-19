import React from 'react';
import GlassCard from './GlassCard';

interface StatCardProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number | string;
  unit: string;
  trend?: string;
  trendColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  unit,
  trend,
  trendColor = 'text-accent-glow'
}) => {
  return (
    <GlassCard className="p-5 group cursor-pointer border border-[var(--border-color)] shadow-md hover:shadow-xl transition-shadow" hover>
      <div className="flex justify-between items-start mb-4">
        <span 
          className={`material-symbols-outlined ${iconColor} ${iconBg} p-2 rounded-lg transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm`}
          style={{ fontSize: '24px' }}
        >
          {icon}
        </span>
        {trend && (
          <span className={`${trendColor} text-[10px] font-black animate-pulse`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-[var(--text-secondary)] text-xs font-medium uppercase mb-1 tracking-wider">{label}</p>
      <p className="text-2xl font-black text-[var(--text-primary)] group-hover:text-primary transition-colors">
        {value}
        <span className="text-[var(--text-tertiary)] text-lg">{unit}</span>
      </p>
    </GlassCard>
  );
};

export default StatCard;
