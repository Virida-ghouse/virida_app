import React, { useState, useEffect, useRef } from 'react';
import { plantService } from '../../../services/api';

interface TaskNotification {
  id: string;
  plantName: string;
  plantId: string;
  type: string;
  description: string;
  dueDate: string;
  priority: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
}

interface NotificationMenuProps {
  onNotificationClick?: () => void;
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({ onNotificationClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

      const data = await plantService.getAllTasks({ completed: 'false' });
      const tasks = data.data || [];

      const processed: TaskNotification[] = tasks.map((task: any) => {
        const d = new Date(task.dueDate); d.setHours(0, 0, 0, 0);
        return {
          id: task.id, plantName: task.plant?.name || 'Plante', plantId: task.plantId,
          type: task.type, description: task.description, dueDate: task.dueDate,
          priority: task.priority,
          isOverdue: d < today, isToday: d.getTime() === today.getTime(), isTomorrow: d.getTime() === tomorrow.getTime(),
        };
      });

      processed.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
        const p: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (p[a.priority] || 1) - (p[b.priority] || 1);
      });
      setNotifications(processed);
    } catch (error) {
      console.error('Erreur notifications:', error);
    } finally { setLoading(false); }
  };

  const getIcon = (type: string) => {
    const m: Record<string, [string, string]> = {
      WATERING: ['water_drop', 'text-blue-400'], FERTILIZING: ['grass', 'text-[#2AD368]'],
      PRUNING: ['content_cut', 'text-orange-400'], PEST_CONTROL: ['bug_report', 'text-red-400'],
      HARVESTING: ['agriculture', 'text-[#CBED62]'], REPOTTING: ['potted_plant', 'text-purple-400'],
      PH_ADJUSTMENT: ['science', 'text-cyan-400'],
    };
    const [icon, color] = m[type] || m.WATERING;
    return <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>;
  };

  const getLabel = (type: string) => {
    const l: Record<string, string> = {
      WATERING: 'Arrosage', FERTILIZING: 'Fertilisation', PRUNING: 'Taille',
      PEST_CONTROL: 'Parasites', HARVESTING: 'Récolte', REPOTTING: 'Rempotage', PH_ADJUSTMENT: 'pH',
    };
    return l[type] || type;
  };

  const getBadge = (n: TaskNotification) => {
    if (n.isOverdue) return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-500">Retard</span>;
    if (n.isToday) return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/15 text-blue-500">Auj.</span>;
    if (n.isTomorrow) return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/15 text-orange-400">Demain</span>;
    return null;
  };

  const urgentCount = notifications.filter((n) => n.isOverdue || n.isToday).length;
  const displayed = notifications.slice(0, 8);
  const remaining = notifications.length - displayed.length;

  return (
    <div className="relative" ref={menuRef}>
      {/* Button — same style as theme toggle in header */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="size-9 md:size-10 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] flex items-center justify-center hover:border-[#2AD368]/30 transition-all group relative"
      >
        <span className="material-symbols-outlined text-lg md:text-xl text-[var(--text-secondary)] group-hover:text-[#2AD368] transition-colors">
          notifications
        </span>
        {urgentCount > 0 && (
          <span className="absolute -top-1 -right-1 size-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[var(--bg-secondary)]">
            {urgentCount > 9 ? '9+' : urgentCount}
          </span>
        )}
      </button>

      {/* Dropdown — matches user menu style */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-[101] bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
                <p className="text-[11px] text-[var(--text-secondary)]">{notifications.length} tâche{notifications.length !== 1 ? 's' : ''} en attente</p>
              </div>
              {urgentCount > 0 && (
                <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-[11px] font-bold">{urgentCount} urgent{urgentCount > 1 ? 'es' : 'e'}</span>
              )}
            </div>

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="size-6 border-2 border-[var(--border-color)] border-t-[#2AD368] rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="material-symbols-outlined text-3xl text-[var(--text-secondary)] opacity-30 mb-1 block">check_circle</span>
                  <p className="text-sm text-[var(--text-secondary)]">Tout est à jour</p>
                </div>
              ) : (
                <div className="py-1">
                  {displayed.map((n) => (
                    <div key={n.id} onClick={() => { onNotificationClick?.(); setIsOpen(false); }} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--bg-primary)] transition-colors cursor-pointer group/item">
                      <div className="size-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center flex-shrink-0 group-hover/item:border-[#2AD368]/30 transition-colors">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{n.plantName}</span>
                          {getBadge(n)}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{getLabel(n.type)} — {n.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {remaining > 0 && (
              <div className="px-4 py-2.5 border-t border-[var(--border-color)] text-center">
                <p className="text-[11px] text-[var(--text-secondary)]">
                  + {remaining} autre{remaining > 1 ? 's' : ''} tâche{remaining > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
