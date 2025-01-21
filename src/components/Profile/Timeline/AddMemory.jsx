import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import UserDP from "./../../UIComponents/UserDp/UserDP";
import InputField from "./../../UIComponents/InputField/InputField";
import DatePicker from "../../UIComponents/DatePicker/Datepicker";
import CustomButton from "./../../UIComponents/CustomButton/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../../../util/theme";
import { useSelector } from "react-redux";
import { useApiCall } from "../../../util/useApiCall";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../../../Firebase";

export default function AddMemory({ route }) {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const apiCall = useApiCall();
  const db = getFirestore();
  const storage = getStorage();
  const profileData = route.params.profileData;
  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [visibilitySetting, setVisibilitySetting] = useState("USER_SETTINGS");
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoLink, setVideoLink] = useState("");

  const [isCheckedA, setIsCheckedA] = useState(true);
  const [isCheckedB, setIsCheckedB] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [caption, setCaption] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [visibleAlive, setVisibleAlive] = useState(translation.TIMELINE.VISIBILITY.public);
  const [visibleDead, setVisibleDead] = useState(translation.TIMELINE.VISIBILITY.public);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const toggleCheckboxA = () => {
    setIsCheckedA(true);
    setIsCheckedB(false);
    setIsDropdownOpen(false);
    setVisibilitySetting("USER_SETTINGS");
  };

  const toggleCheckboxB = () => {
    setIsCheckedB(true);
    setIsCheckedA(false);
    setVisibilitySetting(translation.TIMELINE.VISIBILITY.custom);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectOption = (option) => {
    setVisibleAlive(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const selectOption2 = (option) => {
    setVisibleDead(option);
    setIsDropdownOpen2(false);
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      Toast.show({
        type: "error",
        text1: "User not authenticated!",
      });
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Toast.show({
          type: "error",
          text1: "User not authenticated!",
        });
        setLoading(false);
        return;
      }

      let imageUrl = null;

      if (selectedImage) {
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `app/${currentUser.uid} - ${new Date().toISOString()}`);

        await uploadBytes(imageRef, blob);

        imageUrl = await getDownloadURL(imageRef);
      }

      const memoryData = {
        userId: currentUser.uid,
        caption: caption,
        createdAt: new Date().toISOString(),
        imageSource: imageUrl,
        likes: [],
        comments: [],
      };

      const memoryDocRef = collection(db, "appPosts");
      await addDoc(memoryDocRef, memoryData);

      Toast.show({
        type: "success",
        text1: "Memory created successfully!",
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error creating memory:", error);
      Toast.show({
        type: "error",
        text1: "Failed to create memory. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Post</Text>
      <View style={styles.dpContainer}>
        <UserDP
          imageSource={
            profileData?.avatarPath
              ? `https://theafternet.com/images/avatars/${profileData.avatarPath}`
              : profileData?.avatarUrl
          }
        />
        <Text style={styles.dpText}>{profileData?.fullName}</Text>
      </View>
      <InputField
        label="User Name"
        value={userName}
        onChangeText={(text) => {
          setUserName(text);
        }}
      />

      <InputField
        label="ADD CAPTION"
        value={caption}
        onChangeText={(text) => {
          setCaption(text);
        }}
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Selects Photos & videos</Text>
        <CustomButton
          title="Select"
          variant="outlined"
          style={{ fontSize: 10, padding: 5, borderRadius: 5 }}
          onPress={pickImage}
        />
      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={selectedImage} style={styles.image} />
        </View>
      )}

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxTitle}>{translation.TIMELINE.VISIBILITY.manage}</Text>
        <View style={styles.checkboxOption}>
          <TouchableOpacity
            style={[styles.checkbox, isCheckedA && { backgroundColor: theme.colors.primary }]}
            onPress={toggleCheckboxA}
          />
          <Text>{translation.TIMELINE.VISIBILITY.profile}</Text>
        </View>

        <View style={styles.checkboxOption}>
          <TouchableOpacity
            style={[styles.checkbox, isCheckedB && { backgroundColor: theme.colors.primary }]}
            onPress={toggleCheckboxB}
          />
          <Text>{translation.TIMELINE.VISIBILITY.custom}</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-start" }}>
        <Text style={styles.dropdownTitle}>{translation.TIMELINE.VISIBILITY.managealive}</Text>
        <TouchableOpacity
          onPress={isCheckedB ? toggleDropdown : null}
          style={[styles.dropdownContainer, { opacity: isCheckedB ? 1 : 0.5 }]}
          disabled={!isCheckedB}
        >
          <Text style={styles.selectedText}>{visibleAlive}</Text>
          <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity
              onPress={() => selectOption(translation.TIMELINE.VISIBILITY.nobody)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{translation.TIMELINE.VISIBILITY.nobody}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption(translation.TIMELINE.VISIBILITY.friends)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{translation.TIMELINE.VISIBILITY.friends}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption(translation.TIMELINE.VISIBILITY.public)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{translation.TIMELINE.VISIBILITY.public}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.dropdownTitle}>{translation.TIMELINE.VISIBILITY.managedead}</Text>
        <TouchableOpacity
          onPress={isCheckedB ? toggleDropdown2 : null}
          style={[styles.dropdownContainer2, { opacity: isCheckedB ? 1 : 0.5 }]}
          disabled={!isCheckedB}
        >
          <Text style={styles.selectedText}>{visibleDead}</Text>
          <Ionicons
            name={isDropdownOpen2 ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {isDropdownOpen2 && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity
              onPress={() => selectOption2(translation.TIMELINE.VISIBILITY.friends)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{translation.TIMELINE.VISIBILITY.friends}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption2(translation.TIMELINE.VISIBILITY.public)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{translation.TIMELINE.VISIBILITY.public}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <CustomButton title="SAVE" style={{ marginTop: 20 }} onPress={handleSave} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20,
    flexGrow: 1,
    paddingBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    marginVertical: 10,
    fontFamily: "Sofia-Pro-Bold",
  },
  dpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dpText: {
    fontSize: 18,
    fontWeight: "400",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  checkboxContainer: {
    marginTop: 20,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    gap: 10,
  },
  checkbox: {
    borderRadius: 12,
    borderWidth: 2,
    width: 20,
    height: 20,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 30,
    marginBottom: 5,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    gap: 80,
    borderRadius: 5,
  },
  dropdownContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    gap: 70,
    borderRadius: 5,
  },
  selectedText: {
    fontSize: 16,
  },
  dropdownOptions: {
    marginTop: 10,
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    textAlign: "left",
  },
  dropdownOption: {
    padding: 10,
    paddingRight: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
  inputRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    marginLeft: 5,
  },
});
