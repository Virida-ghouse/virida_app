import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`glass-card rounded-2xl ${hover ? 'glow-border' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
