import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { setTranslation, setUser } from "../../redux/slices/session";
import { useApiCall } from "../../util/useApiCall";
import Toast from "react-native-toast-message";

export default function SelectLanguage() {
  const dispatch = useDispatch();
  const apiCall = useApiCall();
  const translation = useSelector((state) => state.session.translation);
  const user = useSelector((state) => state.session.user);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const languagesOptions = [
    { label: "English", value: "en" },
    { label: "Nederlands", value: "nl" },
  ];

  const handleLanguageSelection = async () => {
    setLoading(true);
    const requestBody = { language };

    try {
      const result = await apiCall("api/users/me", "PATCH", requestBody);
      if (result.ok) {
        const data = await result.json();

        // Update translation only if language changes
        if (data.language !== user?.language) {
          const changeLanguage = await apiCall(`js/translations/i18n/${data.language}.json`, "GET");

          if (changeLanguage.ok) {
            const languageData = await changeLanguage.json();
            dispatch(setTranslation(languageData));
          }
        }

        dispatch(setUser(data));
        Toast.show({ type: "success", text1: translation.SUCCESS.profilesaved });
      } else {
        Toast.show({ type: "error", text1: translation.ERRORS.genericerror });
      }
    } catch {
      Toast.show({ type: "error", text1: translation.ERRORS.genericerror });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translation.PROFILE.EDIT.chosenlanguage}</Text>
      <View style={styles.dropdownContainer}>
        <Picker selectedValue={language} onValueChange={(itemValue) => setLanguage(itemValue)}>
          {languagesOptions.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      <CustomButton
        title={translation.GLOBAL.save}
        onPress={handleLanguageSelection}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
});
