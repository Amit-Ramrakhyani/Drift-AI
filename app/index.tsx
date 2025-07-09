import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text>Edit src/index.tsx to edit this screen.</Text>
      <Link href="/(auth)/welcome">
        <Text className="text-blue-500 font-HelveticaNeueBlackItalic">
          Welcome
        </Text>
      </Link>
    </SafeAreaView>
  );
};

export default Index;
