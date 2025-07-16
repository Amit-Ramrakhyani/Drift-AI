import { icons } from "@/constants";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RemindersToolbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {} },
    ]);
    setShowMenu(false);
    setShowSideMenu(false);
  };

  const sideMenuOptions = [
    {
      label: "All",
      onPress: () => {},
      icon: icons.checklist,
    },
    {
      label: "Today",
      onPress: () => {},
      icon: icons.calendarDay,
    },
    {
      label: "Scheduled",
      onPress: () => {},
      icon: icons.clock,
    },
    {
      label: "Important",
      onPress: () => {},
      icon: icons.star,
    },
    {
      label: "Completed",
      onPress: () => {},
      icon: icons.check,
    },
    {
      label: "Recycle Bin",
      onPress: () => {},
      icon: icons.bin,
    },
  ];

  const threeDotOptions = [
    {
      label: "Edit",
      onPress: () => {},
    },
    {
      label: "View",
      onPress: () => {},
    },
    {
      label: "Pin Important to top",
      onPress: () => {},
    },
  ];

  const renderDropdownMenu = (
    options: any[],
    isVisible: boolean,
    onClose: () => void
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
        <View className="absolute z-50 right-4 top-16 bg-neutral-900 rounded-3xl py-4 shadow-lg shadow-black/30 w-[200px] ">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              className="flex-row items-center py-3 px-2"
            >
              <Text className="text-base text-white ml-5">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSideMenu = (
    options: any[],
    isVisible: boolean,
    onClose: () => void
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
        <View className="absolute z-50 left-4 top-16 bg-neutral-900 rounded-3xl p-4 shadow-lg shadow-black/30 w-[250px] ">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              className="flex-row items-center py-3 px-2"
            >
              {option.icon && (
                <Image source={option.icon} className="w-5 h-5" />
              )}
              <Text className="text-base text-white ml-5">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-200 h-16">
      {/* Side Menu  */}
      <TouchableOpacity
        className="flex-1 mr-4"
        onPress={() => setShowSideMenu(true)}
      >
        <Image
          source={icons.menuBurger}
          className="w-5 h-5"
          tintColor="#000"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity className="mr-4 p-2">
        <Image
          source={icons.search}
          className="w-5 h-5"
          tintColor="#000"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Three Dots Menu Dropdown */}
      <TouchableOpacity onPress={() => setShowMenu(true)}>
        <Image
          source={icons.menuDots}
          className="w-5 h-5"
          tintColor="#000"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Options Menu Modal */}
      {renderDropdownMenu(threeDotOptions, showMenu, () => setShowMenu(false))}

      {/* Side Menu Modal */}
      {renderSideMenu(sideMenuOptions, showSideMenu, () =>
        setShowSideMenu(false)
      )}
    </View>
  );
};

export default RemindersToolbar;
