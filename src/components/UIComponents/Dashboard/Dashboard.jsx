import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../../Screens/Home/Home";
import { Platform } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import TopHeader from "../TopHeader/TopHeader";
import Network from "../../../Screens/Network/Network";
import Profile from "../../../Screens/Profile/Profile";
import Manage from "../../../Screens/Manage/Manage";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const translation = useSelector((state) => state.session.translation);

  return (
    <>
      <TopHeader />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#7f0f82",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            height: Platform.OS === "ios" ? 70 : 60,
            paddingBottom: Platform.OS === "ios" ? 20 : 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: () => (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Sofia-Pro-Medium",
                }}
              >
                {translation.MENU.home}
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="home"
                size={24}
                color={focused ? "#7f0f82" : "black"}
                style={{ marginBottom: Platform.OS === "ios" ? -5 : 0 }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Network"
          component={Network}
          options={{
            tabBarLabel: () => (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Sofia-Pro-Medium",
                }}
              >
                {translation.MENU.network}
              </Text>
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Sofia-Pro-Medium",
            },
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="bubble-chart"
                size={24}
                color={focused ? "#7f0f82" : "black"}
                style={{ marginBottom: Platform.OS === "ios" ? -5 : 0 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: () => (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Sofia-Pro-Medium",
                }}
              >
                {translation.MENU.profile}
              </Text>
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Sofia-Pro-Medium",
            },
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="face"
                size={24}
                color={focused ? "#7f0f82" : "black"}
                style={{ marginBottom: Platform.OS === "ios" ? -5 : 0 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Manage"
          component={Manage}
          options={{
            tabBarLabel: () => (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Sofia-Pro-Medium",
                }}
              >
                {translation.MENU.manage}
              </Text>
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Sofia-Pro-Medium",
            },
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="people"
                size={24}
                color={focused ? "#7f0f82" : "black"}
                style={{ marginBottom: Platform.OS === "ios" ? -5 : 0 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
