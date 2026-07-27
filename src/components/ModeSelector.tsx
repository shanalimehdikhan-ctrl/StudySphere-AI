import { ACTIONS } from '@/config/actions';
import type { ActionId } from '@/types';

interface ModeSelectorProps {
  activeAction: ActionId;
  loading: boolean;
  onSelect: (id: ActionId) => void;
  onOpenPlanner: () => void;
}

export function ModeSelector({
  activeAction,
  loading,
  onSelect,
  onOpenPlanner,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        const active = activeAction === action.id;
        const isPlanner = action.id === 'planner';

        return (
          <button
            key={action.id}
            type="button"
            disabled={loading}
            onClick={() =>
              isPlanner ? onOpenPlanner() : onSelect(action.id)
            }
            className={[
              'group flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-md shadow-indigo-500/20'
                : 'glass text-slate-300 hover:text-white hover:bg-white/[0.08]',
            ].join(' ')}
          >
            <Icon className="h-3.5 w-3.5" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
