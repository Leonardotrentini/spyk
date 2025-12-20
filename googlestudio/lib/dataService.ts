/**
 * Serviço de dados centralizado
 * Gerencia todas as operações com Supabase
 */

import { supabase, getOrCreateUser } from './supabase';
import { LibraryEntry, NicheOption, Board, KanbanTask } from '../types';

// Helper para verificar se Supabase está configurado
function checkSupabaseConfig() {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel Dashboard.');
  }
}

// ===== LIBRARY ENTRIES =====

export async function fetchLibraryEntries(): Promise<LibraryEntry[]> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('library_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Buscar relações com boards para cada entrada
  const entriesWithBoards = await Promise.all(
    (data || []).map(async (entry) => {
      const { data: relations } = await supabase
        .from('library_board_relations')
        .select('board_id')
        .eq('library_id', entry.id);

      return {
        ...entry,
        boardIds: relations?.map((r: any) => r.board_id) || []
      };
    })
  );

  // Transformar dados do Supabase para o formato do frontend
  return entriesWithBoards.map(entry => ({
    id: entry.id,
    url: entry.url,
    brandName: entry.brand_name,
    activeAdsCount: entry.active_ads_count || 0,
    landingPageUrl: entry.landing_page_url || '',
    niche: entry.niche || '',
    status: entry.status as 'monitoring' | 'paused' | 'archived',
    notes: entry.notes || '',
    createdAt: new Date(entry.created_at).getTime(),
    lastChecked: new Date(entry.last_checked).getTime(),
    isFavorite: entry.is_favorite || false,
    boardIds: entry.boardIds || [],
    trafficEstimate: entry.traffic_estimate || undefined,
    isUpdating: false
  }));
}

export async function createLibraryEntry(entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'lastChecked'>): Promise<LibraryEntry> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('library_entries')
    .insert({
      user_id: user.id,
      url: entry.url,
      brand_name: entry.brandName,
      active_ads_count: entry.activeAdsCount,
      landing_page_url: entry.landingPageUrl,
      niche: entry.niche,
      status: entry.status,
      notes: entry.notes || '',
      is_favorite: entry.isFavorite || false,
      traffic_estimate: entry.trafficEstimate || null
    })
    .select()
    .single();

  if (error) throw error;

  // Adicionar relações com boards se houver
  if (entry.boardIds && entry.boardIds.length > 0) {
    await supabase
      .from('library_board_relations')
      .insert(
        entry.boardIds.map(boardId => ({
          library_id: data.id,
          board_id: boardId
        }))
      );
  }

  return {
    id: data.id,
    url: data.url,
    brandName: data.brand_name,
    activeAdsCount: data.active_ads_count || 0,
    landingPageUrl: data.landing_page_url || '',
    niche: data.niche || '',
    status: data.status as 'monitoring' | 'paused' | 'archived',
    notes: data.notes || '',
    createdAt: new Date(data.created_at).getTime(),
    lastChecked: new Date(data.last_checked).getTime(),
    isFavorite: data.is_favorite || false,
    boardIds: entry.boardIds || [],
    trafficEstimate: data.traffic_estimate || undefined,
    isUpdating: false
  };
}

export async function updateLibraryEntry(id: string, updates: Partial<LibraryEntry>): Promise<void> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const updateData: any = {};
  
  if (updates.url !== undefined) updateData.url = updates.url;
  if (updates.brandName !== undefined) updateData.brand_name = updates.brandName;
  if (updates.activeAdsCount !== undefined) updateData.active_ads_count = updates.activeAdsCount;
  if (updates.landingPageUrl !== undefined) updateData.landing_page_url = updates.landingPageUrl;
  if (updates.niche !== undefined) updateData.niche = updates.niche;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
  if (updates.trafficEstimate !== undefined) updateData.traffic_estimate = updates.trafficEstimate;
  if (updates.lastChecked !== undefined) updateData.last_checked = new Date(updates.lastChecked).toISOString();

  const { error } = await supabase
    .from('library_entries')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  // Atualizar relações com boards se necessário
  if (updates.boardIds !== undefined) {
    // Remover todas as relações existentes
    await supabase
      .from('library_board_relations')
      .delete()
      .eq('library_id', id);

    // Adicionar novas relações
    if (updates.boardIds.length > 0) {
      await supabase
        .from('library_board_relations')
        .insert(
          updates.boardIds.map(boardId => ({
            library_id: id,
            board_id: boardId
          }))
        );
    }
  }
}

export async function deleteLibraryEntry(id: string): Promise<void> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('library_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

// ===== NICHES =====

export async function fetchNiches(): Promise<NicheOption[]> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('niche_options')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(niche => ({
    id: niche.id,
    label: niche.label,
    color: niche.color
  }));
}

export async function createNiche(niche: Omit<NicheOption, 'id'>): Promise<NicheOption> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('niche_options')
    .insert({
      user_id: user.id,
      label: niche.label,
      color: niche.color
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    label: data.label,
    color: data.color
  };
}

// ===== BOARDS =====

export async function fetchBoards(): Promise<Board[]> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(board => ({
    id: board.id,
    name: board.name,
    type: board.type as 'system' | 'custom'
  }));
}

export async function createBoard(board: Omit<Board, 'id'>): Promise<Board> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('boards')
    .insert({
      user_id: user.id,
      name: board.name,
      type: board.type
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    type: data.type as 'system' | 'custom'
  };
}

// ===== KANBAN TASKS =====

export async function fetchKanbanTasks(): Promise<KanbanTask[]> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('kanban_tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(task => ({
    id: task.id,
    content: task.content,
    status: task.status as 'todo' | 'doing' | 'done',
    createdAt: new Date(task.created_at).getTime()
  }));
}

export async function createKanbanTask(task: Omit<KanbanTask, 'id' | 'createdAt'>): Promise<KanbanTask> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('kanban_tasks')
    .insert({
      user_id: user.id,
      content: task.content,
      status: task.status
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    content: data.content,
    status: data.status as 'todo' | 'doing' | 'done',
    createdAt: new Date(data.created_at).getTime()
  };
}

export async function updateKanbanTask(id: string, updates: Partial<KanbanTask>): Promise<void> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const updateData: any = {};
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.status !== undefined) updateData.status = updates.status;

  const { error } = await supabase
    .from('kanban_tasks')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function deleteKanbanTask(id: string): Promise<void> {
  checkSupabaseConfig();
  const user = await getOrCreateUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('kanban_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

