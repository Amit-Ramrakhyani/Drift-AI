/**
 * Cache management for notes system
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ERROR_MESSAGES, LAST_SYNC_KEY, LOG_PREFIXES } from './constants';
import { CachedNote, CacheStatus, DailyNotes } from './types';
import { extractUserIdFromCacheKey, generateUserCacheKey, getCurrentDate, isValidUserId } from './utils';

/**
 * Get cached note for a specific date and user
 */
export const getCachedNote = async (userId: string, date: string): Promise<CachedNote | null> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return null;
    }

    const cacheKey = generateUserCacheKey(userId);
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const dailyNotes: DailyNotes = JSON.parse(cached);
    return dailyNotes[date] || null;
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} ${ERROR_MESSAGES.CACHE_READ}:`, error);
    return null;
  }
};

/**
 * Save note to cache for a specific user and date
 */
export const saveNoteToCache = async (
  userId: string, 
  title: string, 
  content: string, 
  isStarred: boolean = false
): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const date = getCurrentDate();
    const cacheKey = generateUserCacheKey(userId);
    
    // Get existing cache
    const existing = await AsyncStorage.getItem(cacheKey);
    const dailyNotes: DailyNotes = existing ? JSON.parse(existing) : {};
    
    // Update or create note for today
    dailyNotes[date] = {
      userId,
      title: title.trim(),
      content: content.trim(),
      date,
      isStarred,
      lastModified: Date.now(),
      synced: false,
    };
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(dailyNotes));
    console.log(`${LOG_PREFIXES.CACHE} Note cached for user ${userId} on date:`, date);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} ${ERROR_MESSAGES.CACHE_WRITE}:`, error);
  }
};

/**
 * Update existing cached note
 */
export const updateCachedNote = async (
  userId: string,
  date: string,
  updates: Partial<Omit<CachedNote, 'userId' | 'date'>>
): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const cacheKey = generateUserCacheKey(userId);
    const existing = await AsyncStorage.getItem(cacheKey);
    
    if (!existing) {
      console.warn(`${LOG_PREFIXES.CACHE} No cached notes found for user:`, userId);
      return;
    }
    
    const dailyNotes: DailyNotes = JSON.parse(existing);
    
    if (!dailyNotes[date]) {
      console.warn(`${LOG_PREFIXES.CACHE} No cached note found for date:`, date);
      return;
    }
    
    // Update the note with new data
    dailyNotes[date] = {
      ...dailyNotes[date],
      ...updates,
      lastModified: Date.now(),
    };
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(dailyNotes));
    console.log(`${LOG_PREFIXES.CACHE} Note updated for user ${userId} on date:`, date);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error updating cached note:`, error);
  }
};

/**
 * Get all cached notes for a user
 */
export const getAllCachedNotes = async (userId: string): Promise<CachedNote[]> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return [];
    }

    const cacheKey = generateUserCacheKey(userId);
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) return [];
    
    const dailyNotes: DailyNotes = JSON.parse(cached);
    return Object.values(dailyNotes);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} ${ERROR_MESSAGES.CACHE_READ}:`, error);
    return [];
  }
};

/**
 * Get unsynced notes for a user
 */
export const getUnsyncedNotes = async (userId: string): Promise<CachedNote[]> => {
  try {
    const allNotes = await getAllCachedNotes(userId);
    return allNotes.filter(note => !note.synced);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error getting unsynced notes:`, error);
    return [];
  }
};

/**
 * Get synced notes for a user
 */
export const getSyncedNotes = async (userId: string): Promise<CachedNote[]> => {
  try {
    const allNotes = await getAllCachedNotes(userId);
    return allNotes.filter(note => note.synced);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error getting synced notes:`, error);
    return [];
  }
};

/**
 * Mark note as synced for a specific date
 */
export const markNoteAsSynced = async (userId: string, date: string): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const cacheKey = generateUserCacheKey(userId);
    const existing = await AsyncStorage.getItem(cacheKey);
    
    if (!existing) return;
    
    const dailyNotes: DailyNotes = JSON.parse(existing);
    if (dailyNotes[date]) {
      dailyNotes[date].synced = true;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(dailyNotes));
      console.log(`${LOG_PREFIXES.CACHE} Marked note as synced for user ${userId} on date:`, date);
    }
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error marking note as synced:`, error);
  }
};

/**
 * Clear cached note for a specific date (after successful sync)
 */
export const clearCachedNoteForDate = async (userId: string, date: string): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const cacheKey = generateUserCacheKey(userId);
    const existing = await AsyncStorage.getItem(cacheKey);
    
    if (!existing) return;
    
    const dailyNotes: DailyNotes = JSON.parse(existing);
    delete dailyNotes[date];
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(dailyNotes));
    console.log(`${LOG_PREFIXES.CACHE} Cleared cached note for user ${userId} on date:`, date);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error clearing cached note:`, error);
  }
};

