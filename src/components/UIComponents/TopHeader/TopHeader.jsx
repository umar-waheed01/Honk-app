import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchField from "../SearchField/SearchField";
import UserDP from "../UserDp/UserDP";
import { useApiCall } from "../../../util/useApiCall";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { styles } from "./style";

export default TopHeader = () => {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [notification, setNotification] = useState(0);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const apiCall = useApiCall();

  useEffect(() => {
    inboxStatus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchUser();
      } else {
        setProfiles([]);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [query]);

  const searchUser = async () => {
    try {
      const result = await apiCall(`api/users/autocomplete?id=me&q=${query}`, "GET");
      const data = await result.json();
      setProfiles(data || []);
      setShowDropdown(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const inboxStatus = async () => {
    try {
      const result = await apiCall(`api/users/me/inboxstatus`, "GET");
      const data = await result.json();
      if (result.status == 200) {
        setNotification(
          data?.incomingFriendRequests +
            data?.incomingCuratorshipRequests +
            data?.incomingFriendRequestsConfirmed +
            data?.incomingCuratorshipRequestsConfirmed
        );
      }
    } catch (error) {}
  };

  return (
    <>
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          paddingBottom: isDisplayed ? 0 : 10,
          position: "relative",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            {/* <Text style={styles.logoTextSm}></Text> */}
            <Text style={styles.logoTextLg}>HONK</Text>
            <Image
              source={require("../../../../assets/images/honk.png")}
              style={styles.headerImage}
            />
          </View>

          <View style={styles.action}>
            <TouchableOpacity style={styles.inbox} onPress={() => navigation.navigate("Inbox")}>
              <Text style={styles.inboxText}>{translation.MENU.inbox}</Text>
              {notification != 0 && (
                <View style={styles.notificationContainer}>
                  <Text style={styles.notificationNumber}>{notification}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.search}>
              <AntDesign
                name="search1"
                size={24}
                color="#7f0f82"
                onPress={() => {
                  setIsDisplayed(!isDisplayed);
                  setQuery("");
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {isDisplayed && (
          <SearchField
            placeholder={translation.GLOBAL.lookup}
            value={query}
            onChangeText={(e) => setQuery(e)}
          />
        )}
      </View>

      {showDropdown && isDisplayed && profiles.length > 0 && (
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
                  setIsDisplayed(false);
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
    </>
  );
};
