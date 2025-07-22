import {
  DailyCard,
  MonthlyCard,
  WeeklyCard,
  YearlyCard,
} from "@/components/LibraryCards";
import LibraryNavbar from "@/components/LibraryNavbar";
import {
  dailyEntries,
  monthlyEntries,
  weeklyEntries,
  yearlyEntries,
} from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

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
            data={dailyEntries.reverse()}
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
            data={weeklyEntries.reverse()}
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
