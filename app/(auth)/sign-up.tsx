import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  ScrollView,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  // This countdown should start after the user enters the verification code and verifies it
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        // await fetchAPI("/(api)/user", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     name: form.name,
        //     email: form.email,
        //     clerkId: signUpAttempt.createdUserId,
        //   }),
        // });
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
        setCountdown(3);
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed. Please try again.",
        });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors[0].message,
      });
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
              Create Account
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
                  outputRange: [0, -300], // Slide up by 300 units when keyboard is visible
                }),
              },
            ],
          }}
        >
          <View className="bg-white w-full h-full rounded-3xl shadow-lg px-6 py-8 mt-[-40px] z-10">
            <InputField
              placeholder="Name"
              icon={icons.profile}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              containerStyle="border-b border-gray-400 mb-1 rounded-none px-0"
              inputStyle="bg-transparent"
              isPassword={false}
            />
            <InputField
              placeholder="Email"
              icon={icons.email}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              containerStyle="border-b border-gray-400 mb-1 rounded-none px-0"
              inputStyle="bg-transparent"
              isPassword={false}
            />
            {/* Implement show password feature */}
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
              title={isLoading ? "Signing Up..." : "Sign Up"}
              className={`bg-primary-500 w-full mt-3 shadow-slate-400/70 ${
                isLoading ? "opacity-50" : ""
              }`}
              onPress={onSignUpPress}
              disabled={isLoading}
            />
            <OAuth isSignIn={false} />
            <View className="flex-row justify-center items-center mt-8">
              <Text>Already have an account? </Text>
              <Link
                href="/(auth)/sign-in"
                className="text-center text-general-200"
              >
                <Text className="text-black font-HelveticaNeueBold underline">
                  Log In
                </Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <ReactNativeModal
        isVisible={verification.state === "pending"}
        onModalHide={() => {
          if (verification.state === "success") {
            setShowSuccessModal(true);
          }
        }}
      >
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
          <Text className="text-2xl font-JakartaExtraBold mb-2">
            Verification
          </Text>
          <Text className="font-Jakarta mb-5">
            We've sent a verification code to {form.email}
          </Text>
          {/* Add border around the input field */}
          <InputField
            icon={icons.password}
            iconStyle="ml-4"
            placeholder="123456"
            value={verification.code}
            keyboardType="numeric"
            containerStyle="border border-gray-400 rounded-full"
            onChangeText={(code) =>
              setVerification({
                ...verification,
                code: code,
              })
            }
          />

          {verification.error && (
            <Text className="text-red-500 text-sm mt-1">
              {verification.error}
            </Text>
          )}

          <CustomButton
            title={isLoading ? "Verifying..." : "Verify Email"}
            className={`mt-5 bg-success-500 ${isLoading ? "opacity-50" : ""}`}
            onPress={onVerifyPress}
            disabled={isLoading}
          />
        </View>
      </ReactNativeModal>

      <ReactNativeModal isVisible={showSuccessModal}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
          <Image
            source={images.check}
            className="w-[110px] h-[110px] mx-auto my-5"
          />
          <Text className="text-center text-3xl font-JakartaBold">
            Verified
          </Text>
          <Text className="text-center text-base font-Jakarta text-gray-400 mt-2">
            You have successfully verified your account.
          </Text>
          <Text className="text-center text-base font-Jakarta text-gray-400 mt-2">
            Redirecting in {countdown} seconds...
          </Text>
          {!countdown && <Redirect href="/" />}
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default SignUp;
