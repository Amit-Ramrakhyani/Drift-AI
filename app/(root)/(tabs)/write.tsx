import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Reminder = () => {
  return (
    <SafeAreaView className="flex flex-1 items-center justify-center">
      <Text className="text-2xl font-bold font-HelveticaNeueBlack">
        Reminder
      </Text>
    </SafeAreaView>
  );
};

export default Reminder;
