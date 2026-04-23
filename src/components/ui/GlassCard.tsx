import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = false, id }) => {
  return (
    <div id={id} className={`glass-card rounded-2xl ${hover ? 'glow-border' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
