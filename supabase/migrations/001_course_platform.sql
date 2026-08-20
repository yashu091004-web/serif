-- ============================================================
-- 001_course_platform.sql
-- Serif Course Platform — Full Schema + RLS
-- ============================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. COURSES
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  instructor_avatar TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_select_public" ON courses FOR SELECT USING (true);

-- 3. MODULES
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules_select_public" ON modules FOR SELECT USING (true);

-- 4. LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INT DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_select_public" ON lessons FOR SELECT USING (true);

-- 5. LESSON COMPLETIONS
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "completions_select_own" ON lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "completions_insert_own" ON lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "completions_delete_own" ON lesson_completions FOR DELETE USING (auth.uid() = user_id);

-- 6. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_select_public" ON announcements FOR SELECT USING (true);

-- 7. GUIDES
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT DEFAULT 'general',
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guides_select_public" ON guides FOR SELECT USING (true);

-- 8. DISCUSSIONS
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discussions_select_public" ON discussions FOR SELECT USING (true);
CREATE POLICY "discussions_insert_auth" ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "discussions_update_own" ON discussions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "discussions_delete_own" ON discussions FOR DELETE USING (auth.uid() = author_id);

-- 9. COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_public" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_auth" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_update_own" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "comments_delete_own" ON comments FOR DELETE USING (auth.uid() = author_id);

-- 10. REACTIONS
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'comment')),
  reaction_type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_id, target_type)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions_select_public" ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert_auth" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete_own" ON reactions FOR DELETE USING (auth.uid() = user_id);
