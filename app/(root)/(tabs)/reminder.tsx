import ReminderItem from "@/components/ReminderItem";
import ReminderToolBar from "@/components/ReminderToolBar";
import { ReminderFieldProps } from "@/types/type";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

// Set const time to 18 July, 2025 16:20 PM
const date = new Date(2025, 6, 18, 16, 17);

export const remindersList: ReminderFieldProps[] = [
  {
    id: "1",
    title: "Reminder 1",
    description: "Description 1",
    dueDateTime: date,
    createdAt: new Date(),
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    title: "Reminder 2",
    description: "Description 2",
    dueDateTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
    createdAt: new Date(),
    status: "pending",
    priority: "medium",
  },
  {
    id: "4",
    title: "Reminder 4",
    description: "Description 4",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),
    createdAt: new Date(),
    status: "completed",
    completedAt: new Date(),
    priority: "low",
  },
  {
    id: "5",
    title: "Reminder 5",
    description: "Description 5",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 5),
    createdAt: new Date(),
    status: "pending",
    priority: "medium",
  },
  {
    id: "6",
    title: "Reminder 6",
    description: "Description 6",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 6),
    createdAt: new Date(),
    status: "pending",
    priority: "low",
  },
  {
    id: "3",
    title: "Reminder 3",
    description: "Description 3",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
    createdAt: new Date(),
    status: "pending",
  },
  {
    id: "7",
    title: "Reminder 7",
    description: "Description 7",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
    createdAt: new Date(),
  },
  {
    id: "8",
    title: "Reminder 8",
    description: "Description 8",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 8),
    createdAt: new Date(),
  },
  {
    id: "9",
    title: "Reminder 9",
    description: "Description 9",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 9),
    createdAt: new Date(),
  },
];

const Reminder = () => {
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
    <View className="flex-1 bg-black">
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
