import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import InputField from "./../UIComponents/InputField/InputField";
import CustomButton from "./../UIComponents/CustomButton/CustomButton";
import Datepicker from "../UIComponents/DatePicker/Datepicker";
import Toast from "react-native-toast-message";
import { theme } from "./../../util/theme";
import { useApiCall } from "./../../util/useApiCall";
import UserDP from "../UIComponents/UserDp/UserDP";
import * as ImagePicker from "expo-image-picker";

export default function CreateProfile({ onHeaderAndNameChange, onImageChange }) {
  const translation = useSelector((state) => state.session.translation);

  const apiCall = useApiCall();
  const [name, setName] = useState("");
  const [lifeMotto, setLifeMotto] = useState("");
  const [biography, setBiography] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [lastResidence, setLastResidence] = useState("");
  const [restingPlace, setRestingPlace] = useState("");
  const [employer, setEmployer] = useState("");
  const [education, setEducation] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [holidays, setHolidays] = useState("");
  const [headerId, setHeaderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [date, setDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const imagePaths = [
    require("./../../../assets/images/1.jpg"),
    require("./../../../assets/images/2.jpg"),
    require("./../../../assets/images/3.jpg"),
    require("./../../../assets/images/4.jpg"),
    require("./../../../assets/images/5.jpg"),
    require("./../../../assets/images/6.jpg"),
    require("./../../../assets/images/7.jpg"),
    require("./../../../assets/images/8.jpg"),
  ];

  const handleImagePress = (id) => {
    setHeaderId(id);
    if (onHeaderAndNameChange) {
      onHeaderAndNameChange(id, name);
    }
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
      if (onImageChange) {
        onImageChange({ uri: result.assets[0].uri });
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(
      date.day
    ).padStart(2, "0")}`;

    const requestBody = {
      fullName: name,
      profile: {
        birthDate: formattedDate,
        lifeMotto: lifeMotto,
        biography: biography,
        birthPlace: birthPlace,
        lastResidence: lastResidence,
        restingPlace: restingPlace,
        employer: employer,
        education: education,
        hobbies: hobbies,
        holidays: holidays,
      },
      headerId: headerId,
    };

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
    <View style={theme.container}>
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.basicinformation}</Text>
      <InputField
        label={translation.PROFILE.EDIT.name}
        placeholder={translation.PROFILE.EDIT.namerequired}
        value={name}
        onChangeText={(abc) => {
          setName(abc);
          onHeaderAndNameChange(headerId, abc);
        }}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.photo}</Text>
      <View style={styles.selectImage}>
        <UserDP imageSource={selectedImage?.uri} md={true} />
        <View style={{ width: "100%", alignSelf: "center" }}>
          <CustomButton
            title="Choose File"
            variant="outlined"
            style={{ fontSize: 8, padding: 3, borderRadius: 5, width: 120 }}
            onPress={pickImage}
          />
          <Text
            style={{
              marginTop: 5,
              color: theme.colors.muted,
              flexWrap: "wrap",
              width: "65%",
            }}
          >
            {selectedImage
              ? selectedImage.uri.split("/").pop()
              : translation.PROFILE.EDIT.photorequired}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{translation.PROFILE.EDIT.headerimage}</Text>
      <View style={styles.imageRow}>
        {imagePaths.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index + 1)}
            style={[styles.imageContainer, headerId === index + 1 && { opacity: 1 }]}
          >
            <Image source={image} style={styles.sizeImage} />
          </TouchableOpacity>
        ))}
      </View>
      <Datepicker date={date} setDate={setDate} label={translation.PROFILE.EDIT.birthdate} />
      <InputField
        label={translation.PROFILE.EDIT.motto}
        value={lifeMotto}
        onChangeText={setLifeMotto}
        multiline={true}
        numberOfLines={2}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.biography}</Text>
      <InputField
        label={translation.PROFILE.EDIT.biography}
        value={biography}
        onChangeText={setBiography}
        numberOfLines={6}
        multiline={true}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.locations}</Text>
      <InputField
        label={translation.PROFILE.EDIT.birthplace}
        value={birthPlace}
        onChangeText={setBirthPlace}
      />
      <InputField
        label={translation.PROFILE.EDIT.lastresidence}
        value={lastResidence}
        onChangeText={setLastResidence}
      />
      <InputField
        label={translation.PROFILE.EDIT.restingplace}
        value={restingPlace}
        onChangeText={setRestingPlace}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.workandeducation}</Text>
      <InputField
        label={translation.PROFILE.EDIT.work}
        value={employer}
        onChangeText={setEmployer}
      />
      <InputField
        label={translation.PROFILE.EDIT.education}
        value={education}
        onChangeText={setEducation}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.sparetime}</Text>
      <InputField
        label={translation.PROFILE.EDIT.hobbies}
        value={hobbies}
        onChangeText={setHobbies}
      />
      <InputField
        label={translation.PROFILE.EDIT.holidays}
        value={holidays}
        onChangeText={setHolidays}
      />
      <CustomButton
        title={translation.GLOBAL.save}
        style={{ marginVertical: 10 }}
        onPress={handleSave}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectImage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    fontSize: 16,
    marginVertical: 16,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Medium",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "48%",
    marginBottom: 15,
    opacity: 0.5,
  },
  sizeImage: {
    width: "100%",
    height: 80,
    borderRadius: 10,
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
