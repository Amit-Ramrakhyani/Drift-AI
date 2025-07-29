/**
 * User cache management hook for notes system
 */

import { useUser } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';
import { getCacheStatus } from './cache';
import { LOG_PREFIXES } from './constants';

/**
 * Hook for managing user-specific cache operations
 */
export const useUserCache = () => {
  const { user, isSignedIn } = useUser();
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.id || null;

    // Handle user change
    if (currentUserId !== previousUserId.current) {
      if (previousUserId.current) {
        console.log(`${LOG_PREFIXES.USER} User changed from ${previousUserId.current} to ${currentUserId || 'none'}`);
      }

      if (currentUserId) {
        console.log(`${LOG_PREFIXES.USER} User signed in: ${currentUserId}`);
        
        // Check cache status for the new user
        getCacheStatus(currentUserId).then(status => {
          console.log(`${LOG_PREFIXES.USER} Cache status for user ${currentUserId}:`, status);
        }).catch(error => {
          console.error(`${LOG_PREFIXES.USER} Error getting cache status:`, error);
        });
      } else {
        console.log(`${LOG_PREFIXES.USER} User signed out`);
        // Note: We don't clear cache on sign out to prevent data loss
        // Cache will be cleared only after successful sync
      }

      previousUserId.current = currentUserId;
    }

    // Handle sign out
    if (!isSignedIn && previousUserId.current) {
      console.log(`${LOG_PREFIXES.USER} User signed out: ${previousUserId.current}`);
      console.log(`${LOG_PREFIXES.USER} Cache preserved for user ${previousUserId.current} to prevent data loss`);
      // Cache is intentionally NOT cleared on sign out to prevent data loss
      // It will be cleared only after successful sync to the database
    }

  }, [user?.id, isSignedIn]);

  return {
    currentUserId: user?.id,
    isSignedIn,
    previousUserId: previousUserId.current
  };
}; 