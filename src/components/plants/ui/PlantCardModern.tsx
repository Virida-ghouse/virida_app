import React, { useState } from 'react';

interface PlantCardModernProps {
  plant: {
    id: string;
    name: string;
    imageUrl?: string;
    iconEmoji?: string;
    health: number;
    daysToHarvest?: number;
    category?: string;
    difficulty?: string;
    species?: string;
    status?: string;
  };
  onClick: (plantId: string) => void;
  onDelete?: (id: string) => void;
}

const getHealthColor = (health: number): string => {
  if (health >= 90) return '#2AD368';
  if (health >= 70) return '#81C784';
  if (health >= 50) return '#FFA726';
  return '#EF5350';
};

const getDifficultyConfig = (difficulty?: string) => {
  const d = difficulty?.toLowerCase();
  if (d === 'easy' || d === 'facile' || d === 'very easy' || d === 'très facile') {
    return { label: 'Facile', color: 'text-[#2AD368]', bg: 'bg-[#2AD368]/10', border: 'border-[#2AD368]/30' };
  }
  if (d === 'medium' || d === 'moyen' || d === 'moderate') {
    return { label: 'Moyen', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' };
  }
  if (d === 'difficult' || d === 'difficile' || d === 'hard') {
    return { label: 'Difficile', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' };
  }
  return null;
};

export const PlantCardModern: React.FC<PlantCardModernProps> = ({
  plant,
  onClick,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const healthColor = getHealthColor(plant.health);
  const difficultyConfig = getDifficultyConfig(plant.difficulty);

  return (
    <div
      onClick={() => onClick(plant.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-[#2AD368]/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#1a1f26] to-[#0a0f14] overflow-hidden">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">{plant.iconEmoji || '🌱'}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121A21] via-transparent to-transparent opacity-60" />

        {/* Delete button */}
        {onDelete && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plant.id);
            }}
            className="absolute top-3 right-3 size-9 rounded-xl bg-red-500/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-lg">delete</span>
          </button>
        )}

        {/* Category badge */}
        {plant.category && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2AD368]/90 backdrop-blur-sm border border-[#2AD368] shadow-lg">
            <span className="text-xs font-bold text-[#121A21] uppercase">
              {plant.category.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Health indicator */}
        <div className="absolute bottom-3 right-3 size-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center">
          <div className="relative size-8">
            <svg className="size-full -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={healthColor}
                strokeWidth="2"
                strokeDasharray={`${(plant.health / 100) * 88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">{plant.health}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-[#2AD368] transition-colors">
          {plant.name}
        </h3>

        {/* Species */}
        {plant.species && (
          <p className="text-xs text-gray-400 italic mb-3 truncate">{plant.species}</p>
        )}

        {/* Difficulty & Days */}
        <div className="flex items-center gap-2 mb-3">
          {difficultyConfig && (
            <div className={`px-2 py-1 rounded-lg ${difficultyConfig.bg} border ${difficultyConfig.border}`}>
              <span className={`text-xs font-semibold ${difficultyConfig.color}`}>
                {difficultyConfig.label}
              </span>
            </div>
          )}
          
          {plant.daysToHarvest !== undefined && (
            <div className="px-2 py-1 rounded-lg bg-[#CBED62]/10 border border-[#CBED62]/30">
              <span className="text-xs font-semibold text-[#CBED62]">
                {plant.daysToHarvest > 0 ? `${plant.daysToHarvest}j` : 'Prêt'}
              </span>
            </div>
          )}
        </div>

        {/* Health bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Santé</span>
            <span className="text-xs font-bold" style={{ color: healthColor }}>
              {plant.health}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${plant.health}%`,
                backgroundColor: healthColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
