import { icons } from "@/constants";
import { Image, Text, View } from "react-native";

const RecentEntryCard = ({ entry }: { entry: any }) => {
  const date = new Date(entry.date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <View className="border border-black rounded-2xl p-4 mt-3">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
          {isYesterday ? "Yesterday" : dateString}
        </Text>
        <Text className="text-xl">
          {entry.mood === "good" ? (
            <Image
              source={icons.happyFace}
              className="w-6 h-6"
              resizeMode="contain"
            />
          ) : entry.mood === "neutral" ? (
            <Image
              source={icons.neutralFace}
              className="w-6 h-6"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.sadFace}
              className="w-6 h-6"
              resizeMode="contain"
            />
          )}
        </Text>
      </View>
      <Text
        className="text-base font-semibold text-black font-HelveticaNeueBlack"
        numberOfLines={1}
      >
        {entry.title}
      </Text>
      <Text
        className="text-sm text-gray-700 mt-1 font-HelveticaNeueMedium"
        numberOfLines={2}
      >
        {entry.content}
      </Text>
    </View>
  );
};

export default RecentEntryCard;
