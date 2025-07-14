import { icons } from "@/constants";
import { SignOut } from "@/lib/auth";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const personality = "Warrior";
const supportEmail = "support@driftai.com";

const Profile = () => {
  const { user } = useUser();
  const router = useRouter();

  // Handlers for navigation
  const handleEditName = () => router.push("/(profile)/edit-name");
  const handlePersonalDetails = () =>
    router.push("/(profile)/personal-details");
  const handlePreferences = () => router.push("/(profile)/preferences");
  const handleTerms = () => router.push("/(profile)/terms");
  const handlePrivacy = () => router.push("/(profile)/privacy");
  const handleSupportEmail = () => {
    Linking.openURL(`mailto:${supportEmail}`);
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete account");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        {/* Multi color horizontal light Gradient Background */}
        <View
          className="w-full absolute top-0 left-0"
          style={{ height: "33%", zIndex: 0 }}
          pointerEvents="none"
        >
          <LinearGradient
            colors={["#FFE9E9", "#EFF2FF", "rgba(248,246,243,0.0)"]}
            style={{ width: "100%", height: "100%" }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>

        {/* Header - Logo and Streak */}
        <View className="p-4 px-5 flex-row justify-between items-start mt-12">
          <Text className="text-3xl font-HelveticaNeueMedium">Settings</Text>
        </View>

        <ScrollView className="px-4 py-6 flex-1">
          {/* Header Card */}
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-3xl shadow-[0px_1px_2px_0px_#1a202c] p-4 mb-6"
            onPress={handleEditName}
            style={{ zIndex: 1 }}
          >
            <View className="w-16 h-16 rounded-full bg-gray-50 items-center justify-center mr-4">
              <Image
                source={icons.profileFocused}
                className="w-7 h-7"
                tintColor="#222"
              />
            </View>
            <View>
              <Text className="text-xl text-black font-HelveticaNeueHea">
                {user?.fullName || "Nick"}
              </Text>
              <Text className="text-base text-gray-500 mt-1 font-HelveticaNeueMedium">
                {personality}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Card List */}
          <View className="bg-white rounded-3xl shadow-[0px_1px_2px_0px_#1a202c] p-2 mb-6">
            <ProfileItem
              icon={icons.profile}
              label="Personal details"
              onPress={handlePersonalDetails}
            />
            <View className="h-px items-center bg-gray-200 m-2" />
            <ProfileItem
              icon={icons.preferences}
              label="Preferences"
              onPress={handlePreferences}
            />
          </View>
          <View className="bg-white rounded-3xl shadow-[0px_1px_2px_0px_#1a202c] p-2 mb-6">
            <ProfileItem
              icon={icons.terms}
              label="Terms and Conditions"
              onPress={handleTerms}
            />
            <View className="h-px items-center bg-gray-200 m-2" />
            <ProfileItem
              icon={icons.privacy}
              label="Privacy Policy"
              onPress={handlePrivacy}
            />
            <View className="h-px items-center bg-gray-200 m-2" />
            <ProfileItem
              icon={icons.email}
              label="Support Email"
              onPress={handleSupportEmail}
            />
          </View>
          {/* Delete Account */}
          <View className="bg-white rounded-3xl shadow-[0px_0px_2px_0px_#1a202c] p-2 mb-6">
            <ProfileItem
              icon={icons.deleteAccount}
              label="Delete Account?"
              onPress={handleDeleteAccount}
            />
          </View>

          {/* Sign Out */}
          <View className="bg-white rounded-3xl shadow-[0px_0px_2px_0px_#1a202c] p-2 mb-6">
            <ProfileItem
              icon={icons.signOut}
              label="Sign Out"
              onPress={SignOut}
            />
          </View>

          {/* Version */}
          <View className="bg-transparent items-center justify-center">
            <Text className="text-xs text-black font-HelveticaNeueRoman uppercase">
              Version 1.0.0
            </Text>
          </View>

          {/* Padding  */}
          <View className="h-40" />
        </ScrollView>
      </View>
    </View>
  );
};

interface ProfileItemProps {
  icon: any;
  label: string;
  onPress: () => void;
  labelClass?: string;
}

const ProfileItem = ({
  icon,
  label,
  onPress,
  labelClass = "",
}: ProfileItemProps) => (
  <TouchableOpacity
    className="flex-row items-center py-4 px-2 border-b border-gray-100 last:border-b-0"
    onPress={onPress}
  >
    <Image source={icon} className="w-6 h-6 mr-4" tintColor="#444" />
    <Text className={`text-lg text-black ${labelClass}`}>{label}</Text>
  </TouchableOpacity>
);

export default Profile;
