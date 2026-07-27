import { supabase } from './supabase';

export interface StudyPlan {
  id: string;
  subject: string;
  exam_date: string;
  plan_text: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface FavoriteFlashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  created_at: string;
}

/* ---------- Study plans ---------- */

export async function fetchStudyPlans(): Promise<StudyPlan[]> {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertStudyPlan(
  plan: Omit<StudyPlan, 'id' | 'created_at'>,
): Promise<StudyPlan> {
  const { data, error } = await supabase
    .from('study_plans')
    .insert(plan)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStudyPlan(id: string): Promise<void> {
  const { error } = await supabase.from('study_plans').delete().eq('id', id);
  if (error) throw error;
}

/* ---------- Study sessions ---------- */

export async function fetchStudySessions(): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertStudySession(
  session: Omit<StudySession, 'id' | 'created_at' | 'completed'>,
): Promise<StudySession> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({ ...session, completed: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStudySession(id: string): Promise<void> {
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/* ---------- Favorite flashcards ---------- */

export async function fetchFavoriteFlashcards(): Promise<FavoriteFlashcard[]> {
  const { data, error } = await supabase
    .from('favorite_flashcards')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertFavoriteFlashcard(
  card: Omit<FavoriteFlashcard, 'id' | 'created_at'>,
): Promise<FavoriteFlashcard> {
  const { data, error } = await supabase
    .from('favorite_flashcards')
    .insert(card)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFavoriteFlashcard(id: string): Promise<void> {
  const { error } = await supabase
    .from('favorite_flashcards')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
