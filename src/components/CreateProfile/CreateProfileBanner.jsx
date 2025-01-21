import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./../../util/theme.jsx";
import CreateProfile from "./CreateProfile.jsx";
import CreateSettings from "./CreateSettings.jsx";
import UserDP from "../UIComponents/UserDp/UserDP.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import TopHeader from "./../UIComponents/TopHeader/TopHeader.jsx";
import { useSelector } from "react-redux";
import CreateNetwork from "./CreateNetwork.jsx";

const CreateProfileBanner = ({ slug }) => {
  const translation = useSelector((state) => state.session.translation);
  const [activeComponent, setActiveComponent] = useState(slug ? slug : "Info");
  const [headerId, setHeaderId] = useState(null);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (slug) {
      setActiveComponent(slug);
    }
  }, [slug]);

  const handleHeaderAndNameChange = (id, name) => {
    setHeaderId(id);
    setName(name);
  };

  const handleImageChange = (image) => {
    setSelectedImage(image);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "Info":
        return (
          <CreateProfile
            onHeaderAndNameChange={handleHeaderAndNameChange}
            onImageChange={handleImageChange}
          />
        );
      case "Network":
        return <CreateNetwork />;
      case "Settings":
        return <CreateSettings />;
      default:
        return null;
    }
  };

  const defaultImage = require("./../../../assets/images/1.jpg");

  return (
    <ScrollView>
      <TopHeader />
      <ImageBackground
        source={
          headerId
            ? { uri: `https://theafternet.com/assets/images/backdrops/thumb/${headerId}.jpg` }
            : defaultImage
        }
        style={styles.backImage}
      >
        <View style={styles.dpContainer}>
          <UserDP imageSource={selectedImage?.uri} md={true} />
          <Text style={styles.dpText}>{name ? name : "New Profile"}</Text>
        </View>
      </ImageBackground>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => setActiveComponent("Info")}
          style={[styles.iconButton, activeComponent === "Info" && styles.activeIconButton]}
        >
          <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.white} />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.data}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveComponent("Network")}
          style={[styles.iconButton, activeComponent === "Network" && styles.activeIconButton]}
        >
          <MaterialIcons name="bubble-chart" size={24} color={theme.colors.white} />
          <Text style={styles.iconText}>{translation.PROFILE.EDIT.network}</Text>
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
    </ScrollView>
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
    marginRight: 20,
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
    flex: 1,
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
export default CreateProfileBanner;
