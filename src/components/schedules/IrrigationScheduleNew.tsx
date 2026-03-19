import React, { useState } from 'react';

interface Schedule {
  id: number;
  time: string;
  duration: number;
  days: string[];
  enabled: boolean;
}

export default function IrrigationScheduleNew() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      time: '06:00',
      duration: 15,
      days: ['Mon', 'Wed', 'Fri'],
      enabled: true,
    },
    {
      id: 2,
      time: '18:00',
      duration: 20,
      days: ['Tue', 'Thu', 'Sat'],
      enabled: false,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleOpenDialog = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setSelectedTime(schedule.time);
      setSelectedDuration(schedule.duration);
      setSelectedDays(schedule.days);
    } else {
      setEditingSchedule(null);
      setSelectedTime('');
      setSelectedDuration(15);
      setSelectedDays([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id: number) => {
    if (!confirm('Supprimer ce programme ?')) return;
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveSchedule = () => {
    if (editingSchedule) {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === editingSchedule.id
            ? { ...schedule, time: selectedTime, duration: selectedDuration, days: selectedDays }
            : schedule
        )
      );
    } else {
      const newSchedule: Schedule = {
        id: Math.max(...schedules.map((s) => s.id), 0) + 1,
        time: selectedTime,
        duration: selectedDuration,
        days: selectedDays,
        enabled: true,
      };
      setSchedules([...schedules, newSchedule]);
    }
    setOpenDialog(false);
  };

  const handleToggleEnabled = (id: number) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)] dark:bg-background-dark text-[var(--text-primary)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-12 md:size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl md:text-3xl">
                water_drop
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-1">
                Irrigation <span className="text-[#CBED62]">Schedule</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                Gérez vos programmes d'arrosage automatique
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenDialog()}
            className="px-6 py-3 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="glass-card backdrop-blur-xl rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>Time</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">timer</span>
                    <span>Duration</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    <span>Days</span>
                  </div>
                </th>
                <th className="text-left p-4 text-[#2AD368] font-semibold text-sm hidden md:table-cell">
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
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">
                      Aucun programme configuré
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr
                      key={schedule.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2AD368]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2AD368]">schedule</span>
                          </div>
                          <span className="text-[var(--text-primary)] font-semibold text-lg">{schedule.time}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#2AD368] text-sm">timer</span>
                          <span className="text-[var(--text-secondary)]">{schedule.duration} min</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {schedule.days.map((day) => (
                            <span
                              key={day}
                              className="px-3 py-1 rounded-lg bg-[#2AD368]/20 border border-[#2AD368]/30 text-[#2AD368] text-xs font-semibold"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <button
                          onClick={() => handleToggleEnabled(schedule.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            schedule.enabled ? 'bg-[#2AD368]' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              schedule.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenDialog(schedule)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-white"
                            title="Modifier"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
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
                {editingSchedule ? 'Modifier le programme' : 'Ajouter un programme'}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Heure</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-white focus:border-[#2AD368] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Durée (minutes)
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-white focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3">
                  Sélectionner les jours
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        selectedDays.includes(day)
                          ? 'bg-[#2AD368] text-white shadow-lg shadow-[#2AD368]/20'
                          : 'glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-[#2AD368]/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
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
                onClick={handleSaveSchedule}
                disabled={!selectedTime || selectedDays.length === 0}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-white font-semibold transition-all shadow-lg shadow-[#2AD368]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSchedule ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
