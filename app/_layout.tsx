import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./globals.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    HelveticaNeueBlack: require("@/assets/fonts/HelveticaNeueBlack.otf"),
    HelveticaNeueBlackItalic: require("@/assets/fonts/HelveticaNeueBlackItalic.otf"),
    HelveticaNeueBold: require("@/assets/fonts/HelveticaNeueBold.otf"),
    HelveticaNeueBoldItalic: require("@/assets/fonts/HelveticaNeueBoldItalic.otf"),
    HelveticaNeueHeavy: require("@/assets/fonts/HelveticaNeueHeavy.otf"),
    HelveticaNeueHeavyItalic: require("@/assets/fonts/HelveticaNeueHeavyItalic.otf"),
    HelveticaNeueItalic: require("@/assets/fonts/HelveticaNeueItalic.otf"),
    HelveticaNeueLight: require("@/assets/fonts/HelveticaNeueLight.otf"),
    HelveticaNeueLightItalic: require("@/assets/fonts/HelveticaNeueLightItalic.otf"),
    HelveticaNeueMedium: require("@/assets/fonts/HelveticaNeueMedium.otf"),
    HelveticaNeueMediumItalic: require("@/assets/fonts/HelveticaNeueMediumItalic.otf"),
    HelveticaNeueRoman: require("@/assets/fonts/HelveticaNeueRoman.otf"),
    HelveticaNeueThin: require("@/assets/fonts/HelveticaNeueThin.otf"),
    HelveticaNeueThinItalic: require("@/assets/fonts/HelveticaNeueThinItalic.otf"),
    HelveticaNeueUltraLight: require("@/assets/fonts/HelveticaNeueUltraLight.otf"),
    HelveticaNeueUltraLightItalic: require("@/assets/fonts/HelveticaNeueUltraLightItalic.otf"),
  });

  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
