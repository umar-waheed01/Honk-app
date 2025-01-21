import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import ColoredBox from "./../../components/UIComponents/ColoredBox/ColoredBox";
import TopHeader from ".././../components/UIComponents/TopHeader/TopHeader";
import { theme } from "../../util/theme";
import { useApiCall } from "../../util/useApiCall";
import UserDP from "../../components/UIComponents/UserDp/UserDP";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { replaceName } from "./../../util/functions";
import { styles } from "./style";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton";

export default Inbox = () => {
  const user = useSelector((state) => state.session.user);
  const translation = useSelector((state) => state.session.translation);
  const apiCall = useApiCall();
  const navigation = useNavigation();
  const [friendRequests, setFriendRequests] = useState([]);
  const [curatorRequests, setCuratorRequests] = useState([]);
  const [friendsConfirmedRequests, setFriendsConfirmedRequests] = useState([]);
  const [curatorConfirmedRequests, setCuratorConfirmedRequests] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
    fetchCuratorRequests();
    fetchFriendsConfirmedRequests();
    fetchCuratorConfirmedRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const result = await apiCall(`api/friends/incoming`, "GET");
      const data = await result.json();
      setFriendRequests(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchCuratorRequests = async () => {
    try {
      const result = await apiCall(`api/curatorships/incoming`, "GET");
      const data = await result.json();
      setCuratorRequests(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchFriendsConfirmedRequests = async () => {
    try {
      const result = await apiCall(`api/friends/incoming/confirmed`, "GET");
      const data = await result.json();
      setFriendsConfirmedRequests(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchCuratorConfirmedRequests = async () => {
    try {
      const result = await apiCall(`api/curatorships/incoming/confirmed`, "GET");
      const data = await result.json();
      setCuratorConfirmedRequests(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const confirmCancelFriendRequest = (id, name) => {
    Alert.alert(
      "Cancel Friend Request",
      replaceName(translation.MANAGEMENT.denyrequest, { name: name, friend: user?.fullName }),
      [
        {
          text: translation.GLOBAL.cancel,
          style: "cancel",
        },
        {
          text: translation.GLOBAL.confirm,
          onPress: () => cancelFriendRequest(id, name),
        },
      ],
      { cancelable: true }
    );
  };

  const cancelFriendRequest = async (id, name) => {
    setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    try {
      const result = await apiCall(`api/friends/incoming/${id}`, "DELETE");
      if (result.status == 204) {
        Toast.show({
          type: "success",
          text1: replaceName(translation.INBOX.denyfriendconfirmed, { name: name }),
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

  const acceptFriendRequest = async (userId, name) => {
    setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== userId));
    const requestBody = {
      userId,
    };
    try {
      const result = await apiCall(`api/friends/confirm`, "POST", requestBody);
      if (result.status == 201) {
        Toast.show({
          type: "success",
          text1: replaceName(translation.INBOX.friendconfirmed, { name: name }),
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

  const markNotificationAsSeen = async (notificationId) => {
    try {
      const result = await apiCall(
        `api/friends/incoming/confirmed/seen/${notificationId}`,
        "POST",
        {}
      );
      if (result.status != 204) {
        Toast.show({
          type: "error",
          text1: translation.ERRORS.genericerror,
        });
      } else {
        navigation.navigate("UserProfile", { userId: notificationId });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  return (
    <>
      <TopHeader />
      <View style={theme.container}>
        <Text style={theme.typography.heading}>{translation.INBOX.title}</Text>
        {friendRequests.length == 0 &&
          curatorRequests.length == 0 &&
          friendsConfirmedRequests.length == 0 &&
          curatorConfirmedRequests.length == 0 && (
            <ColoredBox heading={translation.INBOX.empty} content={translation.INBOX.emptyinfo} />
          )}
        {friendRequests.map((request) => (
          <View key={request.id}>
            <View style={styles.requestContainer}>
              <UserDP imageSource={request.avatarUrl} md={true} />
              <View style={styles.requestInfo}>
                <Text style={theme.typography.subHeading}>{request.fullName}</Text>
                <Text style={theme.typography.text}>{translation.INBOX.friendshipinvite}</Text>

                <View style={styles.requestOption}>
                  <CustomButton
                    title={translation.GLOBAL.accept}
                    style={{ paddingVertical: 7, flexGrow: 1 }}
                    onPress={() => acceptFriendRequest(request.id, request.fullName)}
                  />
                  <CustomButton
                    title={translation.GLOBAL.deny}
                    style={{ paddingVertical: 7, flexGrow: 1 }}
                    variant="outlined"
                    onPress={() => confirmCancelFriendRequest(request.id, request.fullName)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
        {friendsConfirmedRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            style={styles.acceptedContainer}
            onPress={() => markNotificationAsSeen(request.id)}
          >
            <View style={styles.acceptedIcon}>
              <FontAwesome name="user" size={24} color={theme.colors.primary} />
              <Text style={theme.typography.subHeading}>{translation.INBOX.newfriend}</Text>
            </View>
            <View style={styles.acceptedInfo}>
              <UserDP imageSource={request.avatarUrl} />
              <Text style={[theme.typography.text, { paddingRight: 40 }]}>
                {request.fullName} has joined your network
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};
