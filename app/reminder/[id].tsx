import { icons } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { ReminderFieldProps } from "@/types/type";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { remindersList } from "../(root)/(tabs)/reminder";

const ReminderScreen = () => {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [reminders, setReminders] = useState(remindersList);
  const [currentReminder, setCurrentReminder] = useState<
    ReminderFieldProps | undefined
  >(reminders.find((reminder) => reminder.id === id));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const onSave = () => {
    if (currentReminder) {
      setReminders(
        reminders.map((reminder) =>
          reminder.id === id ? currentReminder : reminder
        )
      );
    }
    setIsEditing(false);
    router.back();
  };

  const onCancel = () => {
    setIsEditing(false);
    router.back();
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Focus the input after a short delay to ensure the component is rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const reminder = remindersList.find((reminder) => reminder.id === id);

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <View className="flex-1 bg-gray-50 mt-10">
        {/* Top Section - Back Button and Star Button */}
        <View className="flex-row items-center justify-between px-6 py-3 mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 mr-4"
          >
            <Image
              source={icons.angleLeft}
              className="w-6 h-6"
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity className="p-2">
            <Image
              source={icons.star}
              className="w-6 h-6"
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Reminder Details */}
        <ScrollView className="px-4 flex-1">
          <View className="flex-row items-center justify-between rounded-2xl bg-white mb-4">
            <TextInput
              ref={inputRef}
              className="text-xl font-HelveticaNeueMedium p-6"
              multiline
              value={currentReminder?.title}
              onChangeText={(text) => {
                if (currentReminder) {
                  setCurrentReminder({
                    ...currentReminder,
                    title: text,
                  });
                }
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
            />
          </View>

          {reminder?.status === "completed" && reminder?.dueDateTime && (
            <View className="mb-6">
              <View className="flex-col items-start justify-between rounded-2xl bg-white">
                <View className="flex-row items-center justify-between">
                  <Image
                    source={icons.calendarLines}
                    className="w-6 h-6 ml-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                  <Text className="text-xl font-HelveticaNeueRoman p-6">
                    {reminder?.dueDateTime?.toLocaleString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Text>
                </View>

                {/* Separator line */}
                <View className="h-px items-center bg-gray-200 w-11/12 mx-auto" />

                {/* Priority */}
                <View className="flex-row items-center justify-between ">
                  <Image
                    source={icons.volume}
                    className="w-6 h-6 ml-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                  <Text className="text-xl font-HelveticaNeueRoman pl-6 py-6 capitalize">
                    {reminder?.priority}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {reminder?.status === "completed" && reminder?.completedAt && (
            <View className="flex items-end justify-end">
              <Text className="text-lg px-4 capitalize text-gray-400">
                Completed:{" "}
                {reminder?.completedAt?.toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Section - Different options based on editing state and reminder status */}
        {reminder?.status === "pending" && !isEditing ? (
          <View className="flex-row items-center justify-between pl-4 pr-2 py-4">
            <OptionsButton
              icon={icons.check}
              label="Complete"
              onPress={() => {}}
            />
            <OptionsButton
              icon={icons.pencil}
              label="Edit"
              onPress={handleEdit}
            />
            <OptionsButton
              icon={icons.share}
              label="Share"
              onPress={() => {}}
            />
            <OptionsButton icon={icons.bin} label="Delete" onPress={() => {}} />
          </View>
        ) : reminder?.status === "pending" && isEditing ? (
          // Fixed position buttons that move up with keyboard
          <View
            className="absolute left-0 right-0 bg-white p-4"
            style={{
              bottom: keyboardHeight,
            }}
          >
            <View className="flex-row items-center justify-center">
              <View className="flex-1 items-center">
                <TouchableOpacity onPress={onCancel}>
                  <Text className="text-xl font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center">
                <TouchableOpacity onPress={onSave}>
                  <Text className="text-xl font-bold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {reminder?.status === "completed" && (
          <View className="flex-row items-center justify-between pl-4 pr-2 py-4">
            <OptionsButton
              icon={icons.rotateRight}
              label="Restore"
              onPress={() => {}}
            />
            <OptionsButton icon={icons.bin} label="Delete" onPress={() => {}} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ReminderScreen;

const OptionsButton = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity className="flex-1 mr-5" onPress={onPress}>
      <View className="flex-col items-center">
        <Image
          source={icon}
          className="w-6 h-6 mb-2"
          tintColor="#000"
          resizeMode="contain"
        />
        <Text className="text-sm font-bold">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
