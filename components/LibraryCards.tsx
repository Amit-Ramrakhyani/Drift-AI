import { dailyEntries } from "@/constants";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";

const DailyCard = ({ item }: { item: any }) => {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(item.date);
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(item.date);

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("#E5E7EB", false)}
      onPress={() => {
        console.log("Pressed");
      }}
    >
      <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 min-w-0 text-xs text-gray-400 font-HelveticaNeueMedium uppercase">
            {date}
          </Text>
          <Text className="flex-1 min-w-0 text-xs text-gray-400 font-HelveticaNeueMedium uppercase text-right">
            {day}
          </Text>
        </View>

        <Text className="text-xl font-HelveticaNeueBold my-2" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {item.tags.map((tag: string) => (
            <Text
              className="text-sm text-gray-400 font-HelveticaNeueMedium rounded-2xl border border-gray-400 px-2 capitalize flex-shrink-0 overflow-visible"
              key={tag}
            >
              {tag}
            </Text>
          ))}
        </View>

        <Text
          className="text-sm text-gray-700 font-HelveticaNeueMedium"
          numberOfLines={2}
        >
          {item.content}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const WeeklyCard = ({ item }: { item: any }) => {
  const startDate = new Date(item.startWeek);
  const endDate = new Date(item.endWeek);
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startDateString = dateString.format(startDate);
  const endDateString = dateString.format(endDate);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sort them by date
  const sortedDailyEntries = dailyEntries.sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });

  // Filter out the notes of the days that are in this week using the daily entries
  const filteredDailyEntries = sortedDailyEntries.filter((entry) => {
    return entry.date >= startDate && entry.date <= endDate;
  });

  return (
    <View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#E5E7EB", false)}
        onPress={() => {
          setIsModalVisible(true);
        }}
      >
        <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-400 font-HelveticaNeueMedium uppercase">
              {startDateString}
            </Text>
            <View className="flex-1 h-px bg-gray-300 mx-2" />
            <Text className="text-xs text-gray-400 font-HelveticaNeueMedium uppercase">
              {endDateString}
            </Text>
          </View>
          <Text className="text-xl font-HelveticaNeueBold my-2">
            Week {item.id}
          </Text>
          <Text className="text-sm text-gray-700 font-HelveticaNeueMedium mb-2">
            {item.shortSummary}
          </Text>
          {/* Increase the touchable area of the button */}
          <TouchableOpacity>
            <Text className="text-right text-sm text-[#3A04FF] font-HelveticaNeueMedium">
              Summarize
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableNativeFeedback>

      <ReactNativeModal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          if (isMounted.current) setIsModalVisible(false);
        }}
        onBackButtonPress={() => {
          if (isMounted.current) setIsModalVisible(false);
        }}
      >
        <View className="flex-col space-y-3">
          {filteredDailyEntries.length > 0 ? (
            filteredDailyEntries.map((entry) => (
              <View key={entry.id} className="min-h-[44px]">
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple("#E5E7EB", false)}
                  onPress={() => {
                    console.log("Pressed");
                  }}
                >
                  <View className="flex-row items-center">
                    {/* Date box */}
                    <View className="bg-white rounded-xl p-4 mr-3 m-2 w-[90px] items-center justify-center">
                      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
                        {entry.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                    {/* Title and summary */}
                    <View className="flex-1 bg-white rounded-xl p-4">
                      <Text
                        className="text-sm text-gray-700 font-HelveticaNeueMedium"
                        numberOfLines={1}
                      >
                        {entry.content ? entry.content.slice(0, 40) : ""}
                      </Text>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              </View>
            ))
          ) : (
            <View className="flex items-center justify-center bg-white rounded-xl p-4">
              <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
                No entries found for this week
              </Text>
            </View>
          )}
        </View>
      </ReactNativeModal>
    </View>
  );
};

const MonthlyCard = ({ item }: { item: any }) => {
  const dateString = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(item.month);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {dateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

const YearlyCard = ({ item }: { item: any }) => {
  const dateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(item.year);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {dateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

export { DailyCard, MonthlyCard, WeeklyCard, YearlyCard };
