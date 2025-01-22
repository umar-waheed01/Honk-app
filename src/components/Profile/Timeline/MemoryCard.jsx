import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import { theme } from "../../../util/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import UserDp from "../../UIComponents/UserDp/UserDP";

export default function MemoryCard({ data, onLikePress, onCommentPress }) {
  const currentUser = useSelector((state) => state.session.user);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = () => {
    if (onCommentPress && newComment.trim()) {
      onCommentPress(newComment);
      setNewComment("");
      setShowCommentInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <UserDp imageSource={data?.images[0]} />
          <Text style={styles.userName}>{data?.createdBy?.name}</Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>{data?.createdAt}</Text>

        {/* Caption */}
        <Text style={styles.caption}>{data?.caption}</Text>

        {/* Image */}
        {data?.images && <Image source={{ uri: data?.images[0] }} style={styles.image} />}

        {/* Interaction Buttons */}
        <View style={styles.interactionContainer}>
          <TouchableOpacity onPress={onLikePress} style={styles.interactionButton}>
            <FontAwesome
              name="heart"
              size={20}
              color={data?.likes.includes(data?.userId) ? theme.colors.primary : theme.colors.text}
            />
            <Text style={styles.interactionText}>{data?.likes.length} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCommentInput((prev) => !prev)}
            style={styles.interactionButton}
          >
            <FontAwesome name="comment" size={20} color={theme.colors.text} />
            <Text style={styles.interactionText}>{data?.comments.length} Comments</Text>
          </TouchableOpacity>
        </View>

        {/* Comment Input */}
        {showCommentInput && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleCommentSubmit} style={styles.submitCommentButton}>
              <Text style={styles.submitCommentText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Display Comments */}
        {data?.comments.length > 0 && (
          <View>
            {data?.comments.map((item, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentUser}>{item.name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentDate}>{item.createdAt}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: theme.colors.light,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    backgroundColor: theme.colors.light,
  },
  date: {
    fontSize: 12,
    paddingLeft: 10,
    color: theme.colors.muted,
  },
  userName: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "bold",
  },
  caption: {
    padding: 10,
    fontSize: 16,
    color: theme.colors.text,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: theme.colors.light,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: theme.colors.text,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: 5,
    padding: 10,
  },
  submitCommentButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitCommentText: {
    color: theme.colors.white,
  },
  commentItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light,
  },
  commentUser: {
    fontWeight: "bold",
    color: theme.colors.text,
  },
  commentText: {
    color: theme.colors.muted,
  },
  commentDate: {
    display: "flex",
    left: "70%",
  },
});
