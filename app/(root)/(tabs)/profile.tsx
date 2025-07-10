import { SignOutButton } from "@/components/SignOutButton";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className="flex flex-1 items-center justify-center">
      <Text className="text-2xl font-bold font-HelveticaNeueBlack">
        Profile
      </Text>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </SafeAreaView>
  );
};

export default Profile;
