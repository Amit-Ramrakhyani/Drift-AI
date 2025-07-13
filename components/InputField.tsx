import { icons } from "@/constants";
import { InputFieldProps } from "@/types/type";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
const InputField = ({
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  isPassword = false,
  setSecureTextEntry,
  ...props
}: InputFieldProps) => (
  <KeyboardAvoidingView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 m-full">
        <View
          className={`flex flex-row mx-2 items-center justify-start relative rounded-full focus:border-primary-500 ${containerStyle}`}
        >
          {icon && (
            <Image
              source={icon}
              className={`w-6 h-6 ${iconStyle}`}
              tintColor="#444"
            />
          )}
          <TextInput
            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
            secureTextEntry={secureTextEntry}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              className="mr-4"
              onPress={() => {
                setSecureTextEntry?.(!secureTextEntry);
              }}
            >
              <Image
                source={secureTextEntry ? icons.eyecross : icons.eye}
                className="w-6 h-6"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export default InputField;
