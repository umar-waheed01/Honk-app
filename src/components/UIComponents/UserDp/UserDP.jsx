import { View, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./style";

export default function UserDP({ imageSource, sm, md, xl, gradient, gradientColors }) {
  return (
    <View
      style={xl ? styles.xlBorder : md ? styles.mdBorder : sm ? styles.smBorder : styles.lgBorder}
    >
      {gradient && (
        <LinearGradient
          colors={gradientColors ? gradientColors : ["#eaeaea", "#7a7a7a"]}
          style={[
            styles.gradient,
            xl ? styles.xlBorder : md ? styles.mdBorder : sm ? styles.smBorder : styles.lgBorder,
          ]}
        />
      )}
      <Image
        source={
          imageSource
            ? { uri: imageSource }
            : require("./../../../../assets/images/default-avatar.png")
        }
        style={xl ? styles.xlImage : md ? styles.mdImage : sm ? styles.smImage : styles.lgImage}
      />
    </View>
  );
}
