export function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          👋 Welcome Back
        </h1>

        <p className="mt-2 text-slate-400">
          Continue your AI learning journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">

        <div className="glass rounded-3xl p-5">
          <h3 className="text-slate-400">🔥 Streak</h3>
          <p className="mt-3 text-3xl font-bold text-white">
            18 Days
          </p>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-slate-400">⭐ Level</h3>
          <p className="mt-3 text-3xl font-bold text-white">
            Scholar
          </p>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-slate-400">🏆 XP</h3>
          <p className="mt-3 text-3xl font-bold text-white">
            2450
          </p>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-slate-400">📚 Completed</h3>
          <p className="mt-3 text-3xl font-bold text-white">
            34 Lessons
          </p>
        </div>

      </div>

      {/* Continue Learning */}

      <div className="glass mt-8 rounded-3xl p-6">

        <h2 className="text-2xl font-semibold text-white">
          Continue Learning
        </h2>

        <div className="mt-6">

          <div className="flex justify-between">
            <span className="text-white">
              Physics • Newton's Laws
            </span>

            <span className="text-blue-400">
              72%
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700">

            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"></div>

          </div>

        </div>

      </div>

      {/* Quick AI */}

      <div className="mt-8">

        <h2 className="mb-5 text-2xl font-semibold text-white">
          ⚡ Quick AI
        </h2>

        <div className="grid gap-4 md:grid-cols-4">

          {[
            "🤖 AI Tutor",
            "📄 Notes",
            "📝 Quiz",
            "🃏 Flashcards",
            "🧮 Solve",
            "📷 Scan",
            "🎤 Voice",
            "📅 Planner"
          ].map((tool) => (

            <button
              key={tool}
              className="glass rounded-2xl p-5 text-lg text-white transition hover:scale-105"
            >
              {tool}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}
