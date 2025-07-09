import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { Image, Text, View } from "react-native";

const OAuth = () => {
  const handleGoogleSignIn = async () => {
    console.log("Google sign in");
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-slate-400/70"
        IconLeft={() => (
          <Image source={icons.google} className="w-5 h-5 mx-2" />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
