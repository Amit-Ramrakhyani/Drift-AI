import { ReminderFieldProps } from "@/types/type";
import { Text, TouchableOpacity, View } from "react-native";

const ReminderItem = ({ reminder }: { reminder: ReminderFieldProps }) => {
  return (
    <View className="bg-white rounded-3xl shadow-[0px_0px_2px_0px_#1a202c] m-2 p-2 mb-6">
      <TouchableOpacity className="flex-row items-center py-4 px-2 border-b border-gray-100 last:border-b-0">
        <View className="flex-row items-start">
          <TouchableOpacity className="w-7 h-7 rounded-full border border-gray-300 mr-4" />
          <View className="flex-col">
            <Text className="text-lg text-black font-HelveticaNeueMedium mb-4">
              {reminder.title}
            </Text>
            <Text className="text-sm text-gray-500">
              {reminder.dueDateTime?.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReminderItem;
