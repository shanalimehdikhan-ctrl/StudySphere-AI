import type { GenerateParams, GenerateResult } from '@/types';
import { getAction, buildPrompt } from '@/config/actions';

/**
 * Generates a study response for the given action + topic.
 *
 * Wired to the Gemini API through a Supabase Edge Function proxy that keeps
 * the API key server-side.
 */
export async function generateStudyContent(
  params: GenerateParams,
): Promise<GenerateResult> {
  const action = getAction(params.action);
  const prompt = buildPrompt(action, params.topic.trim());

  const text = await callGemini(prompt);
  return { text };
}

export interface PlannerParams {
  subject: string;
  examDate: string;
  notes?: string;
}

/**
 * Generates an AI study plan for a subject leading up to an exam date.
 */
export async function generateStudyPlan(
  params: PlannerParams,
): Promise<GenerateResult> {
  const action = getAction('planner');
  const today = new Date().toISOString().slice(0, 10);
  const prompt = action.promptTemplate
    .replace('{{subject}}', params.subject)
    .replace('{{examDate}}', params.examDate)
    .replace('{{todayDate}}', today)
    .replace('{{topic}}', params.notes?.trim() || 'None');

  const text = await callGemini(prompt);
  return { text };
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Request failed (${response.status}). ${errorBody || 'Please try again.'}`,
    );
  }

  const data = (await response.json()) as { text?: string };
  if (!data.text) {
    throw new Error('No response was returned. Please try again.');
  }
  return data.text;
}
