import { Sparkles, Trash2, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  hasMessages: boolean;
  onOpenTools: () => void;
}

export function Header({ onNewChat, hasMessages, onOpenTools }: HeaderProps) {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="gradient-border flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
          <Sparkles className="h-4 w-4 text-indigo-300" />
        </div>
        <span className="text-base font-semibold tracking-tight text-white">
          StudySphere <span className="gradient-text">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenTools}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Study Tools</span>
        </button>

        {hasMessages && (
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        )}
      </div>
    </header>
  );
}
