import React, { useEffect, useState } from 'react';
import { plantService } from '../../../services/api';
import { apiFetch } from '../../../services/api/apiConfig';

interface CatalogData {
  id: string;
  commonName: string;
  scientificName?: string;
  species?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  history?: string;
  imageUrl?: string;
  iconEmoji?: string;
  totalGrowthDays?: number;
  yieldMin?: number;
  yieldMax?: number;
  yieldUnit?: string;
  spaceRequiredWidth?: number;
  spaceRequiredHeight?: number;
  wateringFrequency?: string;
  wateringAmount?: string;
  sunlightHours?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;
  optimalHumidityMin?: number;
  optimalHumidityMax?: number;
  optimalSeasons?: string | string[];
  careInstructions?: string | string[];
  commonProblems?: string | string[];
  pests?: string | string[];
  tips?: string[];
  commonIssues?: string[];
  companions?: string[];
  tags?: string[];
}

interface PlantLibraryDetailsDialogModernProps {
  open: boolean;
  onClose: () => void;
  plantId: string;
  plantName: string;
  onPlantAdded?: () => void;
}

export const PlantLibraryDetailsDialogModern: React.FC<PlantLibraryDetailsDialogModernProps> = ({
  open,
  onClose,
  plantId,
  plantName,
  onPlantAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Ajout à la serre
  const [showAddForm, setShowAddForm] = useState(false);
  const [greenhouses, setGreenhouses] = useState<{ id: string; name: string }[]>([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [customName, setCustomName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    if (open && plantId) {
      fetchCatalogData();
    }
  }, [open, plantId]);

  const fetchCatalogData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantService.getPlantCatalogItem(plantId);
      const plant = data.plant || data || {};
      setCatalogData(plant);
      setCustomName(plant.commonName || plantName || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      apiFetch('/api/greenhouses').then(r => r.json()).then(d => {
        const list: { id: string; name: string }[] = d.data || d || [];
        setGreenhouses(list);
        if (list.length > 0) setSelectedGreenhouse(list[0].id);
      }).catch(() => {});
    }
  }, [open]);

  const handleAdd = async () => {
    if (!selectedGreenhouse) return;
    setAdding(true);
    try {
      await plantService.createPlant({
        catalogId: plantId,
        name: customName || catalogData?.commonName || plantName,
        species: catalogData?.species || catalogData?.scientificName,
        greenhouseId: selectedGreenhouse,
      });
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        setShowAddForm(false);
        onPlantAdded?.();
        onClose();
      }, 1200);
    } catch (e) {
      console.error('Erreur ajout plante:', e);
    }
    setAdding(false);
  };

  const formatYield = (yieldMin?: number, yieldMax?: number, yieldUnit?: string): string | null => {
    if (!yieldMin && !yieldMax) return null;
    const unit = yieldUnit || 'g';
    if (yieldMin && yieldMax) {
      if (unit === 'g' && yieldMin >= 1000) {
        return `${(yieldMin / 1000).toFixed(1)}-${(yieldMax / 1000).toFixed(1)}kg`;
      }
      return `${yieldMin}-${yieldMax}${unit}`;
    }
    if (yieldMin) return `~${yieldMin}${unit}`;
    if (yieldMax) return `~${yieldMax}${unit}`;
    return null;
  };

  const getDifficultyLabel = (difficulty?: string): string => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy' || d === 'facile' || d === 'very easy' || d === 'très facile') return 'Facile';
    if (d === 'medium' || d === 'moyen' || d === 'moderate') return 'Moyen';
    if (d === 'difficult' || d === 'difficile' || d === 'hard') return 'Difficile';
    return difficulty || '';
  };

  const parseArrayField = (field?: string | string[] | any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch {
        return field.split('\n').filter(Boolean);
      }
    }
    return [];
  };

  if (!open) return null;

  const yieldDisplay = formatYield(catalogData?.yieldMin, catalogData?.yieldMax, catalogData?.yieldUnit);
  const tempDisplay = catalogData?.optimalTempMin && catalogData?.optimalTempMax
    ? `${catalogData.optimalTempMin}-${catalogData.optimalTempMax}°C`
    : null;
  const careInstructions = parseArrayField(catalogData?.careInstructions || catalogData?.tips);
  const commonProblems = parseArrayField(catalogData?.commonProblems || catalogData?.commonIssues);
  const pests = parseArrayField(catalogData?.pests);
  const companions = parseArrayField(catalogData?.companions);

  const tabs = [
    { id: 0, label: 'À propos', icon: 'info' },
    { id: 1, label: 'Soins', icon: 'spa' },
    { id: 2, label: 'Problèmes', icon: 'bug_report' },
    { id: 3, label: 'Récolte', icon: 'agriculture' },
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-[#2AD368]/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-[var(--border-color)] p-4 md:p-6 bg-gradient-to-r from-[var(--modal-gradient-start)] to-[var(--modal-gradient-end)]">
          <div className="flex items-center gap-4">
            {/* Image */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#2AD368]/30">
              {catalogData?.imageUrl ? (
                <img src={catalogData.imageUrl} alt={catalogData.commonName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#052E1C] to-[#121A21] flex items-center justify-center text-4xl">
                  {catalogData?.iconEmoji || '🌱'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-1">
                {catalogData?.commonName || plantName}
              </h2>
              {catalogData?.scientificName && (
                <p className="text-sm text-[var(--text-secondary)] italic mb-2">{catalogData.scientificName}</p>
              )}
              <div className="flex flex-wrap gap-2 items-center text-xs md:text-sm">
                {catalogData?.category && (
                  <span className="text-[var(--text-secondary)]">{catalogData.category.replace('_', ' ')}</span>
                )}
                {catalogData?.difficulty && (
                  <>
                    <span className="text-[var(--text-secondary)]">•</span>
                    <span className="text-[#2AD368] font-semibold">{getDifficultyLabel(catalogData.difficulty)}</span>
                  </>
                )}
                {catalogData?.totalGrowthDays && (
                  <>
                    <span className="text-[var(--text-secondary)]">•</span>
                    <span className="text-[var(--text-secondary)]">{catalogData.totalGrowthDays} jours</span>
                  </>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 min-w-[100px] px-4 py-3 md:py-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                  currentTab === tab.id
                    ? 'border-[#2AD368] text-[#2AD368]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="font-semibold text-sm md:text-base hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer CTA "Ajouter dans ma serre" ── */}
        {!showAddForm ? (
          <div className="px-4 md:px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between gap-3 flex-shrink-0">
            <p className="text-xs text-[var(--text-secondary)]">
              {catalogData?.totalGrowthDays ? `🌱 Récolte en ${catalogData.totalGrowthDays} jours` : ''}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2AD368] text-[#052E1C] font-bold shadow-[0_6px_20px_rgba(42,211,104,0.4)] hover:shadow-[0_8px_28px_rgba(42,211,104,0.6)] hover:scale-105 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Ajouter dans ma serre
            </button>
          </div>
        ) : (
          <div className="px-4 md:px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0 space-y-3">
            <p className="text-sm font-bold text-[var(--text-primary)]">Ajouter dans ma serre</p>
            <div className="flex gap-3">
              {/* Nom personnalisé */}
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="Nom de la plante..."
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#2AD368]"
              />
              {/* Sélecteur serre */}
              {greenhouses.length > 1 && (
                <select
                  value={selectedGreenhouse}
                  onChange={e => setSelectedGreenhouse(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#2AD368]"
                >
                  {greenhouses.map(gh => (
                    <option key={gh.id} value={gh.id}>{gh.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || addSuccess}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${addSuccess ? 'bg-[#2AD368]/20 text-[#2AD368] border border-[#2AD368]/40' : 'bg-[#2AD368] text-[#052E1C] shadow-[0_4px_14px_rgba(42,211,104,0.4)] hover:scale-105'} disabled:opacity-70`}
              >
                {addSuccess ? (
                  <><span className="material-symbols-outlined text-base">check_circle</span> Ajoutée !</>
                ) : adding ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" /></svg> Ajout...</>
                ) : (
                  <><span className="material-symbols-outlined text-base">add</span> Confirmer</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AD368]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-red-400 text-6xl mb-4">error</span>
              <p className="text-red-400">{error}</p>
            </div>
          ) : catalogData ? (
            <>
              {/* Tab 0: À propos */}
              {currentTab === 0 && (
                <div className="space-y-6">
                  {/* Description */}
                  {catalogData.description && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#2AD368]">menu_book</span>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Description</h3>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{catalogData.description}</p>
                    </div>
                  )}

                  {/* Histoire */}
                  {catalogData.history && (
                    <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[#2AD368]/20 bg-[#2AD368]/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#2AD368]">history_edu</span>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Histoire</h3>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed italic">{catalogData.history}</p>
                    </div>
                  )}

                  {/* Paramètres de culture */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[#2AD368]">settings</span>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Paramètres de culture</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Arrosage */}
                      {(catalogData.wateringFrequency || catalogData.wateringAmount) && (
                        <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[#2AD368]">water_drop</span>
                            <h4 className="font-bold text-[var(--text-primary)]">Arrosage</h4>
                          </div>
                          {catalogData.wateringFrequency && (
                            <p className="text-sm text-[var(--text-secondary)] mb-1">{catalogData.wateringFrequency}</p>
                          )}
                          {catalogData.wateringAmount && (
                            <p className="text-xs text-[var(--text-secondary)]">{catalogData.wateringAmount}</p>
                          )}
                        </div>
                      )}

                      {/* Lumière */}
                      {catalogData.sunlightHours && (
                        <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[#2AD368]">wb_sunny</span>
                            <h4 className="font-bold text-[var(--text-primary)]">Luminosité</h4>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{catalogData.sunlightHours}</p>
                        </div>
                      )}

                      {/* Température */}
                      {tempDisplay && (
                        <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[#2AD368]">thermostat</span>
                            <h4 className="font-bold text-[var(--text-primary)]">Température</h4>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{tempDisplay}</p>
                          {(catalogData.optimalHumidityMin || catalogData.optimalHumidityMax) && (
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                              Humidité: {catalogData.optimalHumidityMin}-{catalogData.optimalHumidityMax}%
                            </p>
                          )}
                        </div>
                      )}

                      {/* Espace */}
                      {(catalogData.spaceRequiredWidth || catalogData.spaceRequiredHeight) && (
                        <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[#2AD368]">straighten</span>
                            <h4 className="font-bold text-[var(--text-primary)]">Espace requis</h4>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {catalogData.spaceRequiredWidth} × {catalogData.spaceRequiredHeight} cm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plantes compagnes */}
                  {companions.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] mb-3">Plantes compagnes</h4>
                      <div className="flex flex-wrap gap-2">
                        {companions.map((companion, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] text-sm font-semibold"
                          >
                            {companion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 1: Soins */}
              {currentTab === 1 && (
                <div className="space-y-4">
                  {careInstructions.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#2AD368]">spa</span>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Instructions de soin</h3>
                      </div>
                      {careInstructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] border-l-4 border-l-[#2AD368]"
                        >
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2AD368]/20 text-[#2AD368] flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <p className="text-[var(--text-secondary)] leading-relaxed flex-1">{instruction}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-[var(--text-secondary)] text-6xl mb-4">spa</span>
                      <p className="text-[var(--text-secondary)]">Aucune instruction de soin disponible</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Problèmes */}
              {currentTab === 2 && (
                <div className="space-y-6">
                  {commonProblems.length > 0 || pests.length > 0 ? (
                    <>
                      {/* Problèmes courants */}
                      {commonProblems.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#2AD368]">bug_report</span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Problèmes courants</h3>
                          </div>
                          <div className="space-y-3">
                            {commonProblems.map((problem, index) => (
                              <div
                                key={index}
                                className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]"
                              >
                                <p className="text-[var(--text-secondary)] leading-relaxed">• {problem}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Parasites */}
                      {pests.length > 0 && (
                        <div>
                          <h4 className="font-bold text-[var(--text-primary)] mb-3">Parasites à surveiller</h4>
                          <div className="flex flex-wrap gap-2">
                            {pests.map((pest, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm"
                              >
                                {pest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-[var(--text-secondary)] text-6xl mb-4">bug_report</span>
                      <p className="text-[var(--text-secondary)]">Aucune information sur les problèmes disponible</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Récolte */}
              {currentTab === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#2AD368]">agriculture</span>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Informations de récolte</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Durée de croissance */}
                    {catalogData.totalGrowthDays && (
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Durée de croissance</p>
                        <p className="text-2xl font-bold text-[#2AD368]">{catalogData.totalGrowthDays} jours</p>
                      </div>
                    )}

                    {/* Rendement */}
                    {yieldDisplay && (
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Rendement attendu</p>
                        <p className="text-2xl font-bold text-[#2AD368]">{yieldDisplay}</p>
                      </div>
                    )}
                  </div>

                  {/* Saisons optimales */}
                  {catalogData.optimalSeasons && parseArrayField(catalogData.optimalSeasons).length > 0 && (
                    <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-3">Saisons optimales</p>
                      <div className="flex flex-wrap gap-2">
                        {parseArrayField(catalogData.optimalSeasons).map((season, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] font-semibold"
                          >
                            {season}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
