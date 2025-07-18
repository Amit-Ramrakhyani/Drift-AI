import { icons } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { remindersList } from "../(root)/(tabs)/reminder";

const ReminderScreen = () => {
  const { id } = useLocalSearchParams();

  const reminder = remindersList.find((reminder) => reminder.id === id);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 bg-gray-50 mt-10">
        {/* Top Section - Back Button and Star Button */}
        <View className="flex-row items-center justify-between px-6 py-3 mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 mr-4"
          >
            <Image
              source={icons.angleLeft}
              className="w-6 h-6"
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity className="p-2">
            <Image
              source={icons.star}
              className="w-6 h-6"
              tintColor="#000"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Reminder Details */}
        <ScrollView className="px-4 flex-1">
          <View className="flex-row items-center justify-between rounded-2xl bg-white mb-4">
            <Text className="text-xl font-HelveticaNeueMedium p-6">
              lorem ipsum dolor sit amet snfne jefnjnsd feuindfs nfe eufe
            </Text>
          </View>

          {reminder?.status === "completed" && reminder?.dueDateTime && (
            <View className="mb-6">
              <View className="flex-col items-start justify-between rounded-2xl bg-white">
                <View className="flex-row items-center justify-between">
                  <Image
                    source={icons.calendarLines}
                    className="w-6 h-6 ml-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                  <Text className="text-xl font-HelveticaNeueRoman p-6">
                    {reminder?.dueDateTime?.toLocaleString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Text>
                </View>

                {/* Separator line */}
                <View className="h-px items-center bg-gray-200 w-11/12 mx-auto" />

                {/* Priority */}
                <View className="flex-row items-center justify-between ">
                  <Image
                    source={icons.volume}
                    className="w-6 h-6 ml-6"
                    tintColor="#000"
                    resizeMode="contain"
                  />
                  <Text className="text-xl font-HelveticaNeueRoman pl-6 py-6 capitalize">
                    {reminder?.priority}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {reminder?.status === "completed" && reminder?.completedAt && (
            <View className="flex items-end justify-end">
              <Text className="text-lg px-4 capitalize text-gray-400">
                Completed:{" "}
                {reminder?.completedAt?.toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Section - Completed, Edit, Share, Delete Button */}
        {reminder?.status === "pending" ? (
          <View className="flex-row items-center justify-between pl-4 pr-2 py-4">
            <OptionsButton icon={icons.check} label="Complete" />
            <OptionsButton icon={icons.pencil} label="Edit" />
            <OptionsButton icon={icons.share} label="Share" />
            <OptionsButton icon={icons.bin} label="Delete" />
          </View>
        ) : (
          <View className="flex-row items-center justify-between pl-4 pr-2 py-4">
            <OptionsButton icon={icons.rotateRight} label="Restore" />
            <OptionsButton icon={icons.bin} label="Delete" />
          </View>
        )}
      </View>
    </View>
  );
};

export default ReminderScreen;

const OptionsButton = ({ icon, label }: { icon: any; label: string }) => {
  return (
    <TouchableOpacity className="flex-1 mr-5">
      <View className="flex-col items-center">
        <Image
          source={icon}
          className="w-6 h-6 mb-2"
          tintColor="#000"
          resizeMode="contain"
        />
        <Text className="text-sm font-bold">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
