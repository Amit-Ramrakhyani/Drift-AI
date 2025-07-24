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
import { FlatList, RefreshControl, View } from "react-native";

const Library = () => {
  const { theme } = useTheme();
  const [navbarState, setNavbarState] = useState<string>("daily");
  const navbarOptions = ["daily", "weekly", "monthly", "yearly"];
  const [refreshing, setRefreshing] = useState(false);
  const [editDailyEntries, setEditDailyEntries] = useState(dailyEntries);
  const [editWeeklyEntries, setEditWeeklyEntries] = useState(weeklyEntries);
  const [editMonthlyEntries, setEditMonthlyEntries] = useState(monthlyEntries);
  const [editYearlyEntries, setEditYearlyEntries] = useState(yearlyEntries);

  const onRefresh = ({ navbarState }: { navbarState: string }) => {
    // Implement the refresh reminders logic here - fetching the latest reminders and update the reminders state
    setRefreshing(true);
    setTimeout(() => {
      if (navbarState === "daily") {
        setEditDailyEntries([
          ...editDailyEntries,
          {
            id: 10,
            date: new Date(),
            title: "Reminder 10",
            tags: ["tag1", "tag2"],
            content:
              "This is a new daily entry for testing the refresh functionality.",
          },
        ]);
      } else if (navbarState === "weekly") {
        setEditWeeklyEntries([
          ...editWeeklyEntries,
          {
            id: 10,
            startWeek: new Date(),
            endWeek: new Date(),
            tags: ["tag1", "tag2"],
            shortSummary: "Short Summary 10",
            summary: "Summary 10",
          },
        ]);
      } else if (navbarState === "monthly") {
        setEditMonthlyEntries([
          ...editMonthlyEntries,
          {
            id: 10,
            month: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            majorTasks: ["Task 1", "Task 2", "Task 3"],
          },
        ]);
      } else if (navbarState === "yearly") {
        setEditYearlyEntries([
          ...editYearlyEntries,
          {
            id: 10,
            year: new Date(),
            title: "Reminder 10",
            shortSummary: "Short Summary 10",
          },
        ]);
      }
      setRefreshing(false);
    }, 1500);
  };

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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh({ navbarState: "daily" })}
              />
            }
            data={editDailyEntries.reverse()}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh({ navbarState: "weekly" })}
              />
            }
            data={editWeeklyEntries.reverse()}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh({ navbarState: "monthly" })}
              />
            }
            data={editMonthlyEntries.reverse()}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh({ navbarState: "yearly" })}
              />
            }
            data={editYearlyEntries.reverse()}
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
