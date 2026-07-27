import { useEffect, useState } from 'react';
import { CalendarClock, Loader2, Trash2, Sparkles } from 'lucide-react';
import { SUBJECTS } from '@/config/subjects';
import { generateStudyPlan } from '@/lib/ai';
import {
  fetchStudyPlans,
  insertStudyPlan,
  deleteStudyPlan,
  type StudyPlan,
} from '@/lib/study';
import { Markdown } from './Markdown';

export function StudyPlanner() {
  const [subject, setSubject] = useState(SUBJECTS[0].label);
  const [examDate, setExamDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        setPlans(await fetchStudyPlans());
      } catch {
        /* ignore load errors */
      }
    })();
  }, []);

  async function handleGenerate() {
    if (!examDate || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateStudyPlan({
        subject,
        examDate,
        notes,
      });
      const saved = await insertStudyPlan({
        subject,
        exam_date: examDate,
        plan_text: result.text,
      });
      setPlans((prev) => [saved, ...prev]);
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteStudyPlan(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <CalendarClock className="h-5 w-5 text-indigo-300" />
          AI Study Planner
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Enter your exam date and let AI build a daily study plan for you.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.label} className="bg-[#0a0a1a]">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Exam date
          </label>
          <input
            type="date"
            min={today}
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Additional notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Focus on mechanics and electricity…"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!examDate || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating plan…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Study Plan
            </>
          )}
        </button>
      </div>

      {plans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Your plans</h3>
          {plans.map((plan) => (
            <div key={plan.id} className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-200">
                    {plan.subject}
                  </span>
                  <span className="text-xs text-slate-400">
                    Exam: {plan.exam_date}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                  aria-label="Delete plan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <Markdown content={plan.plan_text} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
