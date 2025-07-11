import NotePromptCard from "@/components/NotePromptCard";
import RecentEntryCard from "@/components/RecentEntryCard";
import { icons, images } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
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
            {/* Top Gradient Section */}
            <View className="flex-1 bg-white">
              <View className="w-full h-[150px]">
                <Image
                  source={images.darkGradient}
                  className="w-full h-full absolute opacity-50"
                  resizeMode="cover"
                />
                <View className="px-4 pt-4 flex-row justify-between items-start mt-10">
                  <View>
                    <Text className="text-lg text-black mt-6 font-HelveticaNeueMedium">
                      {dateString}
                    </Text>
                    <Text className="text-3xl font-HelveticaNeueHeavy">
                      Good {timesOfDay}, {user?.firstName || "Nick"}!
                    </Text>
                  </View>
                  <View className="bg-white/80 px-3 py-1 rounded-full flex-row items-center justify-center mt-14">
                    <Image
                      source={icons.starFilled}
                      className="w-4 h-4 mr-1"
                      tintColor="#FFC000"
                    />
                    <Text className="font-bold text-black font-HelveticaNeueBlack">
                      15
                    </Text>
                  </View>
                </View>
              </View>

              {/* Whispering Streak Section */}
              <View className="justify-between items-start px-4 mt-6">
                <Text className="text-2xl text-black font-semibold font-HelveticaNeueLight pr-10">
                  You have been whispering for
                </Text>
                <Text className="text-5xl font-bold text-black font-HelveticaNeueBlack mt-2">
                  <Text className="text-[#3A04FF]">15</Text> days
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
          </>
        )}
      />
    </View>
  );
};

export default Home;
