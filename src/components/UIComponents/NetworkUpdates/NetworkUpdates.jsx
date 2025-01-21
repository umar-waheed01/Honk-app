import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { theme } from "../../../util/theme";
import { months } from "../../../util/strings";
import { LinearGradient } from "expo-linear-gradient";
import UserDP from "./../UserDp/UserDP";
import { formatDistanceToNow, format } from "date-fns";
import { getCustomLocale } from "../../../util/functions";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const NetworkUpdates = ({ postData }) => {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [backgroundImage, setBackgroundImage] = useState();
  const [avatarPath, setAvatarPath] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [titleColor, setTitleColor] = useState();
  const [dateColor, setDateColor] = useState();
  const customLocale = getCustomLocale();

  useEffect(() => {
    setAvatarPath(
      postData?.userInfo?.avatarPath
        ? `https://theafternet.com/images/avatars/${postData.userInfo.avatarPath}`
        : postData.userInfo.avatarUrl
    );
    if (postData.updateType === "newMemory") {
      setBackgroundImage(
        `https://theafternet.com/images/media/${postData?.memory?.media[0]?.path}`
      );
      setTitleColor(postData?.memory?.media[0]?.path ? theme.colors.white : theme.colors.text);
      setDateColor(postData?.memory?.media[0]?.path ? theme.colors.muted : theme.colors.text);

      setTitle(postData.memory.title);
      setDescription(
        <Text>
          A memory has been added by{" "}
          <Text style={{ fontFamily: "Sofia-Pro-Medium" }}>{postData.memory.authorName}</Text>
        </Text>
      );
    } else if (postData.updateType === "newMemoryMessage") {
      setBackgroundImage(
        `https://theafternet.com/images/media/${postData?.memory?.media[0]?.path}`
      );
      setTitleColor(postData?.memory?.media[0]?.path ? theme.colors.white : theme.colors.text);
      setDateColor(postData?.memory?.media[0]?.path ? theme.colors.muted : theme.colors.text);
      setTitle(postData.memory.title);
      if (postData.memory?.messages[0].likeType) {
        setDescription(
          <Text>
            <Text style={{ fontFamily: "Sofia-Pro-Medium" }}>{postData.userInfo.fullName}</Text>
            {" likes the following memory:\n"}
            <Text style={{ fontFamily: "Sofia-Pro-Medium" }}>{postData.memory.title}</Text>
          </Text>
        );
      } else {
        setDescription(
          postData.userInfo.fullName +
            " added a comment to the following memory: \n" +
            postData.memory.title +
            "\n “ " +
            postData.memory.messages[0].message +
            " ” "
        );
      }
    } else {
      setBackgroundImage(
        `https://theafternet.com/assets/images/backdrops/full/${postData.userInfo.headerId}.jpg`
      );
      setTitleColor(theme.colors.white);
      setDateColor(theme.colors.white);
      setTitle(postData.userInfo.fullName);
      if (postData.updateType === "birthAnniversary") {
        if (postData.userInfo.deathDate) {
          setDescription(
            postData.userInfo.fullName +
              " would have turned " +
              formatDistanceToNow(new Date(postData.userInfo.birthDate), {
                locale: customLocale,
              }) +
              " old"
          );
        } else {
          setDescription(
            postData.userInfo.fullName +
              " has become " +
              formatDistanceToNow(new Date(postData.userInfo.birthDate), {
                locale: customLocale,
              }) +
              " old"
          );
        }
      } else if (postData.updateType === "deathAnniversary") {
        setDescription(
          postData.userInfo.fullName +
            " passed away " +
            formatDistanceToNow(new Date(postData.userInfo.deathDate), {
              addSuffix: true,
              locale: customLocale,
            })
        );
      } else if (postData.updateType === "passedAway") {
        setDescription(
          postData.userInfo.fullName +
            " passed away on " +
            format(new Date(postData.userInfo.deathDate), "dd MMMM yyyy")
        );
      }
    }
  }, [postData]);

  return (
    <View style={styles.card}>
      <ImageBackground
        imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        source={{
          uri: backgroundImage,
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["transparent", "transparent", "transparent", "#333"]}
          style={styles.gradient}
        />
        <UserDP imageSource={avatarPath} />

        <View>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {postData.updateType != "newMemoryMessage" && (
            <Text style={[styles.date, { color: dateColor }]}>
              {format(new Date(postData.userInfo.birthDate), "dd MMMM yyyy")}
              {postData.userInfo.deathDate &&
                ` - \n${format(new Date(postData.userInfo.deathDate), "dd MMMM yyyy")}`}
            </Text>
          )}
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <Text style={styles.description}>{description}</Text>

        {postData.updateType === "newMemory" && (
          <View>
            <Text style={styles.memoryDate}>
              {postData.memory.startDay} {months[postData.memory.startMonth - 1]}{" "}
              {postData.memory.startYear}
            </Text>
            <Text style={styles.memoryTitle}>{postData.memory.title}</Text>
            <Text style={styles.memoryDescription}>{postData.memory.text}</Text>
          </View>
        )}

        <Text style={styles.time}>
          {formatDistanceToNow(new Date(postData?.timestamp), {
            addSuffix: true,
            locale: customLocale,
          })}
        </Text>

        {postData.updateType == "newMemory" || postData.updateType == "newMemoryMessage" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MemoryDetails", {
                memoryId: postData.memory.id,
                friendId: postData.userInfo.id,
              })
            }
          >
            <Text style={styles.link}>{translation.UPDATES.viewmemory}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddMemory", {
                profileData: postData.userInfo,
              })
            }
          >
            <Text style={styles.link}>{translation.UPDATES.addmemory}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserProfile", {
              userId: postData.userInfo.id,
            })
          }
        >
          <Text style={styles.link}>
            {translation.UPDATES.viewprofile} {postData.userInfo.fullName}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingBottom: 16,
    marginTop: 16,
    elevation: 2,
    flexDirection: "column",
  },
  backgroundImage: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardImageContainer: {
    backgroundColor: theme.colors.white,
    width: 85,
    height: 85,
    borderRadius: 40,
    borderBottomLeftRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderBottomLeftRadius: 0,
  },
  title: {
    fontSize: 20,
    textTransform: "capitalize",
    fontFamily: "Sofia-Pro-Bold",
    marginRight: 80,
  },
  date: {
    marginTop: 3,
    lineHeight: 20,
    fontSize: 18,
    fontFamily: "Sofia-Pro-Medium",
  },
  description: {
    fontSize: 18,
    marginTop: 10,
    lineHeight: 25,
    fontFamily: "Sofia-Pro-Regular",
  },
  memoryDate: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: 8,
    fontFamily: "Merriweather-Regular",
  },
  memoryTitle: {
    fontSize: 22,
    marginTop: 10,
    lineHeight: 25,
    fontFamily: "Merriweather-Regular",
  },
  memoryDescription: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: "Merriweather-Regular",
  },
  cardContent: {
    marginHorizontal: 16,
    flex: 1,
  },
  time: {
    color: theme.colors.muted,
    fontSize: 12,
    marginVertical: 12,
    fontFamily: "Sofia-Pro-Regular",
  },
  link: {
    fontSize: 16,
    marginTop: 8,
    color: theme.colors.primary,
    textDecorationLine: "underline",
    fontFamily: "Sofia-Pro-Medium",
    textTransform: "uppercase",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default NetworkUpdates;