/**
 * Clear all cached notes for a user
 */
export const clearCachedNotesForUser = async (userId: string): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const cacheKey = generateUserCacheKey(userId);
    await AsyncStorage.removeItem(cacheKey);
    console.log(`${LOG_PREFIXES.CACHE} Cleared all cached notes for user:`, userId);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error clearing cached notes for user:`, error);
  }
};

/**
 * Get all user IDs that have cached notes
 */
export const getAllUserIdsWithCachedNotes = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const noteKeys = keys.filter(key => key.startsWith('drift_ai_notes_cache_'));
    const userIds = noteKeys.map(extractUserIdFromCacheKey);
    
    // Filter out any invalid user IDs
    return userIds.filter(isValidUserId);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error getting user IDs with cached notes:`, error);
    return [];
  }
};

/**
 * Clear all cached notes for all users (for debugging or complete reset)
 */
export const clearAllCachedNotesForAllUsers = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const noteKeys = keys.filter(key => key.startsWith('drift_ai_notes_cache_'));
    
    for (const key of noteKeys) {
      await AsyncStorage.removeItem(key);
    }
    
    console.log(`${LOG_PREFIXES.CACHE} Cleared cached notes for ${noteKeys.length} users`);
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error clearing all cached notes:`, error);
  }
};

/**
 * Get cache status for a user
 */
export const getCacheStatus = async (userId: string): Promise<CacheStatus> => {
  try {
    if (!isValidUserId(userId)) {
      return {
        totalNotes: 0,
        syncedNotes: 0,
        unsyncedNotes: 0,
        lastSyncDate: null
      };
    }

    const allNotes = await getAllCachedNotes(userId);
    const syncedNotes = allNotes.filter(note => note.synced);
    const unsyncedNotes = allNotes.filter(note => !note.synced);
    
    // Get last sync date from storage
    const lastSyncDate = await AsyncStorage.getItem(LAST_SYNC_KEY);
    
    return {
      totalNotes: allNotes.length,
      syncedNotes: syncedNotes.length,
      unsyncedNotes: unsyncedNotes.length,
      lastSyncDate
    };
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error getting cache status:`, error);
    return {
      totalNotes: 0,
      syncedNotes: 0,
      unsyncedNotes: 0,
      lastSyncDate: null
    };
  }
};

/**
 * Check if user has any cached notes
 */
export const hasCachedNotes = async (userId: string): Promise<boolean> => {
  try {
    const notes = await getAllCachedNotes(userId);
    return notes.length > 0;
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error checking if user has cached notes:`, error);
    return false;
  }
};

/**
 * Get note count for a user
 */
export const getNoteCount = async (userId: string): Promise<number> => {
  try {
    const notes = await getAllCachedNotes(userId);
    return notes.length;
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error getting note count:`, error);
    return 0;
  }
};

/**
 * Load note from cache or database with proper priority
 * Priority: Cache (if exists) > Database (if exists) > Empty form
 */
