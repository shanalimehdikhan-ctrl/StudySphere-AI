import { useEffect, useState } from 'react';
import { X, CalendarClock, TrendingUp, Layers } from 'lucide-react';
import { SUBJECTS } from '@/config/subjects';
import { StudyPlanner } from './StudyPlanner';
import { ProgressTracker } from './ProgressTracker';
import { FavoriteFlashcards } from './FavoriteFlashcards';

interface FeaturesDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'planner' | 'progress' | 'flashcards';

const TABS: { id: Tab; label: string; icon: typeof CalendarClock }[] = [
  { id: 'planner', label: 'Planner', icon: CalendarClock },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
];

export function FeaturesDrawer({ open, onClose }: FeaturesDrawerProps) {
  const [tab, setTab] = useState<Tab>('planner');

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={[
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col',
          'glass border-l border-white/10 transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-label="Study tools"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-white">
              Study Tools
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject category strip */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 px-5 py-3">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 px-5 py-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                    : 'text-slate-400 hover:text-white',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === 'planner' && <StudyPlanner />}
          {tab === 'progress' && <ProgressTracker />}
          {tab === 'flashcards' && <FavoriteFlashcards />}
        </div>
      </aside>
    </>
  );
}
