/**
 * Sync management for notes system
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAPI } from '../fetch';
import { getUnsyncedNotes, markNoteAsSynced } from './cache';
import { ERROR_MESSAGES, LAST_SYNC_KEY, LOG_PREFIXES } from './constants';
import { SyncResult } from './types';
import { getCurrentDate, isValidUserId } from './utils';

/**
 * Sync unsynced notes to database for a specific user
 */
export const syncNotesToDatabase = async (userId: string): Promise<SyncResult> => {
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    errors: []
  };

  try {
    if (!isValidUserId(userId)) {
      const error = `${ERROR_MESSAGES.USER_NOT_FOUND}: ${userId}`;
      result.errors.push(error);
      result.success = false;
      return result;
    }

    console.log(`${LOG_PREFIXES.SYNC} Starting sync for user: ${userId}`);
    
    // Get unsynced notes for this user
    const unsyncedNotes = await getUnsyncedNotes(userId);
    
    if (unsyncedNotes.length === 0) {
      console.log(`${LOG_PREFIXES.SYNC} No unsynced notes found for user: ${userId}`);
      return result;
    }

    console.log(`${LOG_PREFIXES.SYNC} Found ${unsyncedNotes.length} unsynced notes for user: ${userId}`);

    // Sync each unsynced note
    for (const note of unsyncedNotes) {
      try {
        console.log(`${LOG_PREFIXES.SYNC} Attempting to sync note for date: ${note.date}`);
        
        const response = await fetchAPI("/(api)/notes", {
          method: "POST",
          body: JSON.stringify({
            userId: note.userId,
            title: note.title || "",
            content: note.content || "",
            date: note.date,
            isStarred: note.isStarred
          })
        });

        console.log(`${LOG_PREFIXES.SYNC} Response status: ${response.status}, ok: ${response.ok}, statusText: ${response.statusText}`);

        // Check if the response is successful
        if (response.ok) {
          // Try to get response data to determine operation type
          let syncedNoteData = null;
          
          try {
            const responseData = await response.json();
            syncedNoteData = responseData.data;
            console.log(`${LOG_PREFIXES.SYNC} Note synced for date: ${note.date}`);
          } catch (e) {
            console.log(`${LOG_PREFIXES.SYNC} Note synced for date: ${note.date}`);
          }
          
          // Mark as synced and update cache with synced data instead of clearing
          await markNoteAsSynced(note.userId, note.date);
          
          // Update cache with the synced data from database to prevent false empty entries
          if (syncedNoteData) {
            const { updateCachedNote } = await import('./cache');
            await updateCachedNote(note.userId, note.date, {
              title: syncedNoteData.title || "",
              content: syncedNoteData.content || "",
              isStarred: syncedNoteData.is_starred || false,
              synced: true,
              lastModified: new Date(syncedNoteData.updated_at || syncedNoteData.created_at).getTime()
            });
            console.log(`${LOG_PREFIXES.SYNC} Updated cache with synced data for date: ${note.date}`);
          } else {
            // If no synced data available, just mark as synced but keep existing cache data
            console.log(`${LOG_PREFIXES.SYNC} Marked note as synced for date: ${note.date}`);
          }
          
          result.syncedCount++;
          console.log(`${LOG_PREFIXES.SYNC} Successfully synced note for date: ${note.date}`);
        } else {
          // Try to get error details from response
          let errorDetails = `${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorDetails += ` - ${JSON.stringify(errorData)}`;
          } catch (e) {
            // Ignore JSON parsing errors
          }
          
          const error = `Failed to sync note for date ${note.date}: ${errorDetails}`;
          result.errors.push(error);
          console.error(`${LOG_PREFIXES.SYNC} ${error}`);
        }
      } catch (error) {
        const errorMsg = `Error syncing note for date ${note.date}: ${error}`;
        result.errors.push(errorMsg);
        console.error(`${LOG_PREFIXES.SYNC} ${errorMsg}`);
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    // Update last sync date if any notes were synced
    if (result.syncedCount > 0) {
      await AsyncStorage.setItem(LAST_SYNC_KEY, getCurrentDate());
    }

    console.log(`${LOG_PREFIXES.SYNC} Sync completed for user ${userId}: ${result.syncedCount} notes synced, ${result.errors.length} errors`);
    return result;

  } catch (error) {
    const errorMsg = `Error in sync process for user ${userId}: ${error}`;
    result.errors.push(errorMsg);
    result.success = false;
    console.error(`${LOG_PREFIXES.SYNC} ${errorMsg}`);
    return result;
  }
};

/**
 * Force sync notes for a specific date (for testing or manual override)
 */
export const forceSyncNotesForDate = async (userId: string, date: string): Promise<SyncResult> => {
  try {
    console.log(`${LOG_PREFIXES.SYNC} Force syncing notes for user ${userId} on date ${date}`);
    
    // This would need to be implemented based on your specific requirements
    // For now, we'll just call the regular sync function
    return await syncNotesToDatabase(userId);
  } catch (error) {
    console.error(`${LOG_PREFIXES.SYNC} Force sync failed for user ${userId} on date ${date}:`, error);
    return {
      success: false,
      syncedCount: 0,
      errors: [`Force sync failed: ${error}`]
    };
  }
};

/**
 * Sync all users' notes to database
 */
export const syncAllUsersNotes = async (): Promise<{
  totalSynced: number;
  totalErrors: number;
  userResults: { [userId: string]: SyncResult };
}> => {
  const results = {
    totalSynced: 0,
    totalErrors: 0,
    userResults: {} as { [userId: string]: SyncResult }
  };

  try {
    const { getAllUserIdsWithCachedNotes } = await import('./cache');
    const userIds = await getAllUserIdsWithCachedNotes();
    
    if (userIds.length === 0) {
      console.log(`${LOG_PREFIXES.SYNC} No users with cached notes found`);
      return results;
    }
    
    console.log(`${LOG_PREFIXES.SYNC} Starting sync for ${userIds.length} users`);
    
    for (const userId of userIds) {
      try {
        const result = await syncNotesToDatabase(userId);
        results.userResults[userId] = result;
        results.totalSynced += result.syncedCount;
        results.totalErrors += result.errors.length;
      } catch (error) {
        console.error(`${LOG_PREFIXES.SYNC} Error syncing for user ${userId}:`, error);
        results.totalErrors++;
      }
    }
    
    console.log(`${LOG_PREFIXES.SYNC} All users sync completed: ${results.totalSynced} notes synced, ${results.totalErrors} errors`);
    return results;
    
  } catch (error) {
    console.error(`${LOG_PREFIXES.SYNC} Error in all users sync:`, error);
    return results;
  }
};

/**
 * Sync notes with retry logic
 */
export const syncNotesWithRetry = async (
  userId: string, 
  maxRetries: number = 3
): Promise<SyncResult> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${LOG_PREFIXES.SYNC} Sync attempt ${attempt}/${maxRetries} for user: ${userId}`);
      
      const result = await syncNotesToDatabase(userId);
      
      if (result.success) {
        console.log(`${LOG_PREFIXES.SYNC} Sync successful on attempt ${attempt}`);
        return result;
      }
      
      // If sync failed but we have more retries, continue
      if (attempt < maxRetries) {
        console.log(`${LOG_PREFIXES.SYNC} Sync failed, retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      lastError = error as Error;
      console.error(`${LOG_PREFIXES.SYNC} Sync attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`${LOG_PREFIXES.SYNC} Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  // All retries failed
  console.error(`${LOG_PREFIXES.SYNC} All sync attempts failed for user: ${userId}`);
  return {
    success: false,
    syncedCount: 0,
    errors: [`All sync attempts failed: ${lastError?.message || 'Unknown error'}`]
  };
};

/**
 * Get sync status for a user
 */
export const getSyncStatus = async (userId: string): Promise<{
  lastSyncDate: string | null;
  hasUnsyncedNotes: boolean;
  unsyncedCount: number;
}> => {
  try {
    const lastSyncDate = await AsyncStorage.getItem(LAST_SYNC_KEY);
    const unsyncedNotes = await getUnsyncedNotes(userId);
    
    return {
      lastSyncDate,
      hasUnsyncedNotes: unsyncedNotes.length > 0,
      unsyncedCount: unsyncedNotes.length
    };
  } catch (error) {
    console.error(`${LOG_PREFIXES.SYNC} Error getting sync status:`, error);
    return {
      lastSyncDate: null,
      hasUnsyncedNotes: false,
      unsyncedCount: 0
    };
  }
};

/**
 * Check if sync is needed for a user
 */
export const isSyncNeeded = async (userId: string): Promise<boolean> => {
  try {
    const unsyncedNotes = await getUnsyncedNotes(userId);
    return unsyncedNotes.length > 0;
  } catch (error) {
    console.error(`${LOG_PREFIXES.SYNC} Error checking if sync is needed:`, error);
    return false;
  }
}; 