export const loadNoteForUserAndDate = async (userId: string, date: string): Promise<{
  title: string;
  content: string;
  isStarred: boolean;
  lastModified: number;
  source: 'cache' | 'database' | 'empty';
}> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return {
        title: "",
        content: "",
        isStarred: false,
        lastModified: Date.now(),
        source: 'empty'
      };
    }

    // First, try to get from cache
    const cachedNote = await getCachedNote(userId, date);
    
    if (cachedNote) {
      // Check if the cached note has meaningful content
      const hasContent = (cachedNote.title && cachedNote.title.trim() !== '') || 
                        (cachedNote.content && cachedNote.content.trim() !== '');
      
      if (hasContent) {
        console.log(`${LOG_PREFIXES.CACHE} Loaded note from cache for user ${userId} on date ${date}`);
        return {
          title: cachedNote.title || "",
          content: cachedNote.content || "",
          isStarred: cachedNote.isStarred,
          lastModified: cachedNote.lastModified,
          source: 'cache'
        };
      } else {
        // Cache has empty content, try database
        console.log(`${LOG_PREFIXES.CACHE} Cached note is empty, checking database for user ${userId} on date ${date}`);
      }
    }

    // If not in cache or cache is empty, try to get from database
    try {
      const { fetchAPI } = await import('../fetch');
      const response = await fetchAPI(`/(api)/notes?userId=${userId}&date=${date}`, {
        method: "GET"
      });

      if (response && response.data) {
        const dbNote = response.data;
        const hasDbContent = (dbNote.title && dbNote.title.trim() !== '') || 
                            (dbNote.content && dbNote.content.trim() !== '');
        
        if (hasDbContent) {
          console.log(`${LOG_PREFIXES.CACHE} Loaded note from database for user ${userId} on date ${date}`);
          
          // Update cache with database data to prevent future empty cache issues
          const { updateCachedNote } = await import('./cache');
          await updateCachedNote(userId, date, {
            title: dbNote.title || "",
            content: dbNote.content || "",
            isStarred: dbNote.is_starred || false,
            synced: true,
            lastModified: new Date(dbNote.updated_at || dbNote.created_at).getTime()
          });
          
          return {
            title: dbNote.title || "",
            content: dbNote.content || "",
            isStarred: dbNote.is_starred || false,
            lastModified: new Date(dbNote.updated_at || dbNote.created_at).getTime(),
            source: 'database'
          };
        }
      }
    } catch (dbError) {
      console.warn(`${LOG_PREFIXES.CACHE} Could not load note from database:`, dbError);
      // Continue to return empty form
    }

    // If neither cache nor database has meaningful content, return empty form
    console.log(`${LOG_PREFIXES.CACHE} No meaningful note found in cache or database for user ${userId} on date ${date}`);
    return {
      title: "",
      content: "",
      isStarred: false,
      lastModified: Date.now(),
      source: 'empty'
    };

  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error loading note for user ${userId} on date ${date}:`, error);
    return {
      title: "",
      content: "",
      isStarred: false,
      lastModified: Date.now(),
      source: 'empty'
    };
  }
};

/**
 * Clean up empty cache entries for a user
 */
export const cleanupEmptyCacheEntries = async (userId: string): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    const allNotes = await getAllCachedNotes(userId);
    const cacheKey = generateUserCacheKey(userId);
    
    // Filter out empty notes
    const nonEmptyNotes = allNotes.filter(note => {
      const hasContent = (note.title && note.title.trim() !== '') || 
                        (note.content && note.content.trim() !== '');
      return hasContent;
    });
    
    if (nonEmptyNotes.length !== allNotes.length) {
      // Rebuild cache with only non-empty notes
      const dailyNotes: DailyNotes = {};
      nonEmptyNotes.forEach(note => {
        dailyNotes[note.date] = note;
      });
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(dailyNotes));
      console.log(`${LOG_PREFIXES.CACHE} Cleaned up ${allNotes.length - nonEmptyNotes.length} empty cache entries for user: ${userId}`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error cleaning up empty cache entries:`, error);
  }
};

/**
 * Validate and fix cache integrity for a user
 */
export const validateCacheIntegrity = async (userId: string): Promise<void> => {
  try {
    if (!isValidUserId(userId)) {
      console.error(`${LOG_PREFIXES.CACHE} Invalid user ID:`, userId);
      return;
    }

    console.log(`${LOG_PREFIXES.CACHE} Validating cache integrity for user: ${userId}`);
    
    // Clean up empty entries
    await cleanupEmptyCacheEntries(userId);
    
    // Check for any notes marked as synced but with empty content
    const allNotes = await getAllCachedNotes(userId);
    const cacheKey = generateUserCacheKey(userId);
    
    let needsUpdate = false;
    const updatedNotes: DailyNotes = {};
    
    for (const note of allNotes) {
      const hasContent = (note.title && note.title.trim() !== '') || 
                        (note.content && note.content.trim() !== '');
      
      if (note.synced && !hasContent) {
        // This is a synced note with empty content - try to get from database
        try {
          const { fetchAPI } = await import('../fetch');
          const response = await fetchAPI(`/(api)/notes?userId=${userId}&date=${note.date}`, {
            method: "GET"
          });
          
          if (response && response.data) {
            const dbNote = response.data;
            const hasDbContent = (dbNote.title && dbNote.title.trim() !== '') || 
                                (dbNote.content && dbNote.content.trim() !== '');
            
            if (hasDbContent) {
              // Update with database content
              updatedNotes[note.date] = {
                ...note,
                title: dbNote.title || "",
                content: dbNote.content || "",
                isStarred: dbNote.is_starred || false,
                lastModified: new Date(dbNote.updated_at || dbNote.created_at).getTime()
              };
              needsUpdate = true;
              console.log(`${LOG_PREFIXES.CACHE} Fixed empty synced note for date: ${note.date}`);
            } else {
              // Remove empty synced note
              needsUpdate = true;
              console.log(`${LOG_PREFIXES.CACHE} Removed empty synced note for date: ${note.date}`);
            }
          } else {
            // Remove empty synced note if no database entry
            needsUpdate = true;
            console.log(`${LOG_PREFIXES.CACHE} Removed empty synced note for date: ${note.date} (no DB entry)`);
          }
        } catch (error) {
          console.warn(`${LOG_PREFIXES.CACHE} Could not validate note for date ${note.date}:`, error);
          // Keep the note as is if we can't validate
          updatedNotes[note.date] = note;
        }
      } else {
        // Keep valid notes
        updatedNotes[note.date] = note;
      }
    }
    
    if (needsUpdate) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedNotes));
      console.log(`${LOG_PREFIXES.CACHE} Cache integrity validation completed for user: ${userId}`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIXES.CACHE} Error validating cache integrity:`, error);
  }
};