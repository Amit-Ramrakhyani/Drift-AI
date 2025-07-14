import React, { useMemo, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
const screenWidth = Dimensions.get("window").width;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getChunkedWeeks(today: Date, startDate: Date) {
  const days = [];
  let dt = new Date(startDate);
  while (dt <= today) {
    days.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  // Chunk from the end (today) backwards
  const chunks = [];
  let i = days.length;
  while (i > 0) {
    const chunkStart = Math.max(0, i - 7);
    chunks.unshift(days.slice(chunkStart, i));
    i -= 7;
  }
  return chunks;
}

type WeekDateProps = {
  startDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const WeekDateBar: React.FC<WeekDateProps> = ({
  startDate,
  selectedDate,
  setSelectedDate,
}) => {
  const today = new Date();

  const weeks = useMemo(
    () => getChunkedWeeks(today, startDate),
    [today, startDate]
  );
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: weeks.length - 1,
        animated: false,
      });
    }, 0);
  }, [weeks.length]);

  return (
    <View className="w-full items-center">
      <FlatList
        ref={flatListRef}
        data={weeks}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `week-${index}`}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item: week }) => (
          <View className="flex-row px-2 w-full" style={{ width: screenWidth }}>
            {week.map((date: Date, i: number) => {
              const isSelected = isSameDay(date, selectedDate);
              const isFuture = date > today;
              return (
                <TouchableOpacity
                  key={date ? date.toISOString() : `empty-${i}`}
                  onPress={() => date && !isFuture && setSelectedDate(date)}
                  disabled={!date || isFuture}
                  className={`flex-1 items-center justify-center ${!date ? "opacity-0" : "opacity-100"}`}
                  style={{ width: screenWidth / 7 }}
                >
                  {date && (
                    <>
                      <View
                        className={`rounded-full bg-transparent border border-dashed w-10 h-10 items-center justify-center ${
                          isSelected ? "border-black" : "border-gray-700"
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            isSelected
                              ? "font-HelveticaNeueHeavy"
                              : "font-HelveticaNeueMedium"
                          }`}
                        >
                          {dayNames[date.getDay()]}
                        </Text>
                      </View>
                      <Text
                        className={`text-sm mt-2 ${
                          isSelected
                            ? "font-HelveticaNeueBold"
                            : "font-HelveticaNeueRoman"
                        }`}
                      >
                        {date.getDate().toString().padStart(2, "0")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
            {/* Fill empty slots if this week has less than 7 days */}
            {Array.from({ length: 7 - week.length }).map((_, i) => (
              <View
                key={`empty-${i}`}
                className="flex-1 items-center justify-center opacity-0"
                style={{ width: screenWidth / 7 }}
              />
            ))}
          </View>
        )}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};

export default WeekDateBar;
