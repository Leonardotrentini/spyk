-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Niches table
CREATE TABLE IF NOT EXISTS niches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, label)
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'custom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Library entries table
CREATE TABLE IF NOT EXISTS library_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  niche_id UUID REFERENCES niches(id) ON DELETE SET NULL,
  landing_page_url TEXT,
  active_ads_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'paused', 'archived')),
  traffic_estimate TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_checked TIMESTAMPTZ
);

-- Library entry boards junction table
CREATE TABLE IF NOT EXISTS library_entry_boards (
  library_entry_id UUID NOT NULL REFERENCES library_entries(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (library_entry_id, board_id)
);

-- Kanban tasks table
CREATE TABLE IF NOT EXISTS kanban_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Traffic snapshots table
CREATE TABLE IF NOT EXISTS traffic_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  library_entry_id UUID NOT NULL REFERENCES library_entries(id) ON DELETE CASCADE,
  total_visits TEXT NOT NULL,
  bounce_rate TEXT NOT NULL,
  avg_duration TEXT NOT NULL,
  pages_per_visit TEXT NOT NULL,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Market reports cache table
CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  country TEXT NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, topic, country)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_niches_user_id ON niches(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_type ON boards(type);

CREATE INDEX IF NOT EXISTS idx_library_entries_user_id ON library_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_library_entries_status ON library_entries(status);
CREATE INDEX IF NOT EXISTS idx_library_entries_niche_id ON library_entries(niche_id);
CREATE INDEX IF NOT EXISTS idx_library_entries_created_at_desc ON library_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_entries_active_ads_count_desc ON library_entries(active_ads_count DESC);
CREATE INDEX IF NOT EXISTS idx_library_entries_is_favorite ON library_entries(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_library_entries_last_checked ON library_entries(last_checked) WHERE status = 'monitoring';

CREATE INDEX IF NOT EXISTS idx_library_entry_boards_entry_id ON library_entry_boards(library_entry_id);
CREATE INDEX IF NOT EXISTS idx_library_entry_boards_board_id ON library_entry_boards(board_id);
CREATE INDEX IF NOT EXISTS idx_library_entry_boards_user_id ON library_entry_boards(user_id);

CREATE INDEX IF NOT EXISTS idx_kanban_tasks_user_id ON kanban_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_status ON kanban_tasks(status);

CREATE INDEX IF NOT EXISTS idx_traffic_snapshots_user_id ON traffic_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_traffic_snapshots_library_entry_id ON traffic_snapshots(library_entry_id);
CREATE INDEX IF NOT EXISTS idx_traffic_snapshots_created_at_desc ON traffic_snapshots(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_reports_user_id ON market_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_market_reports_topic_country ON market_reports(topic, country);
CREATE INDEX IF NOT EXISTS idx_market_reports_created_at ON market_reports(created_at);

-- Enable Row Level Security
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_entry_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Owner can do everything
-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can manage own niches" ON niches;
DROP POLICY IF EXISTS "Users can manage own boards" ON boards;
DROP POLICY IF EXISTS "Users can manage own library entries" ON library_entries;
DROP POLICY IF EXISTS "Users can manage own library entry boards" ON library_entry_boards;
DROP POLICY IF EXISTS "Users can manage own kanban tasks" ON kanban_tasks;
DROP POLICY IF EXISTS "Users can manage own traffic snapshots" ON traffic_snapshots;
DROP POLICY IF EXISTS "Users can manage own market reports" ON market_reports;

-- Create policies
CREATE POLICY "Users can manage own niches" ON niches
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own boards" ON boards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own library entries" ON library_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own library entry boards" ON library_entry_boards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own kanban tasks" ON kanban_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own traffic snapshots" ON traffic_snapshots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own market reports" ON market_reports
  FOR ALL USING (auth.uid() = user_id);

