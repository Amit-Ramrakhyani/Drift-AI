/**
 * Core types and interfaces for the notes system
 */

export interface CachedNote {
  userId: string;
  title?: string;
  content?: string;
  date: string; // YYYY-MM-DD format
  isStarred: boolean;
  lastModified: number; // timestamp
  synced: boolean; // whether this has been synced to database
}

export interface DailyNotes {
  [date: string]: CachedNote; // key is YYYY-MM-DD
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
}

export interface CreateNoteData {
  userId: string;
  title?: string;
  content?: string;
  date?: string;
  isStarred?: boolean;
}

export interface Note {
  id: number;
  user_id: string;
  title?: string;
  content?: string;
  date: string;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotesResponse {
  data: Note[];
  count: number;
}

export interface CacheStatus {
  totalNotes: number;
  syncedNotes: number;
  unsyncedNotes: number;
  lastSyncDate: string | null;
}