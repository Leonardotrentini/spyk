-- Schema completo para AdLib Monitor
-- Baseado no briefing do Google Studio

-- 1. Tabela de Bibliotecas (LibraryEntry)
CREATE TABLE IF NOT EXISTS library_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  landing_page_url TEXT,
  active_ads_count INTEGER DEFAULT 0,
  niche TEXT,
  status TEXT NOT NULL DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'paused', 'archived')),
  traffic_estimate TEXT,
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Quadros/Boards
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('system', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Relação Many-to-Many: LibraryEntry <-> Board
CREATE TABLE IF NOT EXISTS library_board_relations (
  library_id UUID REFERENCES library_entries(id) ON DELETE CASCADE,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  PRIMARY KEY (library_id, board_id)
);

-- 4. Tabela de Nichos (NicheOption)
CREATE TABLE IF NOT EXISTS niche_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  color TEXT NOT NULL, -- Classe CSS ou código hex
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, label)
);

-- 5. Tabela de Tarefas Kanban
CREATE TABLE IF NOT EXISTS kanban_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_library_entries_user_id ON library_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_library_entries_status ON library_entries(status);
CREATE INDEX IF NOT EXISTS idx_library_entries_niche ON library_entries(niche);
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_user_id ON kanban_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_status ON kanban_tasks(status);

-- RLS (Row Level Security) - Permitir acesso apenas aos próprios dados
ALTER TABLE library_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_board_relations ENABLE ROW LEVEL SECURITY;

-- Policies para library_entries
CREATE POLICY "Users can view own library entries" ON library_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own library entries" ON library_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library entries" ON library_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own library entries" ON library_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para boards
CREATE POLICY "Users can view own boards" ON boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards" ON boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards" ON boards
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para niche_options
CREATE POLICY "Users can view own niches" ON niche_options
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own niches" ON niche_options
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own niches" ON niche_options
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own niches" ON niche_options
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para kanban_tasks
CREATE POLICY "Users can view own tasks" ON kanban_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON kanban_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON kanban_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON kanban_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para library_board_relations
CREATE POLICY "Users can manage own library board relations" ON library_board_relations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM library_entries 
      WHERE library_entries.id = library_board_relations.library_id 
      AND library_entries.user_id = auth.uid()
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_library_entries_updated_at 
  BEFORE UPDATE ON library_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanban_tasks_updated_at 
  BEFORE UPDATE ON kanban_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


