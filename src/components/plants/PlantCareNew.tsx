import React, { useState, useEffect } from 'react';
import { plantService } from '../../services/api';

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

const PlantCareNew: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'today' | 'upcoming'>('today');
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await plantService.getAllTasks({ completed: 'false' });
        const tasksList = response.data || [];
        setTasks(tasksList);
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const upcomingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > today.getTime();
  });

  const displayedTasks = currentTab === 'today' ? todayTasks : upcomingTasks;

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      if (currentCompleted) {
        await plantService.uncompleteTask(taskId);
      } else {
        await plantService.completeTask(taskId);
      }
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !currentCompleted } : task
        )
      );
    } catch (err) {
      console.error('Erreur toggle tâche:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'WATERING': return 'water_drop';
      case 'FERTILIZING': return 'grass';
      case 'PRUNING': return 'content_cut';
      case 'PEST_CONTROL': return 'bug_report';
      default: return 'task_alt';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'WATERING': return 'text-blue-400';
      case 'FERTILIZING': return 'text-[#CBED62]';
      case 'PRUNING': return 'text-orange-400';
      case 'PEST_CONTROL': return 'text-red-400';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Soins & Rappels</h2>
        <p className="text-[var(--text-secondary)]">
          {todayTasks.length} tâche{todayTasks.length > 1 ? 's' : ''} pour aujourd'hui
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCurrentTab('today')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            currentTab === 'today'
              ? 'bg-[#2AD368] text-[#121A21]'
              : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
          }`}
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => setCurrentTab('upcoming')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            currentTab === 'upcoming'
              ? 'bg-[#2AD368] text-[#121A21]'
              : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
          }`}
        >
          À venir
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="size-12 border-4 border-[#2AD368] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-red-500/20 bg-red-500/10 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && (
        <div className="space-y-3">
          {displayedTasks.length === 0 ? (
            <div className="glass-card backdrop-blur-xl rounded-2xl p-8 border border-[var(--border-color)] text-center">
              <span className="material-symbols-outlined text-[var(--text-tertiary)] text-5xl mb-3">check_circle</span>
              <p className="text-[var(--text-secondary)]">
                {currentTab === 'today' ? 'Aucune tâche pour aujourd\'hui !' : 'Aucune tâche à venir'}
              </p>
            </div>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="size-5 md:size-6 rounded-lg border-2 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center hover:border-[#2AD368] transition-all flex-shrink-0"
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-[#2AD368] text-base md:text-lg">check</span>
                    )}
                  </button>

                  {/* Plant Image */}
                  <div className="size-10 md:size-12 rounded-xl overflow-hidden bg-[#1a1f26] flex items-center justify-center flex-shrink-0">
                    {task.plant.imageUrl ? (
                      <img src={task.plant.imageUrl} alt={task.plant.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl md:text-2xl">{task.plant.iconEmoji || '🌱'}</span>
                    )}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                      <span className={`material-symbols-outlined text-base md:text-lg ${getTaskColor(task.type)}`}>
                        {getTaskIcon(task.type)}
                      </span>
                      <h4 className="text-sm md:text-base text-[var(--text-primary)] font-semibold truncate">{task.plant.name}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate">{task.description}</p>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sections de conseils (en bas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Arrosage */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-2xl">water_drop</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Arrosage</h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            Maintenez un niveau d'humidité optimal pour chaque type de plante.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Vérifiez l'humidité du sol avant d'arroser</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Arrosez tôt le matin ou en fin de journée</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Évitez l'eau stagnante dans les soucoupes</span>
            </li>
          </ul>
        </div>

        {/* Lumière */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-400 text-2xl">light_mode</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Lumière</h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            Assurez un éclairage adapté aux besoins de vos cultures.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>6-8h de lumière directe pour la plupart des légumes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Utilisez des lampes LED pour compléter</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Tournez les plantes pour une croissance uniforme</span>
            </li>
          </ul>
        </div>

        {/* Température */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl">thermostat</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Température</h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            Maintenez une température stable pour une croissance optimale.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>18-24°C pour la plupart des légumes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Évitez les variations brusques</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Ventilez régulièrement la serre</span>
            </li>
          </ul>
        </div>

        {/* Nutriments */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-400 text-2xl">science</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Nutriments</h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            Fournissez les nutriments essentiels pour une croissance saine.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>NPK équilibré pour la croissance végétative</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Augmentez le phosphore pour la floraison</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Surveillez le pH du sol (6.0-7.0)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Section tâches */}
      <div className="mt-6 glass-card backdrop-blur-xl rounded-3xl p-6 border border-[var(--border-color)]">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#CBED62]">checklist</span>
          Tâches de maintenance
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--bg-primary)] dark:bg-background-dark:bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-[var(--text-tertiary)] uppercase font-bold mb-2">Quotidien</p>
            <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
              <li>• Vérifier l'humidité</li>
              <li>• Observer les plantes</li>
              <li>• Aérer la serre</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--bg-primary)] dark:bg-background-dark:bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-[var(--text-tertiary)] uppercase font-bold mb-2">Hebdomadaire</p>
            <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
              <li>• Fertiliser les plantes</li>
              <li>• Tailler si nécessaire</li>
              <li>• Nettoyer les feuilles</li>
            </ul>
          </div>
          <div className="p-4 bg-[var(--bg-primary)] dark:bg-background-dark:bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-[var(--text-tertiary)] uppercase font-bold mb-2">Mensuel</p>
            <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
              <li>• Vérifier le système</li>
              <li>• Rempoter si besoin</li>
              <li>• Nettoyer la serre</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCareNew;
