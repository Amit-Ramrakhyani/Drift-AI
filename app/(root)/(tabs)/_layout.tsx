"use client";

import { icons } from "@/constants";
import { Tabs, useRouter, useSegments } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  type ImageSourcePropType,
  Pressable,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";

const TabIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => (
  <View className="flex flex-row justify-center items-center rounded-full w-4 h-4">
    <Image
      source={source}
      tintColor={focused ? "white" : "gray"}
      resizeMode="contain"
      className="w-7 h-7"
    />
  </View>
);

const NavbarBackground = () => (
  <Svg width="412" height="66" viewBox="0 0 412 66" fill="none">
    <Path
      d="M431 55C431 63.2843 424.284 70 416 70H-3.99999C-12.2843 70 -19 63.2843 -19 55V15C-19 6.71573 -12.2843 0 -4 0H158.359C166.505 0 172.862 6.82396 176.522 14.1022C181.982 24.959 193.223 32.4082 206.204 32.4082C219.185 32.4081 230.426 24.9589 235.886 14.1022C239.546 6.82397 245.903 0 254.05 0H416C424.284 0 431 6.71573 431 15V55Z"
      fill="black"
    />
  </Svg>
);

const Layout = () => {
  const router = useRouter();
  const segments = useSegments();
  const isWriteButtonPressed = segments[segments.length - 1] === "write";
  const rotation = useRef(
    new Animated.Value(isWriteButtonPressed ? 1 : 0)
  ).current;

  // Animate rotation when route changes
  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: isWriteButtonPressed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isWriteButtonPressed]);

  const handleWritePress = () => {
    if (isWriteButtonPressed) {
      router.back();
    } else {
      router.push("/(root)/(tabs)/write");
    }
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View className="flex-1">
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            overflow: "visible",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () => (
            <View className="absolute items-center justify-center left-0 right-0 bottom-0">
              <NavbarBackground />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={focused ? icons.homeFocused : icons.home}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={focused ? icons.libraryFocused : icons.library}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="write"
          options={{
            tabBarButton: () => (
              <Pressable
                onPress={handleWritePress}
                className="top-[-35px] justify-center items-center"
              >
                <View className="w-16 h-16 rounded-full bg-[#3A04FF] justify-center items-center shadow-md shadow-black">
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <Image
                      source={icons.plus}
                      tintColor="white"
                      resizeMode="contain"
                      className="w-6 h-6"
                    />
                  </Animated.View>
                </View>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="reminder"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={focused ? icons.reminderFocused : icons.reminder}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                source={focused ? icons.profileFocused : icons.profile}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default Layout;
