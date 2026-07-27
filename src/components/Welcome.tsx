import { ACTIONS } from '@/config/actions';
import type { ActionId } from '@/types';

interface WelcomeProps {
  onPickSuggestion: (topic: string, action: ActionId) => void;
  onOpenPlanner: () => void;
}

const SUGGESTIONS: { topic: string; action: ActionId }[] = [
  { topic: 'Explain the water cycle', action: 'explain' },
  { topic: 'Notes on photosynthesis', action: 'notes' },
  { topic: 'Quiz me on World War II', action: 'quiz' },
  { topic: 'Flashcards for the human heart', action: 'flashcards' },
  { topic: 'Solve: 2x + 5 = 15', action: 'solve' },
  { topic: 'Explain quantum entanglement', action: 'explain' },
];

export function Welcome({ onPickSuggestion, onOpenPlanner }: WelcomeProps) {
  const actionLabel = (id: ActionId) =>
    ACTIONS.find((a) => a.id === id)?.label ?? '';

  return (
    <div className="animate-fade-up flex flex-col items-center px-6 pt-10 text-center sm:pt-16">
      <div className="gradient-border mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <span className="text-3xl">✦</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Welcome to <span className="gradient-text">StudySphere AI</span>
      </h1>
      <p className="mt-3 text-base text-slate-400">
        Learn Smarter with AI — your personal study companion for explanations,
        notes, quizzes, flashcards, and step-by-step solutions.
      </p>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.topic}
            type="button"
            onClick={() => onPickSuggestion(s.topic, s.action)}
            className="glass group rounded-2xl p-4 text-left transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-0.5"
          >
            <div className="text-xs font-medium text-indigo-300/80">
              {actionLabel(s.action)}
            </div>
            <div className="mt-1 text-sm text-slate-200 group-hover:text-white">
              {s.topic}
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenPlanner}
        className="glass mt-6 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-0.5"
      >
        <span className="text-base">📅</span>
        Plan your study schedule with the AI Study Planner
      </button>
    </div>
  );
}
