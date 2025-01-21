import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../../UIComponents/CustomButton/CustomButton";
import InputField from "../../UIComponents/InputField/InputField";
import UserDP from "../../UIComponents/UserDp/UserDP";
import { useApiCall } from "../../../util/useApiCall";
import Toast from "react-native-toast-message";
import ErrorScreen from "../../../components/UIComponents/ErrorScreen/ErrorScreen";
import { useSelector } from "react-redux";
import { months } from "../../../util/strings";
import { LinearGradient } from "expo-linear-gradient";
import { formatDistanceToNow } from "date-fns";
import { getCustomLocale } from "../../../util/functions";
import { styles } from "../../../Screens/MemoryDetails/style";

export default function ViewMemory({ route }) {
  const translation = useSelector((state) => state.session.translation);
  const memoryId = route.params.memoryId;
  const apiCall = useApiCall();
  const customLocale = getCustomLocale();

  const user = useSelector((state) => state.session.user);
  const [memory, setMemory] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showLiked, setShowLiked] = useState(false);
  const [editMessageId, setEditMessageId] = useState(0);

  useEffect(() => {
    fetchMemory();
  }, []);

  const fetchMemory = async () => {
    try {
      const result = await apiCall(`api/memories/me/${memoryId}`, "GET");
      const data = await result.json();
      if (data?.success == false) {
        Toast.show({
          type: "error",
          text1: translation.ERRORS.genericerror,
        });
        setError(true);
      } else {
        setMemory(data);
        setCommentCount(data.messages.filter((message) => message?.message != null).length);
        setLikeCount(data.messages.filter((message) => message?.likeType == 1).length);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
      setError(true);
    }
  };

  const handleLike = async () => {
    setLikeCount((prevLikeCount) => prevLikeCount + 1);
    setMemory((prevMemory) => ({
      ...prevMemory,
      messages: [
        ...prevMemory.messages,
        {
          memoryId: memoryId,
          authorName: user.fullName,
          authorId: user.id,
          likeType: 1,
        },
      ],
    }));
    const requestBody = {
      likeType: 1,
    };
    try {
      const result = await apiCall(`api/memories/me/${memoryId}/message`, "POST", requestBody);
      if (result?.status == 403) {
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

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      if (editingIndex !== null) {
        const updatedMessages = [...memory.messages];
        updatedMessages[editingIndex].message = newMessage;
        updatedMessages[editingIndex].authorName = user?.fullName;
        updatedMessages[editingIndex].created = new Date().toISOString();
        setMemory((prevMemory) => ({
          ...prevMemory,
          messages: updatedMessages,
        }));
        setEditingIndex(null);

        const requestBody = {
          message: updatedMessages[editingIndex].message,
        };

        try {
          const result = await apiCall(
            `api/memories/me/${memoryId}/message/${editMessageId}`,
            "PATCH",
            requestBody
          );

          if (result?.status == 403) {
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
      } else {
        const requestBody = {
          message: newMessage,
        };

        try {
          const result = await apiCall(`api/memories/me/${memoryId}/message`, "POST", requestBody);
          const data = await result.json();

          if (result?.status == 201) {
            setMemory((prevMemory) => ({
              ...prevMemory,
              messages: [...prevMemory.messages, data],
            }));

            setCommentCount((prevCount) => prevCount + 1);
          } else if (result?.status == 403) {
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
      }
      setNewMessage("");
    } else {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const handleEditMessage = (index, editMessageId) => {
    setNewMessage(memory.messages[index].message);
    setEditingIndex(index);
    setEditMessageId(editMessageId);
  };

  const handleClearMessage = async (id) => {
    const result = await apiCall(`api/memories/me/${memoryId}/message/${id}`, "DELETE");
    if (result.status == 204) {
      Toast.show({
        type: "success",
        text1: translation.TIMELINE.memoireremovedconfirmed,
      });

      const updatedMessages = memory.messages.filter((msg) => msg.id !== id);

      setMemory((prevMemory) => ({
        ...prevMemory,
        messages: updatedMessages,
      }));
    } else {
      Toast.show({
        type: "error",
        text1: result?.message || translation.ERRORS.genericerror,
      });
    }
  };

  return (
    <>
      {error ? (
        <ErrorScreen error={translation.ERRORS.genericerror} />
      ) : (
        <ScrollView>
          <ImageBackground
            source={
              memory?.media?.length > 0
                ? { uri: `https://theafternet.com/images/media/${memory.media[0].path}` }
                : null
            }
            style={styles.backImage}
          >
            <LinearGradient
              colors={["black", "transparent", "transparent", "black"]}
              style={styles.gradient}
            />
            <View style={styles.innerContainer}>
              <View style={styles.aboutInfo}>
                <Text style={styles.userText}>{memory.authorName}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.aboutText}>{translation.TIMELINE.about} </Text>
                  <Text style={styles.userName}>{memory.authorName}</Text>
                </View>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postDate}>
                  {memory.startDay} {months[memory.startMonth - 1]} {memory.startYear}
                </Text>
                <Text style={styles.postText}>{memory.title}</Text>
              </View>
            </View>
          </ImageBackground>

          <Text style={styles.memoryText}>{memory.text}</Text>

          <View style={styles.bottomContainer}>
            {memory.media &&
              memory.media.length > 0 &&
              memory.media.map((media, index) => (
                <Image
                  key={index}
                  source={{
                    uri: `https://theafternet.com/images/media/${media.path}`,
                  }}
                  style={{
                    height: 400,
                    width: "100%",
                    borderRadius: 8,
                    marginTop: index === 0 ? 30 : 10,
                  }}
                />
              ))}

            <View style={styles.progressInfo}>
              <CustomButton
                title={translation.TIMELINE.like}
                variant="outlined"
                style={{ fontSize: 12, padding: 5, borderRadius: 5 }}
                onPress={handleLike}
                textTransform="uppercase"
                disabled={memory?.messages?.some(
                  (message) => message.authorId == user.id && message.likeType == 1
                )}
              />

              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                <TouchableOpacity onPress={() => setShowLiked(!showLiked)}>
                  <FontAwesome name="thumbs-up" size={24} color="#aab2bd" />
                </TouchableOpacity>
                <Text style={styles.progressCount}>{likeCount}</Text>
                <MaterialIcons name="comment" size={24} color="#aab2bd" />
                <Text style={styles.progressCount}>{commentCount}</Text>
              </View>
            </View>

            {memory?.messages
              ?.filter((message) => message?.likeType == 1)
              ?.slice(0, 1)
              ?.map((obj, index) => (
                <Text key={index} style={styles.profileName}>
                  <TouchableOpacity style={{ flexDirection: "row", gap: 5 }}>
                    <Text style={styles.userNameLink}>{obj?.authorName}</Text>
                    <Text style={styles.likesLink}> {translation.TIMELINE.likethissingle}</Text>
                  </TouchableOpacity>{" "}
                </Text>
              ))}

            {showLiked &&
              memory?.messages
                ?.filter((message) => message?.likeType == 1)
                ?.map((obj, index, array) => (
                  <View key={index}>
                    <View style={styles.showLiked}>
                      <UserDP sm={true} />
                      <Text>{obj?.authorName}</Text>
                    </View>
                    {index < array.length - 1 && <View style={styles.hr} />}
                  </View>
                ))}

            <View style={styles.inputArea}>
              <InputField
                placeholder={translation.TIMELINE.writecomment}
                value={newMessage}
                onChangeText={setNewMessage}
                style={{ flex: 1, paddingRight: 40 }}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[
                  {
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: [{ translateY: -18 }],
                  },
                ]}
              >
                <Ionicons name="send" size={24} color="#aab2bd" />
              </TouchableOpacity>
            </View>

            {memory.messages?.length > 0 && (
              <View>
                {memory.messages.map(
                  (element, index, array) =>
                    element?.message != null && (
                      <View key={index}>
                        <View style={styles.messageContainer}>
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <UserDP sm={true} />
                            <View>
                              <Text style={styles.editName}>{element.authorName}</Text>
                              <Text style={styles.editProgress}>
                                {formatDistanceToNow(new Date(element.created), {
                                  addSuffix: true,
                                  locale: customLocale,
                                })}
                              </Text>
                              <Text style={styles.editMemory}>{element.message}</Text>
                            </View>
                          </View>

                          {element.authorId === user?.id ? (
                            <View style={styles.iconsContainer}>
                              <TouchableOpacity
                                onPress={() => handleEditMessage(index, element?.id)}
                              >
                                <MaterialIcons name="edit" size={24} color="#aab2bd" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleClearMessage(memory?.messages?.[index]?.id)}
                              >
                                <MaterialIcons name="clear" size={24} color="#aab2bd" />
                              </TouchableOpacity>
                            </View>
                          ) : memory?.authorId === user?.id ? (
                            <View style={styles.iconsContainer}>
                              <TouchableOpacity
                                onPress={() => handleClearMessage(memory?.messages?.[index]?.id)}
                              >
                                <MaterialIcons
                                  name="clear"
                                  size={24}
                                  color="#aab2bd"
                                  style={styles.deleteIcon}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                        {index < array.length - 1 && <View style={styles.hr} />}
                      </View>
                    )
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}
