/**
 * Serviço para AdLib Monitor
 * Substitui localStorage por chamadas ao Supabase via API Next.js
 */

import { LibraryEntry, Board, NicheOption, KanbanTask } from '@/types'

const API_BASE = '/api'

// ========== LIBRARIES ==========
export async function fetchLibraries(filters?: {
  niche?: string
  status?: string
  search?: string
  boardId?: string
  isFavorite?: boolean
}): Promise<LibraryEntry[]> {
  const params = new URLSearchParams()
  if (filters?.niche) params.append('niche', filters.niche)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.boardId) params.append('boardId', filters.boardId)
  if (filters?.isFavorite) params.append('isFavorite', 'true')

  const response = await fetch(`${API_BASE}/libraries?${params}`)
  if (!response.ok) throw new Error('Failed to fetch libraries')
  const result = await response.json()
  return result.data || []
}

export async function createLibrary(entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'lastChecked'>): Promise<LibraryEntry> {
  const response = await fetch(`${API_BASE}/libraries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!response.ok) throw new Error('Failed to create library')
  const result = await response.json()
  return result.data
}

export async function updateLibrary(id: string, updates: Partial<LibraryEntry>): Promise<LibraryEntry> {
  const response = await fetch(`${API_BASE}/libraries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update library')
  const result = await response.json()
  return result.data
}

export async function deleteLibrary(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/libraries/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete library')
}

// ========== BOARDS ==========
export async function fetchBoards(): Promise<Board[]> {
  const response = await fetch(`${API_BASE}/boards`)
  if (!response.ok) throw new Error('Failed to fetch boards')
  const result = await response.json()
  return result.data || []
}

export async function createBoard(name: string, type: 'system' | 'custom' = 'custom'): Promise<Board> {
  const response = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type }),
  })
  if (!response.ok) throw new Error('Failed to create board')
  const result = await response.json()
  return result.data
}

// ========== NICHES ==========
export async function fetchNiches(): Promise<NicheOption[]> {
  const response = await fetch(`${API_BASE}/niches`)
  if (!response.ok) throw new Error('Failed to fetch niches')
  const result = await response.json()
  return result.data || []
}

export async function createNiche(label: string, color: string): Promise<NicheOption> {
  const response = await fetch(`${API_BASE}/niches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, color }),
  })
  if (!response.ok) {
    const error = await response.json()
    // Se já existe, buscar e retornar
    if (error.error?.includes('unique')) {
      const niches = await fetchNiches()
      return niches.find(n => n.label.toLowerCase() === label.toLowerCase()) || { id: '', label, color }
    }
    throw new Error('Failed to create niche')
  }
  const result = await response.json()
  return result.data
}

// ========== KANBAN ==========
export async function fetchKanbanTasks(): Promise<KanbanTask[]> {
  const response = await fetch(`${API_BASE}/kanban`)
  if (!response.ok) throw new Error('Failed to fetch tasks')
  const result = await response.json()
  return result.data || []
}

export async function createKanbanTask(content: string, status: 'todo' | 'doing' | 'done' = 'todo'): Promise<KanbanTask> {
  const response = await fetch(`${API_BASE}/kanban`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, status }),
  })
  if (!response.ok) throw new Error('Failed to create task')
  const result = await response.json()
  return result.data
}

export async function updateKanbanTask(id: string, updates: Partial<KanbanTask>): Promise<KanbanTask> {
  const response = await fetch(`${API_BASE}/kanban/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update task')
  const result = await response.json()
  return result.data
}

export async function deleteKanbanTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/kanban/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete task')
}

