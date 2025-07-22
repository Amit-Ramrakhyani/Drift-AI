import ReminderItem from "@/components/ReminderItem";
import ReminderToolBar from "@/components/ReminderToolBar";
import { remindersList } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { ReminderFieldProps } from "@/types/type";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

const Reminder = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] =
    useState<ReminderFieldProps[]>(remindersList);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Implement the refresh reminders logic here - fetching the latest reminders and update the reminders state
    setRefreshing(true);
    setTimeout(() => {
      setReminders([
        ...reminders,
        {
          id: "10",
          title: "Reminder 10",
          description: "Description 10",
          dueDateTime: new Date(),
          createdAt: new Date(),
          status: "pending",
          priority: "high",
        },
      ]);
      setRefreshing(false);
    }, 1500);
  };

  const today = new Date();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );

  const sortedReminders = reminders.sort(
    (a, b) => (a.dueDateTime?.getTime() || 0) - (b.dueDateTime?.getTime() || 0)
  );

  const pastReminders = sortedReminders.filter(
    (reminder) => reminder.dueDateTime && reminder.dueDateTime < new Date()
  );

  const todayReminders = sortedReminders.filter(
    (reminder) =>
      reminder.dueDateTime &&
      reminder.dueDateTime > new Date() &&
      reminder.dueDateTime <= endOfDay
  );

  const soonReminders = sortedReminders.filter(
    (reminder) => reminder.dueDateTime && reminder.dueDateTime > endOfDay
  );

  const noAlarmReminders = sortedReminders.filter(
    (reminder) => !reminder.dueDateTime
  );

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <View className="flex-1 bg-gray-50 mt-10">
        <ReminderToolBar />
        <ScrollView
          className="flex-1 bg-gray-50 mx-2 pt-3"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {pastReminders.length > 0 && (
            <ReminderSection title="Past" reminders={pastReminders} />
          )}
          {todayReminders.length > 0 && (
            <ReminderSection title="Today" reminders={todayReminders} />
          )}
          {soonReminders.length > 0 && (
            <ReminderSection title="Upcoming" reminders={soonReminders} />
          )}
          {noAlarmReminders.length > 0 && (
            <ReminderSection title="No Alert" reminders={noAlarmReminders} />
          )}

          {/* Buttom padding */}
          <View className="h-20 mb-14" />
        </ScrollView>
      </View>
    </View>
  );
};

const ReminderSection = ({
  title,
  reminders,
}: {
  title: string;
  reminders: ReminderFieldProps[];
}) => {
  return (
    <>
      <View className="flex-1 items-start justify-center mx-4 mt-4">
        <Text className="text-xl font-HelveticaNeueMedium">{title}</Text>
      </View>
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </>
  );
};

export default Reminder;
