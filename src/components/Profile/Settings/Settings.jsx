import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import InputField from "../../UIComponents/InputField/InputField";
import Toast from "react-native-toast-message";
import { useApiCall } from "../../../util/useApiCall";
import { useSelector, useDispatch } from "react-redux";
import { setTranslation, setUser } from "../../../redux/slices/session";
import { extractLabel } from "../../../util/functions";
import { Picker } from "@react-native-picker/picker";

export default function Settings() {
  const apiCall = useApiCall();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const translation = useSelector((state) => state.session.translation);

  const [isPublicWhenAlive, setIsPublicWhenAlive] = useState(user?.profile?.publicProfileWhenAlive);
  const [isPublicWhenDead, setIsPublicWhenDead] = useState(user?.profile?.publicProfileWhenDead);
  const [profileExpiration, setProfileExpiration] = useState(user?.profileExpiration);
  const [memoryCreation, setMemoryCreation] = useState(user?.profile?.memoryCreation);
  const [language, setLanguage] = useState(user?.language);
  const [memoryCreationDropdown, setMemoryCreationDropdown] = useState(false);
  const [profileExpirationDropdown, setProfileExpirationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileExpirationOptions = [
    { label: translation.PROFILE.EDIT.EXPIRATIONS.oneyear, value: 1 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.fiveyear, value: 5 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.tenyear, value: 10 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.twentyfiveyear, value: 25 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.fiftyyear, value: 50 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.seventyfiveyear, value: 75 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.hundredyear, value: 100 },
    { label: translation.PROFILE.EDIT.EXPIRATIONS.twohundredyear, value: 200 },
  ];

  const memoryAddOptions = [
    {
      label: translation.CONSTANT.MEMORYCREATION.curators,
      value: translation.DASHBOARD.curators,
    },
    {
      label: translation.CONSTANT.MEMORYCREATION.friends,
      value: translation.TIMELINE.VISIBILITY.friends,
    },
    {
      label: translation.CONSTANT.MEMORYCREATION.everyone,
      value: translation.CONSTANT.MEMORYCREATION.everyone,
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

  const handleUpdate = async () => {
    setLoading(true);

    const requestBody = {
      email: user?.email,
      fullName: user?.fullName,
      headerId: user?.headerId,
      language: language,
      profile: {
        birthDate: user?.profile?.birthDate,
        publicProfileWhenAlive: isPublicWhenAlive,
        publicProfileWhenDead: isPublicWhenDead,
        memoryCreation: memoryCreation,
      },
    };

    try {
      const result = await apiCall("api/users/me", "PATCH", requestBody);
      if (result.ok) {
        const data = await result.json();
        if (data.language !== user?.language) {
          const changeLanguage = await apiCall(
            `js/translations/i18n/${data?.language}.json`,
            "GET"
          );
          if (changeLanguage.ok) {
            const languageData = await changeLanguage.json();
            dispatch(setTranslation(languageData));
          }
        }
        dispatch(setUser(data));
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
      <Text style={styles.title}>{translation.PROFILE.EDIT.available}</Text>
      <Text style={styles.subTitle}>
        {user?.profileExpiration} {translation.PROFILE.EDIT.EXPIRATIONS.year}
      </Text>
      <Text style={styles.info}>{translation.PROFILE.EDIT.availableinfo}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setProfileExpirationDropdown(!profileExpirationDropdown)}
        >
          <Text style={styles.dropdownButtonText}>
            {extractLabel(profileExpirationOptions, profileExpiration)}
          </Text>
          <MaterialIcons
            name={profileExpirationDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {profileExpirationDropdown && (
          <View style={styles.optionsContainer}>
            {profileExpirationOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setProfileExpiration(item.value);
                  setProfileExpirationDropdown(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.priceButton}>
        <Text style={styles.title}>{translation.PAYMENT.total}: € 0</Text>
        <CustomButton
          title={translation.PAYMENT.checkout}
          style={{ width: "40%", marginTop: 10 }}
          disabled={true}
        />
      </View>

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
          <Picker
            selectedValue={memoryCreation}
            onValueChange={(itemValue) => {
              setMemoryCreation(itemValue);
            }}
            mode="dialog"
          >
            {memoryAddOptions.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text style={styles.title}>{translation.PROFILE.EDIT.settings}</Text>
        <Text style={styles.subTitle}>{translation.PROFILE.EDIT.chosenlanguage}</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => {
              setLanguage(itemValue);
            }}
            mode="dialog"
          >
            {languagesOptions.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <InputField
          label={translation.PROFILE.EDIT.email}
          placeholder={translation.PROFILE.EDIT.emailrequired}
          value={user?.email}
        />
      </View>

      <CustomButton title={translation.GLOBAL.save} onPress={handleUpdate} loading={loading} />
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
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
