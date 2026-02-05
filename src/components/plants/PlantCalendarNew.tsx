import React, { useState } from 'react';

const PlantCalendarNew: React.FC = () => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());

  // Obtenir le nombre de jours dans un mois
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtenir le premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convertir pour que Lundi = 0
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const today = now.getDate();
  const currentMonth = now.getMonth();

  // Créer un tableau de jours
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-400">
          Planifiez vos cultures selon les saisons
        </p>
      </div>

      {/* Calendrier mensuel */}
      <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2AD368]">calendar_month</span>
            {months[selectedMonth]} {selectedYear}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
              className="size-10 glass-card backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
              className="size-10 glass-card backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-2">
              <p className="text-xs font-bold text-gray-500 uppercase">{day}</p>
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={`py-2 flex items-center justify-center rounded-xl transition-all ${
                day === null
                  ? ''
                  : day === today && selectedMonth === currentMonth
                  ? 'bg-[#2AD368] text-[#121A21] font-black shadow-lg'
                  : 'bg-white/5 text-white hover:bg-white/10 cursor-pointer'
              }`}
            >
              {day && <span className="text-sm">{day}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Saisons */}
      <div className="grid grid-cols-2 gap-6">
        {/* Printemps */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-[#CBED62]/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🌸</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Printemps</h3>
              <p className="text-xs text-gray-500">Mars - Mai</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Période idéale pour démarrer la plupart des cultures
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥬 Laitue</p>
              <p className="text-xs text-gray-400">Semis direct • 45-60 jours</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥕 Carotte</p>
              <p className="text-xs text-gray-400">Semis direct • 70-80 jours</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🌿 Basilic</p>
              <p className="text-xs text-gray-400">Semis intérieur • 60-90 jours</p>
            </div>
          </div>
        </div>

        {/* Été */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">☀️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Été</h3>
              <p className="text-xs text-gray-500">Juin - Août</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Récolte et entretien des cultures de printemps
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🍅 Tomate</p>
              <p className="text-xs text-gray-400">Récolte • Arrosage régulier</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥒 Concombre</p>
              <p className="text-xs text-gray-400">Récolte • Tuteurage</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🌶️ Poivron</p>
              <p className="text-xs text-gray-400">Récolte • Fertilisation</p>
            </div>
          </div>
        </div>

        {/* Automne */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-orange-600/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🍂</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Automne</h3>
              <p className="text-xs text-gray-500">Septembre - Novembre</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Cultures d'hiver et préparation de la serre
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥬 Épinard</p>
              <p className="text-xs text-gray-400">Semis • 40-50 jours</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🧅 Oignon</p>
              <p className="text-xs text-gray-400">Plantation • 90-120 jours</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥦 Brocoli</p>
              <p className="text-xs text-gray-400">Semis • 80-100 jours</p>
            </div>
          </div>
        </div>

        {/* Hiver */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">❄️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hiver</h3>
              <p className="text-xs text-gray-500">Décembre - Février</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Cultures résistantes et planification
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥬 Mâche</p>
              <p className="text-xs text-gray-400">Récolte • Résistant au froid</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🥕 Carotte d'hiver</p>
              <p className="text-xs text-gray-400">Récolte • Conservation</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-semibold text-white mb-1">🌿 Persil</p>
              <p className="text-xs text-gray-400">Récolte • Aromatique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCalendarNew;
