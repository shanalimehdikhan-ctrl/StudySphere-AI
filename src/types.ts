import type { LucideIcon } from 'lucide-react';

export type ActionId =
  | 'explain'
  | 'notes'
  | 'quiz'
  | 'flashcards'
  | 'solve'
  | 'planner';

export interface ActionConfig {
  id: ActionId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Prompt template; {{topic}} is replaced with the user's input. */
  promptTemplate: string;
}

export interface GenerateParams {
  action: ActionId;
  topic: string;
}

export interface GenerateResult {
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actionLabel?: string | null;
  error?: string | null;
  loading?: boolean;
}
