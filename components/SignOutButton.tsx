import { useClerk } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      <Redirect href="/" />;
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text className="font-HelveticaNeueMedium text-lg text-[#3A04FF]">
        Sign out
      </Text>
    </TouchableOpacity>
  );
};
