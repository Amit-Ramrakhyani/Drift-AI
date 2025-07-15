import NotePromptCard from "@/components/NotePromptCard";
import RecentEntryCard from "@/components/RecentEntryCard";
import WeekDateBar from "@/components/WeekDateBar";
import { icons, images } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const recentEntries = [
  {
    id: 1,
    date: "2025-07-02",
    title: "A day of small victories",
    content:
      "Today I managed to finish that project I’ve been putting off. It wasn’t as hard as I thought and I feel good about it. This means I can focus on the next project and I’m excited to see how it turns out.",
    mood: "good",
  },
  {
    id: 2,
    date: "2025-07-09",
    title: "Morning Reflections",
    content:
      "Woke up early today. The sunrise was beautiful. Feeling a bit low due to cold and headache, but looking forward to the day ahead.",
    mood: "neutral",
  },
  {
    id: 3,
    date: "2025-07-05",
    title: "A day of small victories",
    content:
      "Today I managed to finish that project I’ve been putting off. It wasn’t as hard as I thought and I feel good about it. This means I can focus on the next project and I’m excited to see how it turns out.",
    mood: "bad",
  },
  {
    id: 4,
    date: "2025-07-08",
    title: "A day of small victories",
    content:
      "Today I managed to finish that project I’ve been putting off. It wasn’t as hard as I thought and I feel good about it. This means I can focus on the next project and I’m excited to see how it turns out.",
    mood: "neutral",
  },
];

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const loading = true;

  const date = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  const timesOfDay =
    date.getHours() < 12
      ? "morning"
      : date.getHours() < 18
        ? "afternoon"
        : "evening";

  // Console log the selected date in local time using phone settings
  console.log(selectedDate.toLocaleString());

  return (
    <View className="flex-1 bg-white">
      {/* Flatlist of recent entries card */}
      <FlatList
        data={recentEntries}
        renderItem={({ item }) => (
          <View className="px-4">
            <RecentEntryCard entry={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        className="space-y-3 mb-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col justify-center items-center">
            {loading ? (
              <View className="flex-1 justify-center items-center mt-20">
                <ActivityIndicator size="large" color="black" />
              </View>
            ) : (
              <Text className="text-1xl text-black font-HelveticaNeueMedium mt-20">
                No recent entries
              </Text>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex-1 bg-white">
              <View className="flex-1">
                {/* Top section */}
                <View
                  className="w-full absolute top-0 left-0 h-[300px] z-0"
                  pointerEvents="none"
                >
                  <LinearGradient
                    colors={["#FFE9E9", "#EFF2FF", "rgba(248,246,243,0.0)"]}
                    style={{ width: "100%", height: "100%" }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                  />
                </View>

                {/* Compant name with logo and streak icon */}
                <View className="flex-row items-center justify-between px-5 mt-14 mb-8">
                  <View className="flex-row items-center">
                    <Image source={images.logo} className="w-8 h-8" />
                    <Text className="px-2 pt-1 text-2xl text-black font-HelveticaNeueMedium">
                      Drift AI
                    </Text>
                  </View>
                  <View className="bg-white/80 px-3 py-1 rounded-full flex-row items-center justify-center">
                    <Image
                      source={icons.fire}
                      className="w-4 h-4 mr-1"
                      // tintColor="#FFC000"
                    />
                    <Text className="font-bold text-black font-HelveticaNeueBlack">
                      3
                    </Text>
                  </View>
                </View>

                {/* Date Bar */}
                <WeekDateBar
                  startDate={new Date(date.getFullYear(), date.getMonth(), 1)}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />

                {/* Whispering Streak Section */}
                <View className="justify-between items-start px-4 mt-6">
                  <Text className="text-2xl text-black font-semibold font-HelveticaNeueLight pr-10">
                    You have been whispering for
                  </Text>
                  <Text className="text-5xl font-bold text-black font-HelveticaNeueBlack mt-2">
                    <Text className="text-[#3A04FF]">3</Text> days
                  </Text>
                </View>
                <View className="items-end mx-4 mt-[-10px]">
                  <Image
                    source={images.walkingGirl}
                    className="w-45 h-45"
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Note Prompt Card */}
              <View className="px-4 mt-10">
                <NotePromptCard
                  onPress={() => router.push("/(root)/(tabs)/write")}
                  containerStyle="w-full h-40"
                  textStyle="text-lg text-black font-HelveticaNeueMedium"
                />
              </View>

              {/* Recent Entries Header */}
              <View className="px-5 mt-10 mb-2 flex-row justify-between items-center">
                <Text className="text-2xl text-black font-HelveticaNeueBlack">
                  Recent Entries
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(root)/(tabs)/library")}
                >
                  <Text className="text-[#3A04FF] text-lg font-HelveticaNeueMedium">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default Home;
