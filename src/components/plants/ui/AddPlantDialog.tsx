import React, { useState, useEffect } from 'react';
import { plantService, apiFetch } from '../../../services/api';

interface PlantCatalog {
  id: string;
  commonName: string;
  species: string;
  category: string;
  difficulty: string;
  totalGrowthDays: number;
  imageUrl?: string;
  iconEmoji?: string;
}

interface Greenhouse {
  id: string;
  name: string;
  description?: string;
  location?: string;
}

interface AddPlantDialogProps {
  open: boolean;
  onClose: () => void;
  onPlantAdded: () => void;
}

export const AddPlantDialog: React.FC<AddPlantDialogProps> = ({
  open,
  onClose,
  onPlantAdded,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Sélectionner', 'Configurer', 'Confirmer'];

  const [catalog, setCatalog] = useState<PlantCatalog[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loadingGreenhouses, setLoadingGreenhouses] = useState(false);

  const [selectedPlant, setSelectedPlant] = useState<PlantCatalog | null>(null);
  const [plantName, setPlantName] = useState('');
  const [zone, setZone] = useState('Zone 1');
  const [greenhouse, setGreenhouse] = useState('');
  const [plantedAt, setPlantedAt] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCatalog();
      fetchGreenhouses();
      setActiveStep(0);
      setSelectedPlant(null);
      setPlantName('');
      setNotes('');
      setSearchText('');
      setSubmitError(null);
    }
  }, [open]);

  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      setCatalogError(null);
      const response = await plantService.getPlantCatalog();
      const list = (response as any).data?.plants || response || [];
      setCatalog(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Erreur chargement catalogue:', err);
      setCatalogError('Impossible de charger le catalogue');
    } finally {
      setLoadingCatalog(false);
    }
  };

  const fetchGreenhouses = async () => {
    try {
      setLoadingGreenhouses(true);
      const response = await apiFetch('/api/greenhouses');
      const data = await response.json();
      const list = data.data || [];
      setGreenhouses(list);
      if (list.length > 0 && !greenhouse) {
        setGreenhouse(list[0].id);
      }
    } catch (error) {
      console.error('Error fetching greenhouses:', error);
      setGreenhouses([]);
    } finally {
      setLoadingGreenhouses(false);
    }
  };

  const handleSelectPlant = (plant: PlantCatalog) => {
    setSelectedPlant(plant);
    setPlantName(plant.commonName);
    setActiveStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedPlant) return;
    try {
      setSubmitting(true);
      setSubmitError(null);
      if (!greenhouse) {
        setSubmitError('Veuillez sélectionner une serre');
        setSubmitting(false);
        return;
      }
      await plantService.createPlant({
        catalogId: selectedPlant.id,
        name: plantName || selectedPlant.commonName,
        species: selectedPlant.species,
        zone,
        greenhouseId: greenhouse,
        plantedAt: new Date(plantedAt).toISOString(),
        notes: notes || undefined,
      } as any);
      onPlantAdded();
      onClose();
    } catch (err) {
      const msg = (err as any)?.data?.message || (err instanceof Error ? err.message : "Erreur lors de l'ajout");
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCatalog = catalog.filter((p) =>
    (p.commonName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (p.species?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden border-2 border-[#2AD368]/20 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="p-5 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Ajouter une plante</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {steps[activeStep]} — Étape {activeStep + 1}/{steps.length}
              </p>
            </div>
            <button onClick={onClose} className="size-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {steps.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < activeStep ? 'bg-[#2AD368] text-white' :
                    i === activeStep ? 'bg-[#2AD368] text-white' :
                    'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}>
                    {i < activeStep ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline ${
                    i <= activeStep ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded ${i < activeStep ? 'bg-[#2AD368]' : 'bg-[var(--border-color)]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">

          {/* Step 0: Sélectionner */}
          {activeStep === 0 && (
            <div>
              {/* Search */}
              <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">search</span>
                <input
                  type="text"
                  placeholder="Rechercher une plante..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2AD368] transition-all"
                />
              </div>

              {catalogError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{catalogError}</div>
              )}

              {loadingCatalog ? (
                <div className="flex justify-center py-12">
                  <div className="size-12 border-4 border-[var(--border-color)] border-t-[#2AD368] rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredCatalog.map((plant) => (
                    <button
                      key={plant.id}
                      onClick={() => handleSelectPlant(plant)}
                      className="rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-[#2AD368]/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2AD368]/10 text-left group"
                    >
                      <div className="h-28 bg-[var(--bg-primary)] relative overflow-hidden">
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.commonName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">{plant.iconEmoji || '🌱'}</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-2 left-2 text-white font-semibold text-sm drop-shadow-lg">{plant.commonName}</span>
                      </div>
                      <div className="p-2 bg-[var(--bg-secondary)]">
                        <span className="text-xs text-[var(--text-secondary)]">{plant.totalGrowthDays} jours</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Configurer */}
          {activeStep === 1 && selectedPlant && (
            <div className="space-y-4">
              {/* Plant preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2AD368]/10 border border-[#2AD368]/20">
                <div className="size-14 rounded-xl overflow-hidden bg-[var(--bg-primary)] flex-shrink-0">
                  {selectedPlant.imageUrl ? (
                    <img src={selectedPlant.imageUrl} alt={selectedPlant.commonName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{selectedPlant.iconEmoji || '🌱'}</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{selectedPlant.commonName}</h3>
                  <p className="text-sm text-[var(--text-secondary)] italic">{selectedPlant.species}</p>
                </div>
              </div>

              {/* Form */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Nom personnalisé</label>
                <input type="text" value={plantName} onChange={(e) => setPlantName(e.target.value)} placeholder={selectedPlant.commonName}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2AD368] transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Zone</label>
                  <select value={zone} onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] transition-all">
                    <option value="Zone 1">Zone 1</option>
                    <option value="Zone 2">Zone 2</option>
                    <option value="Zone 3">Zone 3</option>
                    <option value="Zone 4">Zone 4</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Serre</label>
                  <select value={greenhouse} onChange={(e) => setGreenhouse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] transition-all">
                    {loadingGreenhouses ? (
                      <option disabled>Chargement...</option>
                    ) : greenhouses.length === 0 ? (
                      <option disabled>Aucune serre</option>
                    ) : (
                      greenhouses.map((gh) => (
                        <option key={gh.id} value={gh.id}>{gh.name}{gh.location ? ` - ${gh.location}` : ''}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Date de plantation</label>
                <input type="date" value={plantedAt} onChange={(e) => setPlantedAt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Notes (optionnel)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ajoutez des notes..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2AD368] transition-all resize-none" />
              </div>
            </div>
          )}

          {/* Step 2: Confirmer */}
          {activeStep === 2 && selectedPlant && (
            <div>
              <div className="text-center mb-6">
                <div className="size-16 rounded-full bg-[#2AD368]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[#2AD368] text-3xl">check_circle</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Prêt à ajouter</h3>
                <p className="text-sm text-[var(--text-secondary)]">Vérifiez les informations</p>
              </div>

              {submitError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{submitError}</div>
              )}

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
                    {selectedPlant.imageUrl ? (
                      <img src={selectedPlant.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">{selectedPlant.iconEmoji || '🌱'}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{plantName || selectedPlant.commonName}</h4>
                    <p className="text-sm text-[var(--text-secondary)] italic">{selectedPlant.species}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Zone</p>
                    <span className="px-3 py-1 rounded-lg bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] text-sm font-semibold">{zone}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Serre</p>
                    <span className="px-3 py-1 rounded-lg bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] text-sm font-semibold">
                      {greenhouses.find(g => g.id === greenhouse)?.name || 'Non sélectionnée'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Date de plantation</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {new Date(plantedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Croissance</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedPlant.totalGrowthDays} jours</p>
                  </div>
                </div>

                {notes && (
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Notes</p>
                    <p className="text-sm text-[var(--text-primary)]">{notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-color)] p-4 flex items-center justify-between bg-[var(--bg-primary)]">
          <button onClick={onClose} disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all disabled:opacity-50">
            Annuler
          </button>

          <div className="flex gap-2">
            {activeStep > 0 && (
              <button onClick={() => setActiveStep(s => s - 1)} disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
                Précédent
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button onClick={() => setActiveStep(s => s + 1)} disabled={!selectedPlant || submitting}
                className="px-5 py-2.5 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-lg shadow-[#2AD368]/30 hover:shadow-xl hover:shadow-[#2AD368]/40 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 flex items-center gap-1">
                Suivant
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-lg shadow-[#2AD368]/30 hover:shadow-xl hover:shadow-[#2AD368]/40 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                {submitting ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">add</span>
                    Ajouter la plante
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
