/**
 * Utility functions for the notes system
 */

import { AUTO_SAVE_DEBOUNCE_DELAY } from './constants';

/**
 * Get the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Format a date to YYYY-MM-DD format
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if a date is today
 */
export const isToday = (date: string): boolean => {
  return date === getCurrentDate();
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date === formatDate(yesterday);
};

/**
 * Get date from timestamp
 */
export const getDateFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

/**
 * Debounce utility function with configurable delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = AUTO_SAVE_DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Generate a unique cache key for a user
 */
export const generateUserCacheKey = (userId: string): string => {
  return `drift_ai_notes_cache_${userId}`;
};

/**
 * Extract user ID from cache key
 */
export const extractUserIdFromCacheKey = (cacheKey: string): string => {
  return cacheKey.replace('drift_ai_notes_cache_', '');
};

/**
 * Validate user ID format
 */
export const isValidUserId = (userId: string): boolean => {
  return Boolean(userId && userId.length > 0 && userId.trim() !== '');
};

/**
 * Sanitize note content
 */
export const sanitizeNoteContent = (content: string): string => {
  return content.trim();
};

/**
 * Sanitize note title
 */
export const sanitizeNoteTitle = (title: string): string => {
  return title.trim();
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Get time ago from timestamp
 */
export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
};