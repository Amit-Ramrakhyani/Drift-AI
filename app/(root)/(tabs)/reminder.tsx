import ReminderItem from "@/components/ReminderItem";
import ReminderToolBar from "@/components/ReminderToolBar";
import { ReminderFieldProps } from "@/types/type";
import React from "react";
import { FlatList, Text, View } from "react-native";

const reminders: ReminderFieldProps[] = [
  {
    id: "1",
    title: "Reminder 1",
    description: "Description 1",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Reminder 2",
    description: "Description 2",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2),
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Reminder 3",
    description: "Description 3",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3),
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Reminder 4",
    description: "Description 4",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "Reminder 5",
    description: "Description 5",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 5),
    createdAt: new Date(),
  },
  {
    id: "6",
    title: "Reminder 6",
    description: "Description 6",
    dueDateTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 6),
    createdAt: new Date(),
  },
];

const Reminder = () => {
  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 bg-white mt-10">
        <ReminderToolBar />
        <View className="flex-1 bg-white mx-2">
          <FlatList
            data={reminders}
            renderItem={({ item }) => <ReminderItem reminder={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListHeaderComponent={() => (
              <View className="flex-1 items-center justify-center bg-white my-10">
                <Text className="text-2xl font-bold">Reminders</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Reminder;
