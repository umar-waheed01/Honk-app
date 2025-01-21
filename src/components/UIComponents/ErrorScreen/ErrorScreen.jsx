import { View, Text, Image } from "react-native";
import React from "react";
import { theme } from "../../../util/theme";
import CustomButton from "../CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default function ErrorScreen({ error }) {
  const navigation = useNavigation();

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}
    >
      <Image
        source={require("../../../../assets/images/error_img.png")}
        style={{ width: "100%", height: 300 }}
      />
      <Text style={{ fontSize: 20, marginBottom: 20, color: theme.colors.primary }}>{error}</Text>
      <CustomButton title={"Go Back"} onPress={() => navigation.goBack()} />
    </View>
  );
}
