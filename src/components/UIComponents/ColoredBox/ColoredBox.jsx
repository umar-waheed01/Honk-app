import { View, Text } from "react-native";
import React from "react";
import { styles } from "./style";

export default function ColoredBox({ heading, content }) {
  return (
    <View style={styles.coloredBox}>
      <Text style={styles.boxHeading}>{heading}</Text>
      <Text style={styles.boxContent}>{content}</Text>
    </View>
  );
}
