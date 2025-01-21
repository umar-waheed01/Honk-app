import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { theme } from "../../../util/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import UserDP from "../UserDp/UserDP";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";

const Summary = ({ curatorShip }) => {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const user = useSelector((state) => state.session.user);
  const summary = useSelector((state) => state.session.summary);

  return (
    <View style={styles.card}>
      <ImageBackground
        imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        source={{
          uri: `${
            "https://theafternet.com/assets/images/backdrops/full/" + user?.headerId + ".jpg"
          }`,
        }}
        style={styles.backgroundImage}
      >
        <UserDP imageSource={user?.avatarUrl} />

        <View>
          <Text style={styles.name}>{user?.fullName}</Text>
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <Text style={styles.link}>
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() =>
              navigation.navigate("Profile", {
                slug: "Timeline",
              })
            }
          >
            {summary?.memoryCount}{" "}
            {summary?.memoryCount == 1
              ? `${translation.DASHBOARD.memory}`
              : `${translation.DASHBOARD.memories}`}
          </Text>
          <Text style={{ textDecorationLine: "none", color: "#333" }}>
            {" "}
            {translation.DASHBOARD.added}
          </Text>
        </Text>

        <Text style={styles.link}>
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() =>
              navigation.navigate("Profile", {
                slug: "Curators",
              })
            }
          >
            {summary?.curatorCount > 0
              ? summary?.curatorCount
              : `${translation.DASHBOARD.no} ${translation.DASHBOARD.curators}`}
          </Text>
          <Text style={{ textDecorationLine: "none", color: "#333" }}>
            {" "}
            {translation.DASHBOARD.appointed}
          </Text>
        </Text>

        <Text style={styles.link}>
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() =>
              navigation.navigate("Profile", {
                slug: "Wishes",
              })
            }
          >
            {summary?.wishesPercentage > 0
              ? `${translation.DASHBOARD.somewishes}`
              : `${translation.DASHBOARD.nowishes}`}
          </Text>
          <Text style={{ textDecorationLine: "none", color: "#333" }}>
            {" "}
            {translation.DASHBOARD.wishesregistered}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.footerLinksContainer}
        onPress={() => {
          navigation.navigate("Profile", {
            slug: "Info",
          });
        }}
      >
        <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
        <Text style={styles.footerLinks}>{translation.DASHBOARD.editprofile}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerLinksContainer}>
        <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
        <Text
          style={styles.footerLinks}
          onPress={() => {
            navigation.navigate("CreateProfileBanner", {
              slug: "Info",
            });
          }}
        >
          {translation.DASHBOARD.registerprofile}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Summary;
