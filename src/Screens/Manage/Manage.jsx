import { View } from "react-native";
import React from "react";
import ColoredBox from "./../../components/UIComponents/ColoredBox/ColoredBox";
import CustomButton from "./../../components/UIComponents/CustomButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../../redux/slices/session";
import Toast from "react-native-toast-message";
import { theme } from "./../../util/theme";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function Manage() {
  const translation = useSelector((state) => state.session.translation);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userLogout = async () => {
    try {
      dispatch(logout());
      Toast.show({
        type: "success",
        text1: "Logout successful",
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  return (
    <View style={theme.container}>
      <ColoredBox
        heading={translation.MANAGEMENT.nocurator}
        content={translation.MANAGEMENT.nocuratorinfo}
      />
      <CustomButton
        title={translation.FOOTER.logout}
        onPress={userLogout}
        style={{ marginVertical: 10 }}
      />
    </View>
  );
}
