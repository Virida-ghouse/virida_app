import React, { useState, useEffect } from 'react';
import { useViridaStore } from '../../store/useViridaStore';

interface CareTask {
  id: string;
  plantId: string;
  type: 'WATERING' | 'FERTILIZING' | 'PRUNING' | 'PEST_CONTROL';
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  plant: {
    id: string;
    name: string;
    species: string;
    imageUrl?: string;
    iconEmoji?: string;
  };
}

const PlantCalendarNew: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());

  // Charger les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('virida_token');
        
        // Calculer les dates de début et fin du mois
        const fromDate = new Date(selectedYear, selectedMonth, 1);
        const toDate = new Date(selectedYear, selectedMonth + 1, 0);
        
        const response = await fetch(
          `${apiUrl}/api/plant-tasks?completed=false&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTasks(data.data || []);
        }
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [apiUrl, selectedMonth, selectedYear]);

  // Obtenir les tâches pour un jour donné
  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === selectedMonth &&
        taskDate.getFullYear() === selectedYear
      );
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'WATERING': return '💧';
      case 'FERTILIZING': return '🌿';
      case 'PRUNING': return '✂️';
      case 'PEST_CONTROL': return '🐛';
      default: return '✅';
    }
  };

  const getTaskBgColor = (type: string) => {
    switch (type) {
      case 'WATERING': return 'bg-blue-500/80';
      case 'FERTILIZING': return 'bg-[#CBED62]/80';
      case 'PRUNING': return 'bg-orange-500/80';
      case 'PEST_CONTROL': return 'bg-red-500/80';
      default: return 'bg-gray-500/80';
    }
  };

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
    <div className="overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Calendrier</h2>
        <p className="text-gray-400">
          {tasks.length} tâche{tasks.length > 1 ? 's' : ''} ce mois-ci
        </p>
      </div>

      {/* Légende des types de tâches */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-blue-400/30">
          <span className="material-symbols-outlined text-blue-400 text-sm">water_drop</span>
          <span className="text-xs text-gray-300">Arrosage</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-[#CBED62]/30">
          <span className="material-symbols-outlined text-[#CBED62] text-sm">grass</span>
          <span className="text-xs text-gray-300">Fertilisation</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-orange-400/30">
          <span className="material-symbols-outlined text-orange-400 text-sm">content_cut</span>
          <span className="text-xs text-gray-300">Taille</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-red-400/30">
          <span className="material-symbols-outlined text-red-400 text-sm">bug_report</span>
          <span className="text-xs text-gray-300">Parasites</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-purple-400/30">
          <span className="material-symbols-outlined text-purple-400 text-sm">science</span>
          <span className="text-xs text-gray-300">pH</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card backdrop-blur-xl rounded-full border border-[#2AD368]/30">
          <span className="material-symbols-outlined text-[#2AD368] text-sm">agriculture</span>
          <span className="text-xs text-gray-300">Récolte</span>
        </div>
      </div>

      {/* Calendrier mensuel */}
      <div className="glass-card backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2AD368] text-xl md:text-2xl">calendar_month</span>
            <span className="truncate">{months[selectedMonth]} {selectedYear}</span>
          </h3>
          <div className="flex gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
              className="size-8 md:size-10 glass-card backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <span className="material-symbols-outlined text-lg md:text-xl">chevron_left</span>
            </button>
            <button
              onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
              className="size-8 md:size-10 glass-card backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
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
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((day, index) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isToday = day === today && selectedMonth === currentMonth;
            
            return (
              <div
                key={index}
                className={`min-h-[60px] md:min-h-[80px] p-1 md:p-2 rounded-lg md:rounded-xl transition-all relative ${
                  day === null
                    ? ''
                    : isToday
                    ? 'bg-[#2AD368]/20 border-2 border-[#2AD368]'
                    : 'bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-xs md:text-sm font-bold mb-0.5 md:mb-1 ${
                      isToday ? 'text-[#2AD368]' : 'text-white'
                    }`}>
                      {day}
                    </div>
                    
                    {/* Tâches du jour - badges compacts */}
                    <div className="flex flex-wrap gap-0.5 md:gap-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`${getTaskBgColor(task.type)} size-4 md:size-5 rounded flex items-center justify-center text-[10px] md:text-xs shadow-sm hover:scale-110 transition-transform cursor-pointer`}
                          title={`${task.plant.name} - ${task.description}`}
                        >
                          {getTaskIcon(task.type)}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="size-4 md:size-5 rounded bg-[#2AD368] flex items-center justify-center text-[8px] md:text-[9px] font-bold text-[#121A21]">
                          +{dayTasks.length - 3}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Saisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
