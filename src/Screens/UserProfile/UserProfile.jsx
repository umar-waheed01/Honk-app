import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, FlatList, TouchableOpacity } from "react-native";
import UserDP from "../../components/UIComponents/UserDp/UserDP";
import TopHeader from "../../components/UIComponents/TopHeader/TopHeader";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton";
import Progress from "../../components/Profile/Timeline/Progress";
import MemoryCard from "../../components/Profile/Timeline/MemoryCard";
import { months } from "../../util/strings";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../util/theme";
import { useApiCall } from "../../util/useApiCall";
import { useSelector } from "react-redux";
import { Alert } from "react-native";
import { canAddMemory, replaceName } from "../../util/functions";
import { styles } from "./style";

export default function UserProfile({ route }) {
  const translation = useSelector((state) => state.session.translation);
  const user = useSelector((state) => state.session.user);
  const apiCall = useApiCall();
  const userId = route.params.userId;
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({});
  const [memories, setMemories] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [userRelatives, setUserRelatives] = useState([]);
  const [userFlowers, setUserFlowers] = useState([]);
  const [userFriendProfile, setUserFriendProfile] = useState({});
  const [userCuratorships, setUserCuratorship] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchMemories();
    fetchRelatives();
    fetchFriends();
    fetchFriendsProfile();
    fetchFlowers();
    fetchCuratorships();
  }, [userId]);

  const fetchProfile = async () => {
    setUserProfile({});
    try {
      const result = await apiCall(`api/profile/${userId}`, "GET");
      const data = await result.json();
      setUserProfile(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchFriendsProfile = async () => {
    setUserFriendProfile({});
    try {
      const result = await apiCall(`api/friends/profile/${userId}`, "GET");
      const data = await result.json();
      setUserFriendProfile(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchFlowers = async () => {
    setUserFlowers([]);
    try {
      const result = await apiCall(`api/users/${userId}/flowers`, "GET");
      const data = await result.json();
      setUserFlowers(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchMemories = async () => {
    setMemories([]);
    try {
      const result = await apiCall(`api/memories/${userId}`, "GET");
      const data = await result.json();
      setMemories(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const confirmAndSendFriendRequest = () => {
    setLoading(true);
    Alert.alert(
      "Send Friend Request",
      `${translation.ERRORS.friendareyousure} ${userProfile?.fullName} ${translation.ERRORS.friendadd}?`,
      [
        {
          text: translation.GLOBAL.cancel,
          style: "cancel",
          onPress: () => setLoading(false),
        },
        {
          text: translation.GLOBAL.confirm,
          onPress: sendFriendRequest,
        },
      ],
      { cancelable: true }
    );
  };

  const fetchRelatives = async () => {
    setUserRelatives([]);
    try {
      const result = await apiCall(`api/relatives/user/${userId}`, "GET");
      const data = await result.json();
      setUserRelatives(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchFriends = async () => {
    setUserFriends([]);
    try {
      const result = await apiCall(`api/friends/${userId}`, "GET");
      const data = await result.json();
      setUserFriends(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchCuratorships = async () => {
    setUserCuratorship([]);
    try {
      const result = await apiCall(`api/curatorships`, "GET");
      const data = await result.json();
      setUserCuratorship(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const sendFriendRequest = async () => {
    const requestBody = {
      userId,
    };

    try {
      const result = await apiCall(`api/friends`, "POST", requestBody);
      if (result.status == 201) {
        Toast.show({
          type: "success",
          text1: replaceName(translation.ERRORS.networksent, { name: userProfile.fullName }),
        });
      } else {
        Toast.show({
          type: "error",
          text1: replaceName(translation.ERRORS.networkinvited, { name: userProfile.fullName }),
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
    <FlatList
      data={userFriends}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.touchable}
          onPress={() =>
            navigation.navigate("UserProfile", {
              userId: item.id,
            })
          }
          key={item.id}
        >
          <UserDP
            imageSource={
              item?.avatarPath
                ? `https://theafternet.com/images/avatars/${item.avatarPath}`
                : item.avatarUrl
            }
            md={true}
          />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => "relatives" + index}
      numColumns={3}
      ListHeaderComponent={
        <>
          <TopHeader />
          <ImageBackground
            source={{
              uri: `${
                "https://theafternet.com/assets/images/backdrops/full/" +
                userProfile?.headerId +
                ".jpg"
              }`,
            }}
            style={styles.backImage}
          >
            <View style={styles.dpContainer}>
              <View style={styles.userInfo}>
                <View style={{ marginTop: -100 }}>
                  <UserDP
                    imageSource={
                      userProfile?.avatarPath
                        ? `https://theafternet.com/images/avatars/${userProfile.avatarPath}`
                        : userProfile.avatarUrl
                    }
                    xl={true}
                  />
                </View>
                <Text style={theme.typography.heading}>{userProfile.fullName}</Text>

                {userProfile?.deathDate ? (
                  <>
                    <Text style={theme.typography.caption}>
                      {userProfile?.profile?.birthDate.replaceAll("-", "/")} -{" "}
                      {userProfile?.deathDate.replaceAll("-", "/")}
                    </Text>
                  </>
                ) : (
                  <Text style={theme.typography.caption}>
                    {userProfile.age} {translation.PROFILE.EDIT.EXPIRATIONS.year}
                  </Text>
                )}

                {userProfile?.profile?.lifeMotto && (
                  <Text style={theme.typography.subHeading}>{userProfile?.profile?.lifeMotto}</Text>
                )}
                {!userFriends.some((obj) => obj.id === user.id) && (
                  <CustomButton
                    title={replaceName(translation.PROFILE.VIEW.add, {
                      name: userProfile?.fullName,
                    })}
                    variant="outlined"
                    style={{ marginTop: 10 }}
                    onPress={confirmAndSendFriendRequest}
                    loading={loading}
                  />
                )}
              </View>
            </View>
          </ImageBackground>

          <View style={styles.summaryArea}>
            {(userProfile?.birthPlace ||
              userProfile?.lastResidence ||
              userProfile?.profile?.restingPlace ||
              userProfile?.profile?.employer ||
              userProfile?.profile?.education ||
              userProfile?.profile?.hobbies ||
              userProfile?.profile?.holidays ||
              userProfile?.profile?.biography) && (
              <Text style={theme.typography.heading}>{translation.PROFILE.VIEW.summary}</Text>
            )}

            {userProfile?.birthPlace && (
              <View style={styles.summaryBox}>
                <MaterialCommunityIcons name="cart" size={20} color="black" />
                <Text style={theme.typography.text}>{userProfile.birthPlace}</Text>
              </View>
            )}

            {userProfile?.lastResidence && (
              <View style={styles.summaryBox}>
                <Entypo name="home" size={20} color="black" />
                <Text style={theme.typography.text}>{userProfile.lastResidence}</Text>
              </View>
            )}

            {userProfile?.profile?.restingPlace && (
              <View style={styles.summaryBox}>
                <MaterialIcons name="terrain" size={24} color="black" />
                <Text style={theme.typography.text}>{userProfile.profile.restingPlace}</Text>
              </View>
            )}

            {userProfile?.profile?.employer && (
              <View style={styles.summaryBox}>
                <MaterialIcons name="work" size={24} color="black" />
                <Text style={theme.typography.text}>{userProfile.profile.employer}</Text>
              </View>
            )}

            {userProfile?.profile?.education && (
              <View style={styles.summaryBox}>
                <Ionicons name="school" size={24} color="black" />
                <Text style={theme.typography.text}>{userProfile.profile.education}</Text>
              </View>
            )}

            {userProfile?.profile?.hobbies && (
              <View style={styles.summaryBox}>
                <MaterialIcons name="golf-course" size={24} color="black" />
                <Text style={theme.typography.text}>{userProfile.profile.hobbies}</Text>
              </View>
            )}

            {userProfile?.profile?.holidays && (
              <View style={styles.summaryBox}>
                <MaterialIcons name="public" size={24} color="black" />
                <Text style={theme.typography.text}>{userProfile.profile.holidays}</Text>
              </View>
            )}

            {userProfile?.profile?.biography && (
              <Text style={theme.typography.text}>{userProfile.profile.biography}</Text>
            )}
          </View>

          {userFriends?.length > 0 && (
            <Text style={styles.networkText}>
              {translation.PROFILE.VIEW.viewnetwork} - {userFriends.length}
            </Text>
          )}
        </>
      }
      ListFooterComponent={
        <View style={styles.summaryArea}>
          <Text style={styles.title}>{translation.PROFILE.VIEW.interestedintimeline}</Text>
          <Text style={theme.typography.text}>
            {replaceName(translation.PROFILE.VIEW.timelineofdescription, {
              name: userProfile?.fullName,
            })}
          </Text>
          {!userFriends.some((obj) => obj.id === user.id) && (
            <CustomButton
              title={replaceName(translation.PROFILE.VIEW.add, {
                name: userProfile?.fullName,
              })}
              variant="outlined"
              style={{ marginTop: 10 }}
              onPress={confirmAndSendFriendRequest}
              loading={loading}
            />
          )}
          {canAddMemory(
            userProfile.id,
            userProfile?.profile?.memoryCreation,
            user.id,
            userFriends,
            userCuratorships
          ) && (
            <View style={styles.memoryContainer}>
              <Text style={styles.memoryText}>{translation.PROFILE.VIEW.addownmemoire}</Text>
              <CustomButton
                title={translation.PROFILE.EDIT.addmemory}
                variant="outlined"
                style={{ width: "50%" }}
                onPress={() =>
                  navigation.navigate("AddMemory", {
                    profileData: userProfile,
                  })
                }
              />
            </View>
          )}

          <View style={styles.container}>
            <View style={styles.progress}>
              <Progress data={memories} />
            </View>

            <View style={styles.cards}>
              {memories.map((memory, index) => {
                const monthName = months[memory.startMonth - 1];
                const date = `${memory.startDay ? memory.startDay : ""} ${
                  memory.startMonth ? monthName : ""
                } ${memory.startYear ? memory.startYear : ""}`;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("MemoryDetails", {
                        memoryId: memory.id,
                        friendId: memory.userId,
                      })
                    }
                  >
                    <MemoryCard
                      key={index}
                      imageSource={
                        memory?.media[0]?.path
                          ? "https://theafternet.com/images/media/" + memory?.media[0]?.path
                          : null
                      }
                      date={date}
                      title={memory.title}
                      authName={memory.authorName}
                      text={memory.text}
                      userId={memory.userId}
                      memoryId={memory.id}
                      authorId={memory.authorId}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          {(userRelatives.relationship || userRelatives.fullName) && (
            <Text style={theme.typography.subHeading}>Relatives</Text>
          )}
          <Text style={theme.typography.text}>{userRelatives.relationship}</Text>
          <Text style={theme.typography.text}>{userRelatives.fullName}</Text>
        </View>
      }
      contentContainerStyle={styles.userDPGrid}
    />
  );
}
