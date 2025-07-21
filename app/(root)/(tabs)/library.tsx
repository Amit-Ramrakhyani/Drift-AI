import {
  DailyCard,
  MonthlyCard,
  WeeklyCard,
  YearlyCard,
} from "@/components/LibraryCards";
import LibraryNavbar from "@/components/LibraryNavbar";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

const dailyEntries = [
  {
    id: 1,
    date: new Date("2025-07-02"),
    title: "Daily Entry 1",
    tags: [
      "travel",
      "food",
      "culture",
      "adventure",
      "fun",
      "new food",
      "learning",
    ],
    content:
      "The first day of the trip was amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
  {
    id: 2,
    date: new Date("2025-07-03"),
    title: "Daily Entry 2",
    tags: ["travel", "food", "culture"],
    content:
      "The second day of the trip was also amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
  {
    id: 3,
    date: new Date("2025-07-04"),
    title: "Daily Entry 3",
    tags: ["travel", "food", "culture"],
    content:
      "The third day of the trip was also amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
  {
    id: 4,
    date: new Date("2025-07-05"),
    title: "Daily Entry 4",
    tags: ["travel", "food", "culture"],
    content:
      "The fourth day of the trip was also amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
  {
    id: 5,
    date: new Date("2025-07-06"),
    title: "Daily Entry 5",
    tags: ["travel", "food", "culture"],
    content:
      "The fifth day of the trip was also amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
  {
    id: 6,
    date: new Date("2025-07-07"),
    title: "Daily Entry 6",
    tags: ["travel", "food", "culture"],
    content:
      "The sixth day of the trip was also amazing! There was a lot of fun activities to do and I met a lot of new people. And I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place. I also got to see a lot of beautiful places. I also got to try a lot of new food. I had a lot of fun and I also learned a lot about the culture of the place.",
  },
];

const weeklyEntries = [
  {
    id: 1,
    startWeek: new Date("2025-07-02"),
    endWeek: new Date("2025-07-08"),
    title: "Weekly Entry 1",
    shortSummary: "Weekly Entry 1 Description",
  },
  {
    id: 2,
    startWeek: new Date("2025-07-09"),
    endWeek: new Date("2025-07-15"),
    title: "Weekly Entry 2",
    shortSummary: "Weekly Entry 2 Description",
  },
];

const monthlyEntries = [
  {
    id: 1,
    month: new Date("2025-07-01"),
    title: "Monthly Entry 1",
    shortSummary: "Monthly Entry 1 Description",
  },
  {
    id: 2,
    month: new Date("2025-08-01"),
    title: "Monthly Entry 2",
    shortSummary: "Monthly Entry 2 Description",
  },
];

const yearlyEntries = [
  {
    id: 1,
    year: new Date("2025-01-01"),
    title: "Yearly Entry 1",
    shortSummary: "Yearly Entry 1 Description",
  },
  {
    id: 2,
    year: new Date("2026-01-01"),
    title: "Yearly Entry 2",
    shortSummary: "Yearly Entry 2 Description",
  },
];

const Library = () => {
  const { theme } = useTheme();
  const [navbarState, setNavbarState] = useState<string>("daily");
  const navbarOptions = ["daily", "weekly", "monthly", "yearly"];

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <View className="flex-1 bg-gray-50 mt-10">
        <LibraryNavbar
          navbarState={navbarState}
          setNavbarState={setNavbarState}
          navbarOptions={navbarOptions}
        />
        {navbarState === "daily" && (
          <FlatList
            data={dailyEntries}
            renderItem={({ item }) => <DailyCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
        {navbarState === "weekly" && (
          <FlatList
            data={weeklyEntries}
            renderItem={({ item }) => <WeeklyCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
        {navbarState === "monthly" && (
          <FlatList
            data={monthlyEntries}
            renderItem={({ item }) => <MonthlyCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
        {navbarState === "yearly" && (
          <FlatList
            data={yearlyEntries}
            renderItem={({ item }) => <YearlyCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        )}
      </View>
    </View>
  );
};

export default Library;
