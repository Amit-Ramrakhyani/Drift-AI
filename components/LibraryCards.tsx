import { Text, View } from "react-native";

const DailyCard = ({ item }: { item: any }) => {
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(item.date);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {dateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

const WeeklyCard = ({ item }: { item: any }) => {
  const startDate = new Date(item.startWeek);
  const endDate = new Date(item.endWeek);
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const startDateString = dateString.format(startDate);
  const endDateString = dateString.format(endDate);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {startDateString} - {endDateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

const MonthlyCard = ({ item }: { item: any }) => {
  const dateString = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(item.month);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {dateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

const YearlyCard = ({ item }: { item: any }) => {
  const dateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(item.year);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {dateString}
      </Text>
      <Text className="text-xl font-HelveticaNeueBold">{item.title}</Text>
      <Text className="text-sm text-gray-700 font-HelveticaNeueMedium">
        {item.shortSummary}
      </Text>
    </View>
  );
};

export { DailyCard, MonthlyCard, WeeklyCard, YearlyCard };
