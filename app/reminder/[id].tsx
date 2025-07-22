import { icons, remindersList } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { formatTime } from "@/lib/utils";
import { ReminderFieldProps } from "@/types/type";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ReminderScreen = () => {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [reminders, setReminders] = useState(remindersList);
  const [currentReminder, setCurrentReminder] = useState<
    ReminderFieldProps | undefined
  >(reminders.find((reminder) => reminder.id === id));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPriorityModal, setShowPriorityModal] = useState(false);
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
    // reset the reminder to the original reminder
    setCurrentReminder(reminders.find((reminder) => reminder.id === id));
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && reminder) {
      const currentTime = reminder.dueDateTime || new Date();
      const newDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes(),
        0
      );
      reminder.dueDateTime = newDateTime;
      setReminders([...reminders]);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && reminder) {
      const currentDate = reminder.dueDateTime || new Date();
      const newDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0
      );
      reminder.dueDateTime = newDateTime;
      setReminders([...reminders]);
    }
  };

  const showDatePickerModal = () => {
    setSelectedDate(reminder?.dueDateTime || new Date());
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setSelectedDate(reminder?.dueDateTime || new Date());
    setShowTimePicker(true);
  };

  const renderPriorityModal = (isVisible: boolean, onClose: () => void) => {
    return (
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
          <View className="flex-col bg-white rounded-3xl py-4 shadow-lg shadow-black/40 w-[200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {["low", "medium", "high"].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setShowPriorityModal(false);
                  if (reminder) {
                    reminder.priority = option;
                    setReminders([...reminders]);
                  }
                }}
                className="flex-row items-center py-3 px-4"
              >
                <View className="flex-row items-center justify-between w-full">
                  <Text
                    className={`text-xl capitalize flex-1 ${
                      currentReminder?.priority === option
                        ? "text-[#3A04FF]"
                        : ""
                    }`}
                  >
                    {option}
                  </Text>
                  {currentReminder?.priority === option && (
                    <Image
                      source={icons.check}
                      className="w-6 h-6 ml-2"
                      tintColor="#3A04FF"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
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
          <View className="flex-col items-start justify-between rounded-2xl bg-white mb-4 min-h-[20%]">
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
              editable={reminder?.status === "pending"}
            />

            {/* Checkbox and Image Button */}
            {isEditing && (
              <View className="flex-row items-end justify-end w-full pr-4 pb-4">
                <TouchableOpacity className="p-2">
                  <Image
                    source={icons.checkCircle}
                    className="w-6 h-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Image
                    source={icons.image}
                    className="w-6 h-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {reminder?.dueDateTime && !isEditing ? (
            <View className="mb-6">
              <View className="flex-col items-start justify-between rounded-2xl bg-white">
                <TouchableOpacity
                  className="w-full p-6"
                  disabled={reminder?.status === "completed"}
                  onFocus={() => setIsEditing(true)}
                  onPress={() => setIsEditing(true)}
                >
                  <View className="flex-row items-center justify-start">
                    <Image
                      source={icons.calendarLines}
                      className="w-6 h-6"
                      tintColor="#000"
                      resizeMode="contain"
                    />
                    <Text className="text-xl font-HelveticaNeueRoman pl-6">
                      {reminder?.dueDateTime?.toLocaleString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      , {formatTime(reminder?.dueDateTime)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Separator line */}
                <View className="h-px items-center bg-gray-200 w-11/12 mx-auto" />

                {/* Priority */}
                <TouchableOpacity
                  className="w-full p-6"
                  disabled={reminder?.status === "completed"}
                  onFocus={() => setIsEditing(true)}
                  onPress={() => setIsEditing(true)}
                >
                  <View className="flex-row items-center justify-start">
                    <Image
                      source={icons.volume}
                      className="w-6 h-6"
                      tintColor="#000"
                      resizeMode="contain"
                    />
                    <Text className="text-xl font-HelveticaNeueRoman pl-6 capitalize">
                      {reminder?.priority}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : !reminder?.dueDateTime && isEditing ? (
            <View className="mb-6">
              <TouchableOpacity
                onPress={() => {
                  const now = new Date();
                  const roundedTime = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    now.getHours() + 1,
                    0,
                    0
                  );
                  if (reminder) {
                    reminder.dueDateTime = roundedTime;
                    reminder.priority = "medium";
                    setReminders([...reminders]);
                  }
                }}
              >
                <View className="flex-col items-start justify-between rounded-2xl bg-white">
                  <View className="flex-row items-center justify-between">
                    <Image
                      source={icons.calendarLines}
                      className="w-6 h-6 ml-6"
                      tintColor="#000"
                      resizeMode="contain"
                    />
                    <Text className="text-xl font-HelveticaNeueRoman p-6 text-gray-400">
                      Add time
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : reminder?.dueDateTime && isEditing ? (
            <View className="mb-6">
              <View className="flex-col items-start justify-between rounded-2xl bg-white">
                <View className="flex-col items-start justify-between w-full">
                  <View className="flex-row items-center justify-between w-full">
                    <View className="flex-row items-center">
                      <Image
                        source={icons.calendarLines}
                        className="w-6 h-6 ml-6"
                        tintColor="#000"
                        resizeMode="contain"
                      />
                      <Text className="text-xl font-HelveticaNeueRoman p-6">
                        Time
                      </Text>
                    </View>

                    {/* Cross Icon */}
                    <View className="pr-2">
                      <TouchableOpacity
                        onPress={() => {
                          if (reminder) {
                            reminder.dueDateTime = undefined;
                            setReminders([...reminders]);
                          }
                        }}
                        className="mr-4"
                      >
                        <Image
                          source={icons.cross}
                          className="w-5 h-5"
                          tintColor="#000"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mx-12">
                    {/* Date */}
                    <TouchableOpacity
                      className="px-6"
                      onPress={showDatePickerModal}
                    >
                      <Text className="text-xl font-HelveticaNeueRoman">
                        {reminder?.dueDateTime?.toLocaleString("en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </Text>
                    </TouchableOpacity>

                    {/* Vertical Separator */}
                    <View className="h-5 bg-gray-300 w-[2px]" />

                    {/* Time */}
                    <TouchableOpacity
                      className="p-4"
                      onPress={showTimePickerModal}
                    >
                      <Text className="text-xl font-HelveticaNeueRoman">
                        {formatTime(reminder?.dueDateTime)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Separator line */}
                <View className="h-px items-center bg-gray-200 w-11/12 mx-auto" />

                {/* Priority */}
                <TouchableOpacity
                  onPress={() => setShowPriorityModal(true)}
                  className="w-full"
                >
                  <View className="flex-row items-center justify-start">
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
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      {renderPriorityModal(showPriorityModal, () =>
        setShowPriorityModal(false)
      )}
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
