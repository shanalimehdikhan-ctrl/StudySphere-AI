import { Sparkles } from 'lucide-react';
import { LoadingDots } from './LoadingDots';
import { Markdown } from './Markdown';
import { CopyButton } from './CopyButton';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  error?: string | null;
  actionLabel?: string | null;
}

export function ChatMessage({
  role,
  content,
  loading,
  error,
  actionLabel,
}: ChatMessageProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="animate-fade-up flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-blue-500 to-purple-500 px-4 py-3 text-sm text-white shadow-lg shadow-indigo-500/20">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex gap-3">
      <div className="gradient-border mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
        <Sparkles className="h-4 w-4 text-indigo-300" />
      </div>
      <div className="min-w-0 flex-1">
        {actionLabel && (
          <div className="mb-1.5 text-xs font-medium text-indigo-300/80">
            {actionLabel}
          </div>
        )}
        {loading ? (
          <div className="glass rounded-2xl rounded-tl-md px-4 py-4">
            <div className="space-y-3">
              <div className="shimmer h-4 w-3/4 rounded" />
              <div className="shimmer h-4 w-full rounded" />
              <div className="shimmer h-4 w-5/6 rounded" />
              <div className="flex items-center gap-3 pt-2">
                <LoadingDots />
                <span className="text-xs text-slate-500">
                  Generating your study content…
                </span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl rounded-tl-md border-rose-500/30 px-4 py-4 text-sm text-rose-200">
            {error}
          </div>
        ) : (
          <div className="glass rounded-2xl rounded-tl-md px-5 py-4">
            <Markdown content={content} />
            <div className="mt-3 border-t border-white/5 pt-3">
              <CopyButton text={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
