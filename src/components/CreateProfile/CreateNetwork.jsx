import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import SearchField from "../../components/UIComponents/SearchField/SearchField";
import UserDP from "../../components/UIComponents/UserDp/UserDP";
import { useApiCall } from "../../util/useApiCall";
import Toast from "react-native-toast-message";
import { theme } from "../../util/theme";
import ColoredBox from "../../components/UIComponents/ColoredBox/ColoredBox";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function CreateNetwork() {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const apiCall = useApiCall();

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

  return (
    <View style={{ padding: 20 }}>
      <View>
        <Text style={theme.typography.heading}>{translation.NETWORK.your}</Text>
        <SearchField
          placeholder={translation.NETWORK.search}
          value={query}
          onChangeText={(e) => setQuery(e)}
        />

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
      </View>
      <ColoredBox heading={translation.NETWORK.empty} content={translation.NETWORK.emptymessage} />
    </View>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
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
});
