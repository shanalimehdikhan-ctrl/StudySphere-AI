import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import type { ActionId } from '@/types';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  activeAction: ActionId;
  onActionChange: (id: ActionId) => void;
  onOpenPlanner: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  loading,
  activeAction,
  onActionChange,
  onOpenPlanner,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize the textarea up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) {
        onSubmit();
      }
    }
  }

  const canSend = value.trim().length > 0 && !loading;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
      <div className="mb-3">
        <ModeSelector
          activeAction={activeAction}
          loading={loading}
          onSelect={onActionChange}
          onOpenPlanner={onOpenPlanner}
        />
      </div>

      <div
        className={[
          'glass gradient-border relative rounded-3xl p-1.5 transition-shadow duration-300',
          isFocused ? 'shadow-lg shadow-indigo-500/20' : '',
        ].join(' ')}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            placeholder="Ask anything — a topic to explain, a problem to solve…"
            className="max-h-[200px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSend}
            className={[
              'mb-1 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200',
              canSend
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md shadow-indigo-500/30 hover:scale-105'
                : 'bg-white/5 text-slate-500',
            ].join(' ')}
            aria-label={loading ? 'Stop generating' : 'Send message'}
          >
            {loading ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-slate-600">
        StudySphere AI can make mistakes. Always verify important information.
      </p>
    </div>
  );
}
