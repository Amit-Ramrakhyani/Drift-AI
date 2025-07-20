import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface InputFieldProps extends TextInputProps {
    icon?: any;
    secureTextEntry?: boolean;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
    isPassword?: boolean;
    setSecureTextEntry?: (secureTextEntry: boolean) => void;
}

declare interface ReminderFieldProps extends TextInputProps {
  id: string;
  title: string;
  description?: string;
  dueDateTime?: Date;
  allDay?: boolean;

  category?: string;
  status?: "pending" | "completed" | "cancelled" | "missed";
  priority?: string | "low" | "medium" | "high";

  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;

  isStarred?: boolean;
  isSnoozed?: boolean;

  repeat?: {
    type: "daily" | "weekly" | "monthly" | "yearly" | "custom";
    interval?: number;
    daysOfWeek?: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  };

//   location?: {
//     name?: string;
//     latitude: number;
//     longitude: number;
//     radius?: number;
//     trigger?: "arrive" | "leave";
//   };

//   reminderAlarm?: {
//     timeBefore: number; // in minutes
//     method?: "notification" | "alarm";
//   };

  attachedImages?: {
    uri: string;
  }[];

  tags?: string[];
//   sourceApp?: string;
}
