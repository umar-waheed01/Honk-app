import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../../Firebase";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import CustomButton from "./../../UIComponents/CustomButton/CustomButton";
import MemoryCard from "./MemoryCard";
import { theme } from "../../../util/theme";
import Toast from "react-native-toast-message";

const Timeline = () => {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  const fetchMemories = async () => {
    try {
      const memoriesRef = collection(db, "appPosts");
      const q = query(memoriesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedMemories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMemories(fetchedMemories);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleLike = async (postId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    const userId = currentUser.uid;

    const postRef = doc(db, "appPosts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const updatedLikes = postData.likes.includes(userId)
        ? postData.likes.filter((id) => id !== userId)
        : [...postData.likes, userId];

      await updateDoc(postRef, { likes: updatedLikes });

      setMemories((prevMemories) =>
        prevMemories.map((memory) =>
          memory.id === postId ? { ...memory, likes: updatedLikes } : memory
        )
      );
    }
  };

  const handleComment = async (postId, newComment, userId) => {
    if (!newComment.trim()) {
      return;
    }

    try {
      // User name fetch karna
      const userRef = doc(db, "appUsers", userId);
      const userDoc = await getDoc(userRef);

      let userName = "Anonymous"; // Default value agar user na mile
      if (userDoc.exists()) {
        userName = userDoc.data().name || "Anonymous";
      }

      const postRef = doc(db, "appPosts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();

        // Updated comments list with userName
        const updatedComments = [
          ...postData.comments,
          { userId, name: userName, text: newComment, createdAt: new Date().toISOString() },
        ];

        // Firestore mein comments update karna
        await updateDoc(postRef, { comments: updatedComments });

        // State update karna
        setMemories((prevMemories) =>
          prevMemories.map((memory) =>
            memory.id === postId ? { ...memory, comments: updatedComments } : memory
          )
        );
      }
    } catch (error) {}
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  return (
    <View>
      <View style={styles.memoryContainer}>
        <Text style={theme.typography.heading}>Create NEW Post</Text>

        <CustomButton
          title="ADD POST"
          variant="outlined"
          onPress={() => navigation.navigate("AddMemory")}
          style={{ width: "50%", marginTop: 10 }}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.cards}>
          {memories.length === 0 ? (
            <Text style={styles.noMemories}>No Post found.</Text>
          ) : (
            memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                data={memory}
                onLikePress={() => handleLike(memory?.id)}
                onCommentPress={(newComment) =>
                  handleComment(memory.id, newComment, auth.currentUser.uid)
                }
              />
            ))
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  memoryContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cards: {
    marginTop: 20,
  },
  noMemories: {
    textAlign: "center",
    marginTop: 20,
    color: theme.colors.muted,
  },
});

export default Timeline;
