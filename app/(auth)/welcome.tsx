import CustomButton from "@/components/CustomButton";
import { onBoardingData } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const Onboarding = () => {
  const swipeRef = useRef<Swiper>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onBoardingData.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end py-10 pr-10"
      >
        <Text className="text-black text-lg font-HelveticaNeueBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swipeRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 my-5 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 my-5 bg-black rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onBoardingData.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <View className="flex flex-row items-center justify-center w-full mt-5">
              <Text className="text-black text-4xl font-bold mx-10 mb-10 text-center">
                {item.title}
                {activeIndex === 0 ? (
                  <Text className="text-[#3A04FF]">Whisper</Text>
                ) : (
                  ""
                )}
              </Text>
            </View>
            <Image
              source={item.image}
              className="w-[250px] h-[300px]"
              resizeMode="contain"
            />
            <Text className="text-lg font-HelveticaNeueMedium text-center text-[#858585] mx-10 mt-10">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swipeRef.current?.scrollBy(1)
        }
        className="w-11/12 mb-10"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
