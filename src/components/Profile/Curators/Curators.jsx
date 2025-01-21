import { View, Text } from "react-native";
import React from "react";
import SearchField from "./../../UIComponents/SearchField/SearchField";
import { theme } from "../../../util/theme";
import { useSelector } from "react-redux";

export default function Curators() {
  const translation = useSelector((state) => state.session.translation);
  return (
    <View style={theme.container}>
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.yourcurators}</Text>
      <Text style={theme.typography.caption}>{translation.PROFILE.EDIT.curatorinfo}</Text>
      <SearchField placeholder={translation.PROFILE.EDIT.addnewcurator} />
    </View>
  );
}
