import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../../../Firebase";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import Toast from "react-native-toast-message";
import InputField from "./../../UIComponents/InputField/InputField";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

export default function AddPost() {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const storage = getStorage();

  const pickImages = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUris = result.assets.map((asset) => ({ uri: asset.uri }));
      setSelectedImages((prevImages) => [...prevImages, ...imageUris]);
    }
  };

  const uploadImages = async () => {
    const uploadedImageUrls = [];
    for (let image of selectedImages) {
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `app/${Date.now()}-${Math.random()}`);
        await uploadBytes(imageRef, blob);
        const downloadUrl = await getDownloadURL(imageRef);
        uploadedImageUrls.push(downloadUrl);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Failed to upload image",
        });
      }
    }
    return uploadedImageUrls;
  };

  const handleSavePost = async () => {
    if (!caption || selectedImages.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please add caption and select images.",
      });
      return;
    }

    if (!caption.trim()) {
      Toast.show({
        type: "error",
        text1: "Caption cannot be empty.",
      });
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      const userId = currentUser?.uid;

      if (!currentUser) {
        Toast.show({
          type: "error",
          text1: "User not authenticated!",
        });
        return;
      }
      const userRef = doc(db, "appUsers", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        Toast.show({
          type: "error",
          text1: "User data not found!",
        });
        return;
      }

      const userName = userDoc.data().name || "Anonymous";
      const imageUrls = await uploadImages();

      const postData = {
        userId: currentUser.uid,
        createdBy: {
          name: userName || "Anonymous",
          uid: currentUser.uid,
        },
        caption,
        createdAt: new Date().toISOString(),
        images: imageUrls,
        likes: [],
        comments: [],
      };

      const postRef = collection(db, "appPosts");
      await addDoc(postRef, postData);

      Toast.show({
        type: "success",
        text1: "Post created successfully!",
      });

      setCaption("");
      setSelectedImages([]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to create post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Post</Text>

      {/* Caption Input */}
      <InputField
        label="Caption"
        value={caption}
        onChangeText={(text) => setCaption(text)}
        multiline={true}
        numberOfLines={5}
      />

      {/* Image Picker */}
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Select Photos</Text>
        <CustomButton title="Pick Images" variant="outlined" onPress={pickImages} />
      </View>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <ScrollView horizontal style={styles.imagePreviewContainer}>
          {selectedImages.map((image, index) => (
            <Image key={index} source={image} style={styles.imagePreview} />
          ))}
        </ScrollView>
      )}

      {/* Save Post Button */}
      <CustomButton
        title="Save Post"
        style={{ marginTop: 20 }}
        onPress={handleSavePost}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
});
