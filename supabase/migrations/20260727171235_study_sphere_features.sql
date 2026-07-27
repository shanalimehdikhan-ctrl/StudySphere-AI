/*
# StudySphere AI — Study planner, sessions, and favorite flashcards

This migration adds three tables that power the new StudySphere AI features.
The app has no sign-in screen, so it operates as a single-tenant app using the
anon key. All policies allow `anon, authenticated` because the data is
intentionally shared/public within this single-tenant app.

1. New Tables

- `study_plans`
  - `id` (uuid, primary key)
  - `subject` (text, not null) — one of: Physics, Chemistry, Biology, Math, Computer Science
  - `exam_date` (date, not null) — the user's target exam date
  - `plan_text` (text, not null) — the AI-generated daily study plan
  - `created_at` (timestamptz, default now)

- `study_sessions`
  - `id` (uuid, primary key)
  - `subject` (text, not null) — the subject studied
  - `topic` (text, not null) — what was studied
  - `duration_minutes` (integer, not null, default 0) — session length
  - `completed` (boolean, not null, default true) — whether the session is done
  - `created_at` (timestamptz, default now)

- `favorite_flashcards`
  - `id` (uuid, primary key)
  - `subject` (text, not null) — subject category
  - `front` (text, not null) — question side
  - `back` (text, not null) — answer side
  - `created_at` (timestamptz, default now)

2. Security
  - RLS enabled on all three tables.
  - All four CRUD policies per table scoped to `TO anon, authenticated` with
    `USING (true)` / `WITH CHECK (true)` because this is a single-tenant,
    no-auth app where the data is intentionally public/shared.

3. Important Notes
  1. No `user_id` columns — the app has no sign-in flow.
  2. Tables are idempotent (IF NOT EXISTS).
  3. Policies are dropped before recreate to stay idempotent.
*/

CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  exam_date date NOT NULL,
  plan_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_study_plans" ON study_plans;
CREATE POLICY "anon_select_study_plans" ON study_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_study_plans" ON study_plans;
CREATE POLICY "anon_insert_study_plans" ON study_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_study_plans" ON study_plans;
CREATE POLICY "anon_update_study_plans" ON study_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_study_plans" ON study_plans;
CREATE POLICY "anon_delete_study_plans" ON study_plans FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  topic text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_study_sessions" ON study_sessions;
CREATE POLICY "anon_select_study_sessions" ON study_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_study_sessions" ON study_sessions;
CREATE POLICY "anon_insert_study_sessions" ON study_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_study_sessions" ON study_sessions;
CREATE POLICY "anon_update_study_sessions" ON study_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_study_sessions" ON study_sessions;
CREATE POLICY "anon_delete_study_sessions" ON study_sessions FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS favorite_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorite_flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_favorite_flashcards" ON favorite_flashcards;
CREATE POLICY "anon_select_favorite_flashcards" ON favorite_flashcards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_favorite_flashcards" ON favorite_flashcards;
CREATE POLICY "anon_insert_favorite_flashcards" ON favorite_flashcards FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_favorite_flashcards" ON favorite_flashcards;
CREATE POLICY "anon_update_favorite_flashcards" ON favorite_flashcards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_favorite_flashcards" ON favorite_flashcards;
CREATE POLICY "anon_delete_favorite_flashcards" ON favorite_flashcards FOR DELETE
  TO anon, authenticated USING (true);
