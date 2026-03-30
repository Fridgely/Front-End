import { OverlayMenu } from "@/shared/components/OverlayMenu/OverlayMenu";
import { X } from "@tamagui/lucide-icons";
import { Tabs, usePathname } from "expo-router";
import { Calendar, Home, Plus, Search, User } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Circle, useTheme, View } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeColor = theme.active.get();
  const inactiveColor = theme.inactive.get();
  const hideFooterRoutes = [
    "/calendar",
    "/profile",
    "/profile/notification-setting",
  ];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <View f={1}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabelStyle: {
            fontFamily: "GyeonggiTitle-Bold",
            fontSize: 12,
            fontWeight: "700",
            marginTop: -2,
          },
          tabBarStyle: {
            backgroundColor: theme.background.get(),
            borderTopWidth: 1,
            borderTopColor: theme.borderColor.get(),
            height: 65,
            paddingTop: 3,
            elevation: 0, // 안드로이드 특유의 그림자 제거
            display: shouldHideFooter ? "none" : "flex",
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
          name="search"
          options={{
            title: "검색",
            tabBarIcon: ({ color }) => <Search color={color} size={24} />,
          }}
        />
        {/* +버튼을 위해 자리만 남겨놓음 */}
        <Tabs.Screen
          name="action"
          options={{
            title: "",
            tabBarButton: () => <View style={{ flex: 1 }} />,
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
          name="profile/index"
          options={{
            title: "설정",
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
            href: "/profile",
          }}
        />
        <Tabs.Screen
          name="profile/notification-setting"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {!shouldHideFooter && (
        <View
          style={{
            position: "absolute",
            bottom: 35,
            alignSelf: "center",
            zIndex: 2000,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Circle
              size={60}
              backgroundColor={activeColor}
              elevation={4}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={5}
            >
              {isMenuOpen ? (
                <X color="white" size={30} />
              ) : (
                <Plus color="white" size={30} />
              )}
            </Circle>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
