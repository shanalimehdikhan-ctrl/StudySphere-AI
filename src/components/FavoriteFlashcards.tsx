import { useEffect, useState } from 'react';
import { Layers, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { SUBJECTS } from '@/config/subjects';
import {
  fetchFavoriteFlashcards,
  insertFavoriteFlashcard,
  deleteFavoriteFlashcard,
  type FavoriteFlashcard,
} from '@/lib/study';

export function FavoriteFlashcards() {
  const [cards, setCards] = useState<FavoriteFlashcard[]>([]);
  const [subject, setSubject] = useState(SUBJECTS[0].label);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setCards(await fetchFavoriteFlashcards());
    } catch {
      /* ignore */
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setError(null);
    try {
      const saved = await insertFavoriteFlashcard({
        subject,
        front: front.trim(),
        back: back.trim(),
      });
      setCards((prev) => [saved, ...prev]);
      setFront('');
      setBack('');
    } catch {
      setError('Could not save the flashcard. Please try again.');
    }
  }

  async function handleDelete(id: string) {
    await deleteFavoriteFlashcard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Layers className="h-5 w-5 text-indigo-300" />
          Favorite Flashcards
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Save flashcards for quick review. Tap a card to flip it.
        </p>
      </div>

      <form onSubmit={handleAdd} className="glass rounded-2xl p-4 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Plus className="h-4 w-4" />
          Add a flashcard
        </h3>
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
        <input
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          placeholder="Front (question)"
        />
        <input
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          placeholder="Back (answer)"
        />
        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!front.trim() || !back.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Flashcard
        </button>
      </form>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const subj = SUBJECTS.find((x) => x.label === card.subject);
            const Icon = subj?.icon;
            const flipped = flippedId === card.id;
            return (
              <div
                key={card.id}
                className="glass group relative rounded-2xl p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {Icon && <Icon className="h-3 w-3" />}
                    {card.subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(card.id)}
                    className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-rose-500/20 hover:text-rose-300 group-hover:opacity-100"
                    aria-label="Delete flashcard"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setFlippedId(flipped ? null : card.id)}
                  className="block w-full text-left"
                >
                  <div className="mb-1 text-xs font-medium text-indigo-300/70">
                    {flipped ? 'Answer' : 'Question'}
                  </div>
                  <p className="min-h-[3rem] text-sm text-slate-200">
                    {flipped ? card.back : card.front}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    {flipped ? (
                      <>
                        <ChevronUp className="h-3 w-3" /> Show question
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" /> Show answer
                      </>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500">
          No flashcards yet. Add one above to get started.
        </p>
      )}
    </div>
  );
}
