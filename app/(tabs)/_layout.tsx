import { Tabs } from "expo-router";
import {
  Calendar,
  Home,
  Refrigerator,
  Search,
  User,
} from "lucide-react-native";
import { useTheme } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();

  const activeColor = theme.active.get();
  const inactiveColor = theme.inactive.get();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: theme.background.get(),
          borderTopWidth: 1,
          borderTopColor: theme.borderColor.get(),
          height: 65,
          paddingTop: 3,
          elevation: 0, // 안드로이드 특유의 그림자 제거
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="fridge"
        options={{
          title: "냉장고목록",
          tabBarIcon: ({ color }) => <Refrigerator color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "검색",
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
