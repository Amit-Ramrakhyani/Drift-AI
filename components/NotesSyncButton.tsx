/**
 * Notes Sync Button Component
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotesSyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
  hasUnsyncedNotes: boolean;
  unsyncedCount: number;
  lastSyncDate?: string | null;
}

const NotesSyncButton: React.FC<NotesSyncButtonProps> = ({
  onSync,
  isSyncing,
  hasUnsyncedNotes,
  unsyncedCount,
  lastSyncDate,
}) => {
  const getSyncButtonText = () => {
    if (isSyncing) return "Syncing...";
    if (hasUnsyncedNotes) return `Sync (${unsyncedCount})`;
    return "Sync";
  };

  const getSyncButtonStyle = () => {
    if (isSyncing) {
      return "bg-gray-400";
    }
    if (hasUnsyncedNotes) {
      return "bg-orange-500";
    }
    return "bg-blue-500";
  };

  const getSyncButtonTextStyle = () => {
    if (isSyncing) {
      return "text-gray-600";
    }
    return "text-white";
  };

  return (
    <View className="flex-row items-center">
      {hasUnsyncedNotes && !isSyncing && (
        <View className="mr-2">
          <View className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </View>
      )}

      <TouchableOpacity
        onPress={onSync}
        disabled={isSyncing}
        className={`px-3 py-2 rounded-lg ${getSyncButtonStyle()}`}
      >
        <Text className={`text-sm font-semibold ${getSyncButtonTextStyle()}`}>
          {getSyncButtonText()}
        </Text>
      </TouchableOpacity>

      {lastSyncDate && (
        <Text className="text-xs text-gray-500 ml-2">
          Last: {new Date(lastSyncDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

export default NotesSyncButton;
