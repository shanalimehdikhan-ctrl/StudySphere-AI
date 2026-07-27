import {
  Atom,
  FlaskConical,
  Leaf,
  Sigma,
  Code2,
  type LucideIcon,
} from 'lucide-react';

export interface SubjectCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
}

export const SUBJECTS: SubjectCategory[] = [
  {
    id: 'physics',
    label: 'Physics',
    icon: Atom,
    accent: 'from-sky-500 to-blue-500',
  },
  {
    id: 'chemistry',
    label: 'Chemistry',
    icon: FlaskConical,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'biology',
    label: 'Biology',
    icon: Leaf,
    accent: 'from-green-500 to-lime-500',
  },
  {
    id: 'math',
    label: 'Math',
    icon: Sigma,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    id: 'computer-science',
    label: 'Computer Science',
    icon: Code2,
    accent: 'from-indigo-500 to-purple-500',
  },
];

export const SUBJECT_LABELS = SUBJECTS.map((s) => s.label);

export function getSubjectByLabel(label: string): SubjectCategory | undefined {
  return SUBJECTS.find((s) => s.label === label);
}
