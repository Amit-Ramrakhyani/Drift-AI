import NotesToolbar from "@/components/NotesToolbar";
import { icons } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import {
  debounce,
  formatTimestamp,
  getCurrentDate,
  getSyncStatus,
  getTimeAgo,
  loadNoteForUserAndDate,
  saveNoteToCache,
  syncNotesToDatabase,
  validateCacheIntegrity,
} from "@/lib/notes";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  TextInput as RNTextInput,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Markdown from "react-native-markdown-display";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Write = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    hasUnsyncedNotes: boolean;
    unsyncedCount: number;
    lastSyncDate: string | null;
  }>({
    hasUnsyncedNotes: false,
    unsyncedCount: 0,
    lastSyncDate: null,
  });

  const date = new Date();
  const day = days[date.getDay()];
  const dayNum = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isStarred, setIsStarred] = useState(false);

  const scrollRef = useRef<any>(null);
  const inputRef = useRef<RNTextInput>(null);

  // Load note for today on component mount or user change
  useEffect(() => {
    const loadNote = async () => {
      if (!user?.id) {
        // Clear form when no user (but don't clear cache)
        setTitle("");
        setMarkdown("");
        setIsStarred(false);
        setLastSaved(null);
        return;
      }

      try {
        // Validate cache integrity first to prevent false empty entries
        await validateCacheIntegrity(user.id);

        const currentDate = getCurrentDate();
        const noteData = await loadNoteForUserAndDate(user.id, currentDate);

        setTitle(noteData.title);
        setMarkdown(noteData.content);
        setIsStarred(noteData.isStarred);
        setLastSaved(new Date(noteData.lastModified));

        console.log(
          `📝 Loaded note from ${noteData.source} for user:`,
          user.id
        );
      } catch (error) {
        console.error("❌ Error loading note:", error);
        // Set empty form on error
        setTitle("");
        setMarkdown("");
        setIsStarred(false);
        setLastSaved(null);
      }
    };

    loadNote();
  }, [user?.id]);

  // Auto-save to cache when content changes (debounced with 3 seconds)
  const debouncedSave = useCallback(
    debounce(async (title: string, content: string, isStarred: boolean) => {
      if (!user?.id) return;

      try {
        setIsSaving(true);
        await saveNoteToCache(user.id, title, content, isStarred);
        setLastSaved(new Date());
        console.log("💾 Auto-saved to cache for user:", user.id);
      } catch (error) {
        console.error("❌ Error auto-saving to cache:", error);
      } finally {
        setIsSaving(false);
      }
    }, 3000), // 3 seconds debounce
    [user?.id]
  );

  // Save to cache whenever content changes
  useEffect(() => {
    debouncedSave(title, markdown, isStarred);
  }, [title, markdown, isStarred, debouncedSave]);

  // Check sync status periodically
  useEffect(() => {
    const checkSyncStatus = async () => {
      if (!user?.id) return;

      try {
        const status = await getSyncStatus(user.id);
        setSyncStatus(status);
        console.log("🔄 Sync status updated:", status);
      } catch (error) {
        console.error("❌ Error checking sync status:", error);
      }
    };

    checkSyncStatus();

    // Check sync status every 30 seconds
    const interval = setInterval(checkSyncStatus, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachedImage(result.assets[0].uri);
    }
  };

  // Placeholder for audio-to-text
  const handleMicPress = () => {
    alert("Audio-to-text not implemented in this demo.");
  };

  // Scroll to cursor position when selection changes
  const handleSelectionChange = () => {
    if (
      scrollRef.current &&
      typeof scrollRef.current.scrollToFocusedInput === "function" &&
      inputRef.current
    ) {
      scrollRef.current.scrollToFocusedInput(inputRef.current);
    }
  };

  // Track content height of TextInput
  const handleContentSizeChange = (event: any) => {
    setContentHeight(event.nativeEvent.contentSize.height);
  };

  // Calculate dynamic spacer height (at least 200, more if content is long)
  const bottomSpacer = Math.max(200, 0.25 * contentHeight);

  // Manual sync to database
  const handleManualSync = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncNotesToDatabase(user.id);

      if (result.success) {
        const message =
          result.syncedCount === 1
            ? `Successfully synced ${result.syncedCount} note to database.`
            : `Successfully synced ${result.syncedCount} notes to database.`;

        Alert.alert("Sync Complete", message);

        // Update sync status after successful sync
        const newStatus = await getSyncStatus(user.id);
        setSyncStatus(newStatus);
      } else {
        Alert.alert(
          "Sync Error",
          `Failed to sync some notes. Errors: ${result.errors.join(", ")}`
        );
      }
    } catch (error) {
      console.error("❌ Error during manual sync:", error);
      Alert.alert("Error", "Failed to sync notes. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Toolbar handlers
  const handleAddAttachment = () => {
    Alert.alert("Add Attachment", "Choose attachment type", [
      { text: "Image from Gallery", onPress: pickImage },
      { text: "Camera", onPress: () => alert("Camera not implemented") },
      { text: "Audio", onPress: () => alert("Audio not implemented") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSearch = () => {
    alert("Search functionality not implemented");
  };

  const handleSaveAsFile = () => {
    handleManualSync();
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleShare = () => {
    alert("Share functionality not implemented");
  };

  const handlePrint = () => {
    alert("Print functionality not implemented");
  };

  const handleDelete = () => {
    Alert.alert("Clear Note", "Are you sure you want to clear this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setMarkdown("");
          setTitle("");
          setAttachedImage(null);
          setIsStarred(false);
        },
      },
    ]);
  };

  return (
    <View
      className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"} pt-10`}
    >
      {/* WriteToolbar */}
      <NotesToolbar
        title={title}
        onTitleChange={setTitle}
        isReadingMode={isReadingMode}
        onReadingModeToggle={() => setIsReadingMode(!isReadingMode)}
        onAddAttachment={handleAddAttachment}
        onSearch={handleSearch}
        onSaveAsFile={handleSaveAsFile}
        onStar={handleStar}
        onShare={handleShare}
        onPrint={handlePrint}
        onDelete={handleDelete}
        isStarred={isStarred}
        isSaving={isSaving}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        onManualSync={handleManualSync}
      />

      {/* Status Indicators */}
      <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        {lastSaved && (
          <Text className="text-xs text-gray-600 mb-1">
            Last saved: {formatTimestamp(lastSaved.getTime())}
          </Text>
        )}
        {syncStatus.hasUnsyncedNotes && (
          <Text className="text-xs text-orange-600">
            ⚠️ {syncStatus.unsyncedCount} note(s) need to be synced
          </Text>
        )}
        {syncStatus.lastSyncDate && (
          <Text className="text-xs text-green-600">
            ✅ Last synced:{" "}
            {getTimeAgo(new Date(syncStatus.lastSyncDate).getTime())}
          </Text>
        )}
      </View>

      {/* Header Section */}
      <View className="flex-row justify-between items-start w-full px-4 pt-4 bg-gray-50">
        <View className="mt-2">
          <Text className="text-4xl font-HelveticaNeueBlack leading-8">
            HELLO
          </Text>
          <Text className="text-4xl font-HelveticaNeueBlack leading-8">
            {user?.firstName?.toUpperCase() || "NICK"}
          </Text>
        </View>
        <View className="items-end mt-2 pr-8">
          <View className="flex-col items-start relative">
            <Text className="text-4xl font-HelveticaNeueBlack leading-8 tracking-[-2px]">
              {dayNum}
            </Text>
            <Text
              className="text-lg font-HelveticaNeueMedium uppercase pl-1 mt-[-4px]"
              numberOfLines={1}
            >
              {month}
            </Text>
            <Text className="text-lg font-HelveticaNeueMedium uppercase pl-1 mt-[-5px]">
              {year}
            </Text>
            <View className="absolute right-[-55px] top-9 -translate-y-1/2 w-[80px] h-[30px] items-center justify-center">
              <Text className="text-3xl font-HelveticaNeueBlack text-[#3A04FF] rotate-90">
                {day}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Journal Section */}
      <KeyboardAwareScrollView
        className="flex-1 bg-gray-50"
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={80}
        ref={scrollRef}
      >
        <View className="mx-4">
          {isReadingMode ? (
            <Markdown>{markdown}</Markdown>
          ) : (
            <TextInput
              ref={inputRef}
              className="w-full text-justify font-HelveticaNeueRoman min-h-[50px] bg-transparent text-base"
              multiline
              value={markdown}
              onChangeText={setMarkdown}
              placeholder="Journal here..."
              placeholderTextColor="#bbb"
              onSelectionChange={handleSelectionChange}
              onContentSizeChange={handleContentSizeChange}
            />
          )}
          {attachedImage && (
            <Image
              source={{ uri: attachedImage }}
              className="w-full h-32 mt-2 rounded-lg"
              resizeMode="cover"
            />
          )}
        </View>

        {/* Dynamic padding at the bottom */}
        <View style={{ height: bottomSpacer }} />
      </KeyboardAwareScrollView>

      <View className="absolute bottom-20 right-2 z-10">
        <View className="p-4">
          <TouchableOpacity
            onPress={handleMicPress}
            className="bg-[#3A04FF] rounded-full p-4 shadow-lg"
          >
            <Image
              source={icons.mic}
              className="w-7 h-7"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Write;
