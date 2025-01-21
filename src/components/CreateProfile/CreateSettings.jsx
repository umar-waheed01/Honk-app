import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "./../UIComponents/CustomButton/CustomButton";
import Toast from "react-native-toast-message";
import { useApiCall } from "./../../util/useApiCall";
import { useSelector } from "react-redux";
import { extractLabel } from "./../../util/functions";

export default function Settings() {
  const translation = useSelector((state) => state.session.translation);
  const apiCall = useApiCall();
  const user = useSelector((state) => state.session.user);

  const [isPublicWhenAlive, setIsPublicWhenAlive] = useState(user?.profile?.publicProfileWhenAlive);
  const [isPublicWhenDead, setIsPublicWhenDead] = useState(user?.profile?.publicProfileWhenDead);
  const [memoryCreationDropdown, setMemoryCreationDropdown] = useState(false);
  const [memoryCreation, setMemoryCreation] = useState(user?.profile?.memoryCreation);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [language, setLanguage] = useState(user?.language);
  const [loading, setLoading] = useState(false);

  const memoryAddOptions = [
    {
      label: translation.CONSTANT.MEMORYCREATION.curators,
      value: "curators",
    },
    {
      label: translation.CONSTANT.MEMORYCREATION.friends,
      value: "friends",
    },
    {
      label: translation.CONSTANT.MEMORYCREATION.everyone,
      value: "everyone",
    },
  ];

  const languagesOptions = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Nederlands",
      value: "nl",
    },
  ];

  const handleSave = async () => {
    setLoading(true);
    // const requestBody = {
    //   profile: {
    //     birthDate: formattedDate,
    //     lifeMotto: lifeMotto,
    //     biography: biography,
    //     birthPlace: birthPlace,
    //     lastResidence: lastResidence,
    //     restingPlace: restingPlace,
    //     employer: employer,
    //     education: education,
    //     hobbies: hobbies,
    //     holidays: holidays,
    //   },
    //   headerId: headerId,
    // };

    try {
      const result = await apiCall("api/users", "POST", requestBody);
      if (result.status === 201) {
        Toast.show({
          type: "success",
          text1: translation.SUCCESS.profilesaved,
        });
      } else {
        Toast.show({
          type: "error",
          text1: translation.ERRORS.genericerror,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{translation.PROFILE.EDIT.profilewhenalive}</Text>
        <View style={styles.userAlive}>
          <TouchableOpacity
            style={[styles.checkbox, isPublicWhenAlive && styles.checked]}
            onPress={() => setIsPublicWhenAlive(!isPublicWhenAlive)}
          >
            {isPublicWhenAlive && <View style={styles.tick}></View>}
          </TouchableOpacity>
          <Text style={styles.title}>{translation.PROFILE.EDIT.publiclabel}</Text>
        </View>
        <Text style={styles.about}>
          <Text style={{ fontWeight: "bold" }}>{translation.PROFILE.EDIT.public}</Text>:{" "}
          {translation.PROFILE.EDIT.publicinfowhenalive}
        </Text>
        <Text style={styles.about}>
          <Text style={{ fontWeight: "bold" }}>{translation.PROFILE.EDIT.private}</Text>:{" "}
          {translation.PROFILE.EDIT.privateinfowhenalive}
        </Text>
      </View>

      <View>
        <Text style={styles.subTitle}>{translation.PROFILE.EDIT.profilewhenpassedaway}</Text>
        <View style={styles.userAlive}>
          <TouchableOpacity
            style={[styles.checkbox, isPublicWhenDead && styles.checked]}
            onPress={() => setIsPublicWhenDead(!isPublicWhenDead)}
          >
            {isPublicWhenDead && <View style={styles.tick}></View>}
          </TouchableOpacity>
          <Text style={styles.title}>{translation.PROFILE.EDIT.publiclabel}</Text>
        </View>
        <Text style={styles.about}>
          <Text style={{ fontWeight: "bold" }}>{translation.PROFILE.EDIT.public}</Text>:{" "}
          {translation.PROFILE.EDIT.publicinfowhenalive}
        </Text>
        <Text style={styles.about}>
          <Text style={{ fontWeight: "bold" }}>{translation.PROFILE.EDIT.private}</Text>:{" "}
          {translation.PROFILE.EDIT.privateinfowhenalive}
        </Text>
      </View>

      <View>
        <Text style={styles.subTitle}>{translation.PROFILE.EDIT.memorycreation}</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setMemoryCreationDropdown(!memoryCreationDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {extractLabel(memoryAddOptions, memoryCreation)}
            </Text>
            <MaterialIcons
              name={memoryCreationDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {memoryCreationDropdown && (
            <View style={styles.optionsContainer}>
              {memoryAddOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    setMemoryCreation(item.value);
                    setMemoryCreationDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View>
        <Text style={styles.title}>{translation.PROFILE.EDIT.settings}</Text>
        <Text style={styles.subTitle}>{translation.PROFILE.EDIT.chosenlanguage}</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setLanguageDropdown(!languageDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {extractLabel(languagesOptions, language)}
            </Text>
            <MaterialIcons
              name={languageDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {languageDropdown && (
            <View style={styles.optionsContainer}>
              {languagesOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    setLanguage(item.value);
                    setLanguageDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <CustomButton
        title={translation.GLOBAL.save}
        onPress={handleSave}
        style={{ marginTop: 20 }}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 10,
  },
  info: {
    fontSize: 20,
    lineHeight: 24,
    marginVertical: 10,
  },
  about: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 20,
  },
  dropdownContainer: {
    width: "70%",
    borderWidth: 1,
    borderColor: "#7f0f82",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: "#333",
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  priceButton: {
    marginVertical: 15,
  },
  userAlive: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#4CAF50",
  },
  tick: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
  },
});
