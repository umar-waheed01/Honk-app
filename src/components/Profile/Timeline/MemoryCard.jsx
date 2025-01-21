import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import { theme } from "../../../util/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function MemoryCard({
  imageSource,
  title,
  date,
  authName,
  text,
  memoryId,
  userId,
  authorId,
  caption,
  likesCount = 0,
  commentsCount = 0,
  onLikePress,
  onCommentPress,
  onSharePress,
}) {
  const navigation = useNavigation();
  const user = useSelector((state) => state.session.user);
  const translation = useSelector((state) => state.session.translation);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            justifyContent: "space-between",
            padding: 20,
            backgroundColor: theme.colors.white,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: imageSource ? 0 : 10,
            borderBottomRightRadius: imageSource ? 0 : 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ViewMemory", { memoryId: memoryId })}
          >
            <View>
              <Text style={styles.date}>{date}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.caption}>{caption}</Text>
            </View>

            <View style={styles.editContainer}>
              {(user?.id == userId || user?.id == authorId) && (
                <CustomButton
                  title={translation.GLOBAL.edit}
                  variant="outlined"
                  onPress={() => navigation.navigate("EditMemory", { memoryId, userId })}
                  style={{ padding: 5 }}
                />
              )}
              <Text style={styles.authName}>{authName}</Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.muted,
              marginVertical: 20,
            }}
          ></View>
        </View>

        {imageSource && <Image source={{ uri: imageSource }} style={styles.image} />}

        {/* Interaction Buttons */}
        <View style={styles.interactionContainer}>
          <TouchableOpacity onPress={onLikePress} style={styles.interactionButton}>
            <FontAwesome name="heart" size={20} color={theme.colors.text} />
            <Text style={styles.interactionText}>{likesCount} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCommentPress} style={styles.interactionButton}>
            <FontAwesome name="comment" size={20} color={theme.colors.text} />
            <Text style={styles.interactionText}>{commentsCount} Comments</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={onSharePress} style={styles.interactionButton}>
            <MaterialIcons name="share" size={20} color={theme.colors.text} />
            <Text style={styles.interactionText}>Share</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingVertical: 30,
  },
  card: {
    elevation: 1,
    borderRadius: 10,
  },
  image: {
    backgroundColor: theme.colors.white,
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: {
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  date: {
    fontSize: 16,
    color: theme.colors.muted,
    fontFamily: "Merriweather-Regular",
  },
  title: {
    fontSize: 20,
    marginVertical: 5,
    fontFamily: "Merriweather-Bold",
    color: theme.colors.text,
  },
  caption: {
    fontSize: 18,
    fontFamily: "Sofia-Pro-Regular",
    color: theme.colors.text,
  },
  authName: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Regular",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  interactionText: {
    fontSize: 14,
    fontFamily: "Sofia-Pro-Regular",
    color: theme.colors.text,
  },
});
