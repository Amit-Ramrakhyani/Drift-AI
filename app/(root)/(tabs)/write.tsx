import NotesToolbar from "@/components/NotesToolbar";
import { icons } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
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
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isReadingMode, setIsReadingMode] = useState(false);
  const date = new Date();
  const day = days[date.getDay()]; // Adjusted to match the days array
  const dayNum = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isStarred, setIsStarred] = useState(false);
  // Use useRef for KeyboardAwareScrollView and TextInput
  const scrollRef = useRef<any>(null);
  const inputRef = useRef<RNTextInput>(null);

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
    alert("Save as file not implemented");
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
    setMarkdown("");
    setTitle("");
    setAttachedImage(null);
  };

  return (
    <View className="flex-1 bg-black pt-10">
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
      />

      {/* Header Section */}
      <View className="flex-row justify-between items-start w-full px-4 pt-4 bg-white">
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
        className="flex-1 bg-white"
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
            onPress={() => {
              console.log("pressed");
            }}
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
