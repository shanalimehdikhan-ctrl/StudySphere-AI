import {
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Calculator,
  CalendarClock,
} from 'lucide-react';
import type { ActionConfig } from '@/types';

export const ACTIONS: ActionConfig[] = [
  {
    id: 'explain',
    label: 'Explain Topic',
    description: 'Clear, structured explanation',
    icon: BookOpen,
    promptTemplate:
      'You are an expert tutor. Explain the following topic in a clear, well-structured way for a student. Use headings, bullet points, and examples where helpful.\n\nTopic: {{topic}}',
  },
  {
    id: 'notes',
    label: 'Generate Notes',
    description: 'Concise study notes',
    icon: FileText,
    promptTemplate:
      'You are an expert educator. Generate concise, well-organized study notes for the following topic. Use headings and bullet points. Highlight key terms.\n\nTopic: {{topic}}',
  },
  {
    id: 'quiz',
    label: 'Generate Quiz',
    description: 'Practice questions & answers',
    icon: HelpCircle,
    promptTemplate:
      'You are an expert quiz creator. Create a short quiz (5 questions) about the following topic. Use a mix of multiple-choice and short-answer questions. Provide an answer key at the end.\n\nTopic: {{topic}}',
  },
  {
    id: 'flashcards',
    label: 'Generate Flashcards',
    description: 'Q&A flashcard pairs',
    icon: Layers,
    promptTemplate:
      'You are an expert study coach. Generate 8 flashcards for the following topic. Format each card as:\n\nCard N:\nFront: <question>\nBack: <answer>\n\nTopic: {{topic}}',
  },
  {
    id: 'solve',
    label: 'Solve Problem',
    description: 'Step-by-step solution',
    icon: Calculator,
    promptTemplate:
      'You are an expert problem solver. Solve the following problem step by step, explaining each step clearly. State the final answer explicitly at the end.\n\nProblem: {{topic}}',
  },
  {
    id: 'planner',
    label: 'Study Planner',
    description: 'AI daily study plan',
    icon: CalendarClock,
    promptTemplate:
      'You are an expert study planner. Create a detailed day-by-day study plan for the following subject leading up to the exam date. Break the plan into daily tasks with topics and time allocations. Use Markdown headings for each day and bullet points for tasks. Start with a brief overview, then list each day.\n\nSubject: {{subject}}\nExam date: {{examDate}}\nToday\'s date: {{todayDate}}\nAdditional notes: {{topic}}',
  },
];

export function getAction(id: ActionConfig['id']): ActionConfig {
  const action = ACTIONS.find((a) => a.id === id);
  if (!action) throw new Error(`Unknown action: ${id}`);
  return action;
}

export function buildPrompt(action: ActionConfig, topic: string): string {
  return `
${action.promptTemplate.replace('{{topic}}', topic)}

${MATH_FORMATTING_RULES}
`;
}
const MATH_FORMATTING_RULES = `
Formatting Rules:
- Respond in valid Markdown.
- Use Markdown headings (#, ##, ###) and bullet points where appropriate.
- For ALL standalone mathematical equations, use display LaTeX:
  $$ ... $$
- For inline mathematical expressions, use:
  $ ... $
- Never leave unmatched $, $$, \\(, \\), \\[, or \\].
- Ensure every fraction, square root, integral, summation, matrix and equation is valid LaTeX.
- Never output incomplete LaTeX syntax.
- Put each display equation on its own line.
`;