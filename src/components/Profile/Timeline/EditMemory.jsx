import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import UserDP from "../../UIComponents/UserDp/UserDP";
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
import { replaceName } from "../../../util/functions";

export default function EditMemory({ route }) {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const memoryId = route.params.memoryId;
  const userId = route.params.userId;
  const apiCall = useApiCall();
  const user = useSelector((state) => state.session.user);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [visibilitySetting, setVisibilitySetting] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [isCheckedA, setIsCheckedA] = useState(true);
  const [isCheckedB, setIsCheckedB] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [visibleAlive, setVisibleAlive] = useState(translation.TIMELINE.VISIBILITY.public);
  const [visibleDead, setVisibleDead] = useState(translation.TIMELINE.VISIBILITY.public);
  const [inputFields, setInputFields] = useState([]);
  const [startYear, setStartYear] = useState(0);
  const [startMonth, setStartMonth] = useState(0);
  const [startDay, setStartDay] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [endMonth, setEndMonth] = useState(0);
  const [endDay, setEndDay] = useState(0);
  const [loading, setLoading] = useState(false);

  const [startingDate, setStaringDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [endingDate, setEndingDate] = useState({
    day: 0,
    month: 0,
    year: 0,
  });

  useEffect(() => {
    fetchMemory();
  }, [memoryId]);

  const fetchMemory = async () => {
    const result = await apiCall(`api/memories/${userId}/${memoryId}`, "GET");
    const data = await result.json();

    const formattedStartDate = formatDate(data.startDay, data.startMonth, data.startYear);
    const formattedEndDate =
      data.endDay && data.endMonth && data.endYear
        ? formatDate(data.endDay, data.endMonth + 1, data.endYear)
        : { day: 0, month: 0, year: 0 };
    setStaringDate(formattedStartDate);
    setEndingDate(formattedEndDate);
    setStartDay(data.startDay);
    setStartMonth(data.startMonth + 1);
    setStartYear(data.startYear);
    setEndDay(data.endDay);
    setEndMonth(data.endMonth + 1);
    setEndYear(data.endYear);
    setTitle(data.title);
    setText(data.text);
    setVisibilitySetting(data.visibilityType);
    setAuthorName(data.authorName);
    setVisibleAlive(data.visibilityWhenAlive);
    setVisibleDead(data.visibilityWhenDead);
  };

  const formatDate = (day, month, year) => {
    if (day === undefined || month === undefined || year === undefined) {
      return { day: "00", month: "00", year: "0000" };
    }
    return {
      day: day.toString().padStart(2, "0"),
      month: month.toString().padStart(2, "0"),
      year: year.toString(),
    };
  };

  const handleUpdate = async () => {
    setLoading(true);
    const requestBody = {
      title: title,
      startYear: parseInt(startingDate.year),
      startMonth: parseInt(startingDate.month),
      startDay: parseInt(startingDate.day),
      endYear: Number(endingDate?.year) || null,
      endMonth: Number(endingDate?.month) || null,
      endDay: Number(endingDate?.day) || null,
      text: text,
      visibilityType: visibilitySetting === "USER_SETTINGS" ? "USER_SETTINGS" : "CUSTOM",
      visibilityWhenAlive: visibleAlive,
      visibilityWhenDead: visibleDead,
    };

    try {
      const result = await apiCall(`api/memories/me/${memoryId}`, "PATCH", requestBody);
      const responseData = await result.json();
      if (result.status == 200) {
        Toast.show({
          type: "success",
          text1: "Memory Update Successfully",
        });
        navigation.goBack();
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await apiCall(`api/memories/me/${memoryId}`, "DELETE");
      if (result.status == 204) {
        Toast.show({
          type: "success",
          text1: translation.TIMELINE.memoireremovedconfirmed,
        });
        navigation.goBack();
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

  const toggleCheckboxA = () => {
    setIsCheckedA(true);
    setIsCheckedB(false);
    setIsDropdownOpen(false);
    setVisibilitySetting("USER_SETTINGS");
  };

  const toggleCheckboxB = () => {
    setIsCheckedB(true);
    setIsCheckedA(false);
    setVisibilitySetting("CUSTOM");
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

  const handleAddInput = () => {
    setInputFields([...inputFields, { id: inputFields.length }]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{translation.TIMELINE.editmemoiretitle}</Text>
      <View style={styles.dpContainer}>
        <UserDP />
        <Text style={styles.dpText}>{authorName}</Text>
      </View>
      <InputField
        label={translation.TIMELINE.memoiretitle}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
        }}
      />
      <DatePicker
        date={startingDate}
        setDate={(newDate) => {
          setStaringDate(newDate);
        }}
        label={"Starting Date"}
      />
      <DatePicker
        date={endingDate}
        setDate={(newDate) => {
          setEndingDate(newDate);
        }}
        label={"Ending Date (Optional)"}
      />
      <InputField
        label={replaceName(translation.TIMELINE.memoireto, { name: user?.fullName })}
        value={text}
        onChangeText={(text) => {
          setText(text);
        }}
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{translation.TIMELINE.memoirepicturesorvideo}</Text>
        <CustomButton
          title={translation.GLOBAL.add}
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

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{translation.TIMELINE.memoirevideourl}</Text>
        <CustomButton
          title={translation.GLOBAL.add}
          variant="outlined"
          style={{ fontSize: 10, padding: 5, borderRadius: 5 }}
          onPress={handleAddInput}
        />
      </View>

      {inputFields.map((input, index) => (
        <View key={input.id} style={styles.inputRow}>
          <InputField
            placeholder={translation.TIMELINE.memoirevideosinfo}
            value={input.value}
            onChangeText={(text) => {
              const updatedFields = [...inputFields];
              updatedFields[index].value = text;
              setInputFields(updatedFields);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              const updatedFields = inputFields.filter((_, i) => i !== index);
              setInputFields(updatedFields);
            }}
            style={styles.deleteButton}
          >
            <Ionicons name="close-circle" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      ))}

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
      <CustomButton
        title={translation.GLOBAL.save}
        style={{ marginTop: 50 }}
        onPress={handleUpdate}
        loading={loading}
      />
      <CustomButton
        title={translation.GLOBAL.remove}
        style={{ marginTop: 15 }}
        variant="outlined"
        onPress={handleDelete}
        loading={loading}
      />
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
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    marginLeft: 5,
  },
});
