import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/Screens/Login/Login";
import SignUp from "./src/Screens/SignUp/SignUp";
import Dashboard from "./src/components/UIComponents/Dashboard/Dashboard";
import ForgotPassword from "./src/Screens/ForgotPassword/ForgotPassword";
import Inbox from "./src/Screens/Inbox/Inbox";
import UserProfile from "./src/Screens/UserProfile/UserProfile";
import AddMemory from "./src/components/Profile/Timeline/AddMemory";
import EditMemory from "./src/components/Profile/Timeline/EditMemory";
import CreateProfileBanner from "./src/components/CreateProfile/CreateProfileBanner";
import MemoryDetails from "./src/Screens/MemoryDetails/MemoryDetails";
import CreateNetwork from "./src/components/CreateProfile/CreateNetwork";
import { Provider, useSelector } from "react-redux";
import store, { persistor } from "./src/redux/store";
import Toast from "react-native-toast-message";
import { PersistGate } from "redux-persist/integration/react";
import { useFonts } from "expo-font";
import ViewMemory from "./src/components/Profile/Timeline/ViewMemory";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const token = useSelector((state) => state.session.token);

  return (
    <Stack.Navigator initialRouteName={"Login"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="AddMemory" component={AddMemory} />
      <Stack.Screen name="EditMemory" component={EditMemory} />
      <Stack.Screen name="MemoryDetails" component={MemoryDetails} />
      <Stack.Screen name="CreateProfileBanner" component={CreateProfileBanner} />
      <Stack.Screen name="CreateNetwork" component={CreateNetwork} />
      <Stack.Screen name="ViewMemory" component={ViewMemory} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loaded] = useFonts({
    "Sofia-Pro-Regular": require("./assets/fonts/sofia-pro/src/Sofia-Pro-Regular.otf"),
    "Sofia-Pro-Medium": require("./assets/fonts/sofia-pro/src/Sofia-Pro-Medium.otf"),
    "Sofia-Pro-Bold": require("./assets/fonts/sofia-pro/src/Sofia-Pro-Bold.otf"),
    "Merriweather-Regular": require("./assets/fonts/merriweather/src/Merriweather-Regular.ttf"),
    "Merriweather-Bold": require("./assets/fonts/merriweather/src/Merriweather-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <Toast />
    </>
  );
}
