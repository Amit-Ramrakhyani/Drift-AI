import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  ScrollView,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Animate form section up and fade out top section
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        // Animate form section down and fade in top section
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [slideAnim, opacityAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setShowSuccessModal(true);
        setShowErrorModal(false);
        setCountdown(3);
      } else {
        setShowErrorModal(true);
        setShowSuccessModal(false);
        // console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      setShowErrorModal(true);
      setShowSuccessModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Image Section - Animated fade out when keyboard is visible */}
        <Animated.View
          className="w-full h-[400px] bg-primary-500 rounded-b-3xl"
          style={{
            opacity: opacityAnim,
            transform: [
              {
                translateY: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          }}
        >
          <Image
            source={images.signUp}
            className="w-full h-[400px] rounded-b-3xl opacity-15"
          />
          <View className="absolute top-0 left-0 right-0 bottom-0">
            <Image
              source={images.logo}
              className="w-20 h-20 rounded-full mx-auto mt-40 z-10"
            />
            <Text className="text-white text-3xl font-HelveticaNeueBold mx-5 mt-10 text-center z-10">
              Welcome Back! 👋
            </Text>
          </View>
        </Animated.View>

        {/* Form Section - Animated slide up when keyboard is visible */}
        <Animated.View
          className="bg-general-50 min-h-screen justify-center items-center"
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -300], // Slide up by 200 units when keyboard is visible
                }),
              },
            ],
          }}
        >
          <View className="bg-white w-full h-full rounded-3xl shadow-lg px-6 py-8 mt-[-40px] z-10">
            <InputField
              placeholder="Email"
              icon={icons.email}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              containerStyle="border-b border-gray-400 mb-4 rounded-none px-0"
              inputStyle="bg-transparent"
            />
            <InputField
              placeholder="Password"
              icon={icons.password}
              secureTextEntry={secureTextEntry}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              containerStyle="border-b border-gray-400 mb-4 rounded-none px-0"
              inputStyle="bg-transparent"
              isPassword={true}
              setSecureTextEntry={setSecureTextEntry}
            />

            <CustomButton
              title={isLoading ? "Signing In..." : "Sign In"}
              className={`mt-6 ${isLoading ? "opacity-50" : ""}`}
              onPress={onSignInPress}
              disabled={isLoading}
            />

            <OAuth isSignIn={true} />

            <View className="flex-row justify-center items-center mt-8">
              <Text>Don't have an account? </Text>
              <Link
                href="/(auth)/sign-up"
                className="text-center text-general-200"
              >
                <Text className="text-black font-HelveticaNeueBold underline">
                  Sign up
                </Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Verification Modal */}
      <ReactNativeModal isVisible={showSuccessModal}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
          <Image
            source={images.check}
            className="w-[110px] h-[110px] mx-auto my-5"
          />
          <Text className="text-center text-3xl font-JakartaBold">
            Signed In
          </Text>
          <Text className="text-center text-base font-Jakarta text-gray-400 mt-2">
            You have successfully signed in.
          </Text>
          <Text className="text-center text-base font-Jakarta text-gray-400 mt-2">
            Redirecting in {countdown} seconds...
          </Text>
          {!countdown && <Redirect href="/" />}
        </View>
      </ReactNativeModal>

      {/* Error Modal */}
      <ReactNativeModal isVisible={showErrorModal}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[200px]">
          <Text className="text-2xl font-HelveticaNeueBold ">
            Invalid Email or Password
          </Text>
          <Text className="text-base font-Jakarta text-gray-400 mt-2">
            Please try again and make sure you've entered correct email and
            password.
          </Text>
          <CustomButton
            title="Try Again"
            className="mt-5 bg-success-500"
            onPress={() => {
              setShowErrorModal(false);
              setShowSuccessModal(false);
            }}
          />
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default SignIn;
