import { icons } from "@/constants";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NotesToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  isReadingMode: boolean;
  onReadingModeToggle: () => void;
  onAddAttachment: () => void;
  onSearch: () => void;
  onSaveAsFile: () => void;
  onStar: () => void;
  onShare: () => void;
  onPrint: () => void;
  onDelete: () => void;
  isStarred: boolean;
}

const NotesToolbar: React.FC<NotesToolbarProps> = ({
  title,
  onTitleChange,
  isReadingMode,
  onReadingModeToggle,
  onAddAttachment,
  onSearch,
  onSaveAsFile,
  onStar,
  onShare,
  onPrint,
  onDelete,
  isStarred,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Add these constants for menu positioning
  const MENU_WIDTH = 260;
  const MENU_TOP = 60;
  const MENU_RIGHT = 16;

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
    setShowMenu(false);
  };

  const attachmentOptions = [
    {
      label: "PDF",
      icon: icons.pdf,
      onPress: () => onAddAttachment(),
    },
    {
      label: "Voice recording",
      icon: icons.mic,
      onPress: () => alert("Voice recording not implemented"),
    },
    { label: "Image", icon: icons.image, onPress: () => onAddAttachment() },
    {
      label: "Camera",
      icon: icons.camera,
      onPress: () => alert("Camera not implemented"),
    },
    {
      label: "Scan",
      icon: icons.scan,
      onPress: () => alert("Scan not implemented"),
    },
    {
      label: "Audio file",
      icon: icons.audio,
      onPress: () => alert("Audio file not implemented"),
    },
    {
      label: "Drawing",
      icon: icons.draw,
      onPress: () => alert("Drawing not implemented"),
    },
  ];

  const menuOptions = [
    { label: "Search", onPress: onSearch },
    {
      label: "Edit cover",
      onPress: () => alert("Edit cover not implemented"),
    },
    {
      label: "Page template",
      onPress: () => alert("Page template not implemented"),
    },
    {
      label: "Background colour",
      onPress: () => alert("Background colour not implemented"),
    },
    {
      label: "Full screen",
      onPress: () => alert("Full screen not implemented"),
    },
    {
      label: "Add to",
      onPress: () => alert("Add to not implemented"),
    },
    {
      label: "Add tags",
      onPress: () => alert("Add tags not implemented"),
    },
    { label: "Save as file", onPress: onSaveAsFile },
  ];

  const menuFooterOptions = [
    {
      icon: isStarred ? icons.starFilled : icons.star,
      onPress: onStar,
      tintColor: isStarred ? "#FFC000" : "#fff",
    },
    { icon: icons.share, onPress: onShare },
    { icon: icons.print, onPress: onPrint },
    { icon: icons.bin, onPress: handleDelete },
  ];

  const renderDropdownMenu = (
    options: any[],
    isVisible: boolean,
    onClose: () => void,
    withFooter = false
  ) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-transparent"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className={`absolute z-50 right-4 top-16 bg-neutral-900 rounded-2xl py-4 shadow-lg shadow-black/30 ${
            withFooter ? "w-[250px]" : "w-[200px]"
          }`}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              className={`flex-row items-center py-3 ${withFooter ? "px-2" : "px-6"}`}
            >
              {option.icon && (
                <Image source={option.icon} className="w-5 h-5" />
              )}
              <Text className="text-base text-white ml-5">{option.label}</Text>
            </TouchableOpacity>
          ))}
          {withFooter && (
            <View className="border-t border-neutral-700 flex-row justify-around pt-4 mt-3">
              {menuFooterOptions.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    option.onPress();
                    onClose();
                  }}
                >
                  <View className="p-2">
                    <Image
                      source={option.icon}
                      className="w-5 h-5"
                      tintColor={option?.tintColor}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 h-16">
      {/* Title Input */}
      <View className="flex-1 mr-4">
        <TextInput
          value={title}
          onChangeText={onTitleChange}
          placeholder="Title"
          placeholderTextColor="#999"
          className="text-2xl font-HelveticaNeueRoman text-black font-bold"
          style={{ padding: 0 }}
        />
      </View>

      {/* Reading Mode Toggle */}
      <TouchableOpacity onPress={onReadingModeToggle} className="mr-4 p-2">
        <Image
          source={isReadingMode ? icons.reading : icons.writing}
          className="w-5 h-5"
          tintColor={isReadingMode ? "#000" : "#000"}
        />
      </TouchableOpacity>

      {/* Add Attachment Dropdown */}
      <TouchableOpacity
        onPress={() => setShowAttachmentMenu(true)}
        className="mr-4 p-2"
      >
        <Image source={icons.plus} className="w-5 h-5" />
      </TouchableOpacity>

      {/* Three Dots Menu Dropdown */}
      <TouchableOpacity onPress={() => setShowMenu(true)} className="p-2">
        <Image
          source={icons.menuDots}
          className="w-5 h-5"
          tintColor="#000"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Attachment Menu Modal (floating dropdown) */}
      {renderDropdownMenu(attachmentOptions, showAttachmentMenu, () =>
        setShowAttachmentMenu(false)
      )}

      {/* Options Menu Modal (floating dropdown with footer) */}
      {renderDropdownMenu(
        menuOptions,
        showMenu,
        () => setShowMenu(false),
        true
      )}
    </View>
  );
};

export default NotesToolbar;
