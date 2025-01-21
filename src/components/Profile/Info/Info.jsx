import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import InputField from "./../../UIComponents/InputField/InputField";
import UserDp from "../../UIComponents/UserDp/UserDP";
import Datepicker from "../../UIComponents/DatePicker/Datepicker";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import { theme } from "../../../util/theme";
import { useApiCall } from "../../../util/useApiCall";
import Toast from "react-native-toast-message";
import { setUser } from "../../../redux/slices/session";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import SearchField from "../../UIComponents/SearchField/SearchField";
import UserDP from "../../UIComponents/UserDp/UserDP";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Info({ onImageChange }) {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const apiCall = useApiCall();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false);
  const [relatives, setRelatives] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [searchField, setSearchField] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [date, setDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchUser();
      } else {
        setProfiles([]);
        setShowDropdown(false);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [query]);

  const searchUser = async () => {
    const currentQuery = query.trim();
    try {
      const result = await apiCall(`api/users/autocomplete?filter=others&id=me&q=${query}`, "GET");
      const data = await result.json();
      if (currentQuery === query.trim()) {
        setProfiles(data || []);
        setShowDropdown(data && data.length > 0);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const languagesOptions = [
    {
      label: translation.PROFILE.VIEW.partner,
    },
    {
      label: translation.PROFILE.VIEW.father,
    },
    {
      label: translation.PROFILE.VIEW.mother,
    },
    {
      label: translation.PROFILE.VIEW.stepfather,
    },
    {
      label: translation.PROFILE.VIEW.stepmother,
    },
    {
      label: translation.PROFILE.VIEW.children,
    },
    {
      label: translation.PROFILE.VIEW.grandfather,
    },
    {
      label: translation.PROFILE.VIEW.grandmother,
    },
  ];

  const imagePaths = [
    require("./../../../../assets/images/1.jpg"),
    require("./../../../../assets/images/2.jpg"),
    require("./../../../../assets/images/3.jpg"),
    require("./../../../../assets/images/4.jpg"),
    require("./../../../../assets/images/5.jpg"),
    require("./../../../../assets/images/6.jpg"),
    require("./../../../../assets/images/7.jpg"),
    require("./../../../../assets/images/8.jpg"),
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await apiCall("api/users/me", "GET");
      const data = await result.json();
      dispatch(setUser(data));

      if (data.profile && data.profile.birthDate) {
        const [year, month, day] = data.profile.birthDate.split("-");
        setDate({
          day: parseInt(day, 10),
          month: parseInt(month, 10) - 1,
          year: parseInt(year, 10),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const handleImagePress = (id) => {
    dispatch(setUser({ ...user, headerId: id }));
  };

  const validateAge = () => {
    const birthDate = new Date(date.year, date.month, date.day);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 16;
  };

  const setter = (e, key, type) => {
    if (type == "user") {
      dispatch(setUser({ ...user, [key]: e }));
    } else {
      dispatch(setUser({ ...user, profile: { ...user.profile, [key]: e } }));
    }
  };

  const updateUser = async () => {
    setLoading(true);
    const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(
      date.day
    ).padStart(2, "0")}`;

    const requestBody = {
      ...user,
      profile: {
        ...user.profile,
        birthDate: formattedDate,
      },
    };

    try {
      const result = await apiCall("api/users/me", "PATCH", requestBody);
      if (result.status == 200) {
        dispatch(setUser(requestBody));
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

  return (
    <View style={theme.container}>
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.basicinformation}</Text>
      <InputField
        label={translation.PROFILE.EDIT.name}
        placeholder={translation.PROFILE.EDIT.namerequired}
        value={user?.fullName}
        onChangeText={(e) => setter(e, "fullName", "user")}
      />
      <Text style={styles.title}>{translation.PROFILE.EDIT.photo}</Text>
      <View style={styles.selectFile}>
        <UserDp md={true} imageSource={selectedImage?.uri} />
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
            style={[styles.imageContainer, user?.headerId === index + 1 && { opacity: 1 }]}
          >
            <Image source={image} style={styles.sizeImage} />
          </TouchableOpacity>
        ))}
      </View>

      <Datepicker
        date={date}
        setDate={setDate}
        validateAge={validateAge}
        label={translation.PROFILE.EDIT.birthdate}
      />
      <InputField
        label={translation.PROFILE.EDIT.motto}
        multiline={true}
        numberOfLines={2}
        value={user?.profile?.lifeMotto}
        onChangeText={(e) => setter(e, "lifeMotto", "profile")}
      />

      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.biography}</Text>
      <InputField
        label={translation.PROFILE.EDIT.biography}
        numberOfLines={6}
        multiline={true}
        value={user?.profile?.biography}
        onChangeText={(e) => setter(e, "biography", "profile")}
      />

      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.locations}</Text>
      <InputField
        label={translation.PROFILE.EDIT.birthplace}
        value={user?.profile?.birthPlace}
        onChangeText={(e) => setter(e, "birthPlace", "profile")}
      />
      <InputField
        label={translation.PROFILE.EDIT.lastresidence}
        value={user?.profile?.lastResidence}
        onChangeText={(e) => setter(e, "lastResidence", "profile")}
      />
      <InputField
        label={translation.PROFILE.EDIT.restingplace}
        value={user?.profile?.restingPlace}
        onChangeText={(e) => setter(e, "restingPlace", "profile")}
      />

      {/* <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.household}</Text> */}
      {/* <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.relations}</Text> */}

      {/* <View>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={relatives}
            onValueChange={(itemValue) => {
              setRelatives(itemValue);
            }}
            mode="dialog"
          >
            {languagesOptions.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.label} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputRow}>
          <SearchField
            placeholder={translation.NETWORK.search}
            value={query}
            onChangeText={(e) => setQuery(e)}
          />
          <View style={styles.deleteButton}>
            <Ionicons name="close" size={24} color="black" />
          </View>
        </View>

        {showDropdown && profiles.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowDropdown(false);
                    setQuery("");
                    navigation.navigate("UserProfile", { userId: item.id });
                  }}
                >
                  <UserDP imageSource={item.avatarUrl} sm={true} />
                  <Text style={styles.name}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <CustomButton
          title={translation.PROFILE.EDIT.newrelation}
          variant="outlined"
          style={{ width: "50%", marginVertical: 10 }}
        />
      </View> */}

      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.workandeducation}</Text>

      <InputField
        label={translation.PROFILE.EDIT.work}
        value={user?.profile?.employer}
        onChangeText={(e) => setter(e, "employer", "profile")}
      />
      <InputField
        label={translation.PROFILE.EDIT.education}
        value={user?.profile?.education}
        onChangeText={(e) => setter(e, "education", "profile")}
      />
      <Text style={theme.typography.heading}>{translation.PROFILE.EDIT.sparetime}</Text>
      <InputField
        label={translation.PROFILE.EDIT.hobbies}
        value={user?.profile?.hobbies}
        onChangeText={(e) => setter(e, "hobbies", "profile")}
      />
      <InputField
        label={translation.PROFILE.EDIT.holidays}
        value={user?.profile?.holidays}
        onChangeText={(e) => setter(e, "holidays", "profile")}
      />

      <CustomButton
        title={translation.GLOBAL.save}
        style={{ marginVertical: 10 }}
        onPress={updateUser}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginVertical: 16,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Medium",
  },
  selectFile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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
  savebtn: {
    marginTop: 16,
    width: "50%",
    alignSelf: "center",
  },
  dropdown: {
    position: "absolute",
    top: 140,
    left: 0,
    right: 70,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 250,
    zIndex: 999999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ddd",
    padding: 5,
  },
  name: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 10,
    fontWeight: "500",
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#7f0f82",
    borderRadius: 5,
  },
  inputRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    marginLeft: 5,
  },
});
