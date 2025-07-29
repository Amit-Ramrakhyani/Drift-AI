/**
 * Constants for the notes system
 */

// Cache keys
export const NOTES_CACHE_KEY = 'drift_ai_notes_cache';
export const LAST_SYNC_KEY = 'drift_ai_last_sync_date';

// Sync configuration
export const SYNC_DEBOUNCE_DELAY = 3000; // 3 seconds
export const AUTO_SAVE_DEBOUNCE_DELAY = 3000; // 3 seconds for auto-save

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';

// Error messages
export const ERROR_MESSAGES = {
  CACHE_READ: 'Error reading from cache',
  CACHE_WRITE: 'Error writing to cache',
  SYNC_FAILED: 'Sync failed',
  USER_NOT_FOUND: 'User not found',
  NETWORK_ERROR: 'Network error',
} as const;

// Log prefixes
export const LOG_PREFIXES = {
  CACHE: '📝 Cache',
  SYNC: '🔄 Sync',
  USER: '👤 User',
} as const;