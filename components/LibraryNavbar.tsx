import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LibraryNavbarProps {
  navbarState: string;
  setNavbarState: (value: string) => void;
  navbarOptions: string[];
}

const LibraryNavbar: React.FC<LibraryNavbarProps> = ({
  navbarState,
  setNavbarState,
  navbarOptions,
}) => {
  const [optionLayouts, setOptionLayouts] = useState<
    { x: number; width: number }[]
  >([]);
  const sliderAnim = useRef(new Animated.Value(0)).current;

  // Update slider position when navbarState changes
  useEffect(() => {
    const index = navbarOptions.indexOf(navbarState);
    if (optionLayouts.length === navbarOptions.length) {
      Animated.spring(sliderAnim, {
        toValue: optionLayouts[index]?.x || 0,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navbarState, optionLayouts.length]);

  // Capture layout of each option
  const handleOptionLayout = (index: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setOptionLayouts((prev) => {
      const next = [...prev];
      next[index] = { x, width };
      return next;
    });
  };

  return (
    <>
      <View className="flex-row items-center justify-between rounded-3xl bg-black px-6 py-4 m-4 mb-8 h-20 relative overflow-hidden shadow-md shadow-black">
        {optionLayouts.length === navbarOptions.length && (
          <Animated.View
            className="absolute h-16 rounded-3xl w-24 top-2 bg-white z-1"
            style={{
              left: Animated.add(
                sliderAnim,
                optionLayouts[0]?.width
                  ? (optionLayouts[navbarOptions.indexOf(navbarState)].width -
                      80) /
                      2 -
                      2
                  : 0
              ),
            }}
          />
        )}
        {navbarOptions.map((option, idx) => (
          <TouchableOpacity
            key={option}
            className="flex-row items-center justify-center px-3 h-full"
            onPress={() => setNavbarState(option)}
            onLayout={(e) => handleOptionLayout(idx, e)}
            style={{ zIndex: 2 }}
            activeOpacity={0.8}
          >
            <Text
              className={`text-lg capitalize leading-none 
              ${navbarState === option ? "text-black" : "text-white"}
              ${navbarState === option ? "font-HelveticaNeueMedium" : "font-HelveticaNeueRoman"}
            `}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default LibraryNavbar;
