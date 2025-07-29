/**
 * Notes system - Main exports
 * 
 * This module provides a centralized interface for all notes-related functionality
 */

// Core types and interfaces
export * from './types';

// Constants and configuration
export * from './constants';

// Utility functions
export * from './utils';

// Cache management
export * from './cache';

// Sync management
export * from './sync';

// User cache management
export * from './useUserCache';

// Re-export commonly used functions for convenience
export {
    cleanupEmptyCacheEntries, clearCachedNotesForUser, getAllCachedNotes, getAllUserIdsWithCachedNotes, getCachedNote, getCacheStatus, getNoteCount, getSyncedNotes, getUnsyncedNotes, hasCachedNotes, loadNoteForUserAndDate, saveNoteToCache,
    updateCachedNote, validateCacheIntegrity
} from './cache';

export {
    forceSyncNotesForDate, getSyncStatus,
    isSyncNeeded, syncAllUsersNotes, syncNotesToDatabase, syncNotesWithRetry
} from './sync';

export {
    debounce, formatTimestamp, getCurrentDate, getTimeAgo, isValidUserId,
    sanitizeNoteContent,
    sanitizeNoteTitle
} from './utils';

