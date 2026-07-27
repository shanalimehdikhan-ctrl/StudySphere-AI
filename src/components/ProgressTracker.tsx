import { useEffect, useState } from 'react';
import { TrendingUp, Trash2, Plus, Clock } from 'lucide-react';
import { SUBJECTS } from '@/config/subjects';
import {
  fetchStudySessions,
  insertStudySession,
  deleteStudySession,
  type StudySession,
} from '@/lib/study';

export function ProgressTracker() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subject, setSubject] = useState(SUBJECTS[0].label);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('30');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setSessions(await fetchStudySessions());
    } catch {
      /* ignore */
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setError(null);
    try {
      const saved = await insertStudySession({
        subject,
        topic: topic.trim(),
        duration_minutes: Math.max(0, parseInt(duration, 10) || 0),
      });
      setSessions((prev) => [saved, ...prev]);
      setTopic('');
    } catch {
      setError('Could not save the session. Please try again.');
    }
  }

  async function handleDelete(id: string) {
    await deleteStudySession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + s.duration_minutes,
    0,
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Per-subject breakdown for the progress bar.
  const subjectTotals = SUBJECTS.map((s) => ({
    ...s,
    minutes: sessions
      .filter((sess) => sess.subject === s.label)
      .reduce((sum, sess) => sum + sess.duration_minutes, 0),
  }));
  const maxMinutes = Math.max(1, ...subjectTotals.map((s) => s.minutes));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-indigo-300" />
          Study Progress Tracker
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Log completed study sessions and track your progress across subjects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="text-2xl font-bold text-white">{sessions.length}</div>
          <div className="text-xs text-slate-400">Sessions completed</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-2xl font-bold text-white">{totalHours}h</div>
          <div className="text-xs text-slate-400">Total study time</div>
        </div>
      </div>

      {/* Per-subject progress bars */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-300">By subject</h3>
        {subjectTotals.map((s) => {
          const Icon = s.icon;
          const pct = Math.round((s.minutes / maxMinutes) * 100);
          return (
            <div key={s.id} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.accent} text-white`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{s.label}</span>
                  <span className="text-slate-500">{s.minutes} min</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${s.accent} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add session form */}
      <form onSubmit={handleAdd} className="glass rounded-2xl p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Plus className="h-4 w-4" />
          Log a study session
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.label} className="bg-[#0a0a1a]">
                {s.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Minutes"
            />
          </div>
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          placeholder="What did you study? e.g. Newton's laws"
        />
        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Session
        </button>
      </form>

      {/* Session list */}
      {sessions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">
            Recent sessions
          </h3>
          {sessions.map((s) => {
            const subj = SUBJECTS.find((x) => x.label === s.subject);
            return (
              <div
                key={s.id}
                className="glass flex items-center gap-3 rounded-xl p-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${subj?.accent ?? 'from-slate-500 to-slate-600'} text-white`}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-slate-200">
                    {s.topic}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.subject} · {s.duration_minutes} min
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
