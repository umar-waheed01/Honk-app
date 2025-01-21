import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import SearchField from "../../components/UIComponents/SearchField/SearchField";
import UserDP from "../../components/UIComponents/UserDp/UserDP";
import { useApiCall } from "../../util/useApiCall";
import Toast from "react-native-toast-message";
import { theme } from "../../util/theme";
import ColoredBox from "../../components/UIComponents/ColoredBox/ColoredBox";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import { Alert } from "react-native";
import { styles } from "./style";
import { useSelector } from "react-redux";
import { replaceName } from "../../util/functions";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Network() {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deadFriends, setDeadFriends] = useState([]);
  const [aliveFriends, setAliveFriends] = useState([]);
  const apiCall = useApiCall();

  useEffect(() => {
    getFriends();
  }, []);

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

  const getFriends = async () => {
    try {
      const result = await apiCall(`api/friends`, "GET");
      const data = await result.json();
      setDeadFriends(
        data.filter((friend) => friend.deathDate !== undefined && friend.deathDate !== null)
      );
      setAliveFriends(
        data.filter((friend) => friend.deathDate === undefined || friend.deathDate === null)
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const confirmDeleteFriend = (id, name, isAlive) => {
    Alert.alert(
      translation.GLOBAL.remove,
      replaceName(translation.ERRORS.networkremove, { name: name }),
      [
        {
          text: translation.GLOBAL.cancel,
          style: "cancel",
        },
        {
          text: translation.GLOBAL.confirm,
          onPress: () => deleteFriend(id, name, isAlive),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteFriend = async (id, name, isAlive) => {
    if (isAlive) {
      setAliveFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== id));
    } else {
      setDeadFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== id));
    }

    try {
      const result = await apiCall(`api/friends/${id}`, "DELETE");
      if (result.status == 204) {
        Toast.show({
          type: "success",
          text1: replaceName(translation.ERRORS.networkremovesuccess, { name: name }),
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
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
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

      {deadFriends.length == 0 && aliveFriends.length == 0 ? (
        <ColoredBox
          heading={translation.NETWORK.empty}
          content={translation.NETWORK.emptymessage}
        />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={theme.container}
            data={deadFriends}
            numColumns={2}
            ListHeaderComponent={
              deadFriends.length === 0 && aliveFriends.length === 0 ? null : null
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.touchable}
                onPress={() =>
                  navigation.navigate("UserProfile", {
                    userId: item.id,
                  })
                }
                key={index}
              >
                <View>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => confirmDeleteFriend(item.id, item.fullName, 0)}
                  >
                    <AntDesign name="close" size={24} color={theme.colors.muted} />
                  </TouchableOpacity>
                  <UserDP
                    imageSource={
                      item?.avatarPath
                        ? `https://theafternet.com/images/avatars/${item.avatarPath}`
                        : item.avatarUrl
                    }
                    xl={true}
                    gradient={true}
                    gradientColors={["transparent", "#eaeaea", "#7a7a7a"]}
                  />
                </View>

                <View style={styles.overlay}>
                  <Text style={[theme.typography.subHeading, { color: theme.colors.white }]}>
                    {item.fullName}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.white }]}>
                    {item.birthDate.slice(0, 4)} - {item.deathDate.slice(0, 4)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              aliveFriends.length > 0 && (
                <View style={styles.friendsContainer}>
                  {aliveFriends.map((item, index) => (
                    <View key={index} style={styles.requestContainer}>
                      <TouchableOpacity
                        style={styles.requestInfo}
                        onPress={() =>
                          navigation.navigate("UserProfile", {
                            userId: item.id,
                          })
                        }
                      >
                        <UserDP imageSource={item.avatarUrl} sm={true} />
                        <Text style={theme.typography.subHeading}>{item.fullName}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => confirmDeleteFriend(item.id, item.fullName, 1)}
                      >
                        <Entypo name="cross" size={20} color={theme.colors.muted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )
            }
          />
        </>
      )}
    </View>
  );
}
