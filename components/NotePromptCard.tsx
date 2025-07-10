import { icons } from "@/constants";
import { Image, Text, TouchableOpacity, View } from "react-native";

type NotePromptCardProps = {
  promptText?: string;
  containerStyle?: string;
  textStyle?: string;
  className?: string;
  onPress?: () => void;
};

const NotePromptCard = ({
  promptText = "What’s on your mind today?",
  onPress,
  containerStyle,
  textStyle,
  className,
}: NotePromptCardProps) => {
  return (
    <TouchableOpacity
      className={`bg-white border border-black rounded-2xl p-6 relative ${containerStyle}`}
      onPress={onPress}
      activeOpacity={0.5}
    >
      {/* Center the text in the card */}
      <Text
        className={`text-center flex justify-center items-center text-base mt-10 ${textStyle}`}
      >
        {promptText}
      </Text>

      <View className="absolute bottom-0 right-0 w-12 h-12 justify-center items-center">
        <Image
          source={icons.fancyButton}
          className="w-[80px] h-[80px] mr-10 mb-10"
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

export default NotePromptCard;
