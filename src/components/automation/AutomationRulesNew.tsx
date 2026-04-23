import React, { useState } from 'react';
import { useViridaStore } from '../../store/useViridaStore';

interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export default function AutomationRulesNew() {
  const { automationRules, toggleAutomationRule } = useViridaStore();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg-primary)] dark:bg-background-dark text-[var(--text-primary)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-12 md:size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl md:text-3xl">
                smart_toy
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-1">
                Automation <span className="text-[#CBED62]">Rules</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                Gérez vos règles d'automatisation intelligentes
              </p>
            </div>
          </div>
          <button
            id="onboarding-automation-add"
            onClick={handleOpenDialog}
            className="px-6 py-3 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Rules Table */}
      <div id="onboarding-automation-table" className="glass-card backdrop-blur-xl rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">label</span>
                    <span>Name</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">rule</span>
                    <span>Condition</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    <span>Action</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">toggle_on</span>
                    <span>Status</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {automationRules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="text-[var(--text-secondary)]">Aucune règle d'automatisation configurée</p>
                  </td>
                </tr>
              ) : (
                automationRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2AD368]/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#2AD368]">smart_toy</span>
                        </div>
                        <span className="text-[var(--text-primary)] font-semibold text-lg">{rule.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#2AD368] text-sm">rule</span>
                        <span className="text-[var(--text-secondary)] text-sm">{rule.condition}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#2AD368] text-sm">bolt</span>
                        <span className="text-[var(--text-secondary)] text-sm">{rule.action}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          rule.enabled ? 'bg-[#2AD368]' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            rule.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleOpenDialog}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-white"
                          title="Modifier"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-red-400"
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card backdrop-blur-xl rounded-3xl w-full max-w-xl border-2 border-[#2AD368]/20 shadow-2xl">
            {/* Header */}
            <div className="border-b border-[var(--border-color)] p-8 bg-gradient-to-r from-[#052E1C] to-[#121A21] rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">
                Ajouter une règle
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Nom de la règle</label>
                <input
                  type="text"
                  placeholder="Ex: Arrosage automatique"
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-white placeholder-gray-500 focus:border-[#2AD368] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Condition
                </label>
                <input
                  type="text"
                  placeholder="Ex: Humidité du sol < 30%"
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-white placeholder-gray-500 focus:border-[#2AD368] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Action
                </label>
                <input
                  type="text"
                  placeholder="Ex: Activer l'irrigation pendant 15 min"
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-white placeholder-gray-500 focus:border-[#2AD368] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border-color)] p-6 flex gap-3">
              <button
                onClick={handleCloseDialog}
                className="flex-1 px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-white transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleCloseDialog}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[#121A21] font-semibold transition-all shadow-lg shadow-[#2AD368]/20"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
