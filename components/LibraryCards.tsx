import { Text, View } from "react-native";

const DailyCard = ({ item }: { item: any }) => {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(item.date);
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(item.date);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md shadow-gray-300">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 min-w-0 text-xs text-gray-400 font-HelveticaNeueMedium uppercase">
          {date}
        </Text>
        <Text className="flex-1 min-w-0 text-xs text-gray-400 font-HelveticaNeueMedium uppercase text-right">
          {day}
        </Text>
      </View>

      <Text className="text-xl font-HelveticaNeueBold my-2" numberOfLines={1}>
        {item.title}
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {item.tags.map((tag: string) => (
          <Text
            className="text-sm text-gray-400 font-HelveticaNeueMedium rounded-2xl border border-gray-400 px-2 capitalize flex-shrink-0 overflow-visible"
            key={tag}
          >
            {tag}
          </Text>
        ))}
      </View>

      <Text
        className="text-sm text-gray-700 font-HelveticaNeueMedium"
        numberOfLines={2}
      >
        {item.content}
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
