import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../util/theme";
import Curators from "./Curators/Curators.jsx";
import Info from "./Info/Info.jsx";
import Timeline from "./Timeline/Timeline.jsx";
import UserDP from "../UIComponents/UserDp/UserDP.jsx";
import Wishes from "./Wishes/Wishes.jsx";
import Settings from "./Settings/Settings.jsx";
import { useSelector } from "react-redux";

const ProfileBanner = ({ slug }) => {
  const translation = useSelector((state) => state.session.translation);
  const [activeComponent, setActiveComponent] = useState(slug ? slug : "Timeline");
  const user = useSelector((state) => state.session.user);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (slug) {
      setActiveComponent(slug);
    }
  }, [slug]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Timeline":
        return <Timeline />;
      case "Info":
        return <Info onImageChange={handleImageChange} />;
      case "Curators":
        return <Curators />;
      case "Wishes":
        return <Wishes />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

  const handleImageChange = (image) => {
    setSelectedImage(image);
  };

  return (
    <View>
      <ImageBackground
        source={{
          uri: `${
            "https://theafternet.com/assets/images/backdrops/thumb/" + user?.headerId + ".jpg"
          }`,
        }}
        style={styles.backImage}
      >
        <View style={styles.dpContainer}>
          <UserDP
            imageSource={selectedImage?.uri ? selectedImage?.uri : user?.avatarUrl}
            md={true}
          />
          <Text style={styles.dpText}>{user?.fullName}</Text>
        </View>
      </ImageBackground>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => setActiveComponent("Timeline")}
          style={[styles.iconButton, activeComponent === "Timeline" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons
            name="timeline-clock-outline"
            size={24}
            color={theme.colors.white}
          />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.timeline}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveComponent("Info")}
          style={[styles.iconButton, activeComponent === "Info" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.white} />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.data}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveComponent("Curators")}
          style={[styles.iconButton, activeComponent === "Curators" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={24}
            color={theme.colors.white}
          />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.curators}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveComponent("Wishes")}
          style={[styles.iconButton, activeComponent === "Wishes" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons name="heart-outline" size={24} color={theme.colors.white} />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.wishes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveComponent("Settings")}
          style={[styles.iconButton, activeComponent === "Settings" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color={theme.colors.white} />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.settings}</Text>
        </TouchableOpacity>
      </View>
      <View>{renderComponent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  backImage: {
    width: "100%",
    height: 200,
  },
  dpContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    padding: 30,
    gap: 20,
  },
  dpText: {
    paddingRight: 100,
    fontSize: 24,
    color: theme.colors.white,
    fontFamily: "Sofia-Pro-Bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: theme.colors.primary,
    paddingTop: 10,
  },
  iconButton: {
    alignItems: "center",
    paddingBottom: 5,
  },
  activeIconButton: {
    borderBottomWidth: 5,
    borderBottomColor: theme.colors.white,
    paddingBottom: 10,
  },
  iconText: {
    color: theme.colors.white,
    fontFamily: "Sofia-Pro-Medium",
    textTransform: "uppercase",
    fontSize: 11,
    marginTop: 8,
  },
});
export default ProfileBanner;
