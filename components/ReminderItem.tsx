import { ReminderFieldProps } from "@/types/type";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

// Format - Yesterday, 11:00 | Today, 16:00 | Tomorrow, 12:00 | Wed, 24 Jul, 15:00
const formatDate = ({ date }: { date: Date }) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();
  const isToday = date.toDateString() === new Date().toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  let dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

  if (isYesterday) dateString = "Yesterday";
  if (isToday) dateString = "Today";
  if (isTomorrow) dateString = "Tomorrow";

  return `${dateString}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const ReminderItem = ({ reminder }: { reminder: ReminderFieldProps }) => {
  return (
    <View className="bg-white rounded-3xl m-2 p-2">
      <TouchableOpacity
        onPress={() => router.push(`/reminder/${reminder.id}`)}
        className="flex-row items-center py-2 px-2 border-b border-gray-100 last:border-b-0"
      >
        <View className="flex-row items-start">
          <TouchableOpacity className="w-6 h-6 rounded-full border-2 border-[#3A04FF] mr-4" />
          <View className="flex-col items-start justify-between">
            <Text className="text-lg text-black font-HelveticaNeueRomanr">
              {reminder.title}
            </Text>
            {reminder.dueDateTime && (
              <Text
                className={`text-sm ${
                  reminder.dueDateTime < new Date()
                    ? "text-red-500"
                    : "text-gray-500"
                } mt-3`}
              >
                {formatDate({ date: reminder.dueDateTime })}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReminderItem;
