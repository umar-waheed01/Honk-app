import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, query, getDocs, orderBy } from "firebase/firestore";
import CustomButton from "./../../UIComponents/CustomButton/CustomButton";
import MemoryCard from "./MemoryCard";
import { theme } from "../../../util/theme";
import Toast from "react-native-toast-message";

const Timeline = () => {
  const translation = useSelector((state) => state.session.translation);
  const user = useSelector((state) => state.session.user);
  const navigation = useNavigation();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  const fetchMemories = async () => {
    try {
      const memoriesRef = collection(db, "appPosts");
      const q = query(memoriesRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedMemories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMemories(fetchedMemories);
    } catch (error) {
      console.error("Error fetching memories:", error);
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
          onPress={() =>
            navigation.navigate("AddMemory", {
              profileData: user,
            })
          }
          style={{ width: "50%", marginTop: 10 }}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.cards}>
          {memories.length === 0 ? (
            <Text style={styles.noMemories}>No Post found.</Text>
          ) : (
            memories.map((memory, index) => (
              <MemoryCard
                key={index}
                imageSource={memory.imageSource || null}
                createdAt={new Date(memory?.date).toLocaleDateString()}
                userId={memory?.userId}
                caption={memory?.caption}
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
