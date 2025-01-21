import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import NetworkUpdates from "./../../components/UIComponents/NetworkUpdates/NetworkUpdates";
import Summary from "./../../components/UIComponents/Summary/Summary";
import Toast from "react-native-toast-message";
import CustomButton from "./../../components/UIComponents/CustomButton/CustomButton";
import { useApiCall } from "./../../util/useApiCall";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setSummary } from "./../../redux/slices/session";
import { theme } from "./../../util/theme";
import UserDP from "../../components/UIComponents/UserDp/UserDP";
import { useNavigation } from "@react-navigation/native";
import ColoredBox from "./../../components/UIComponents/ColoredBox//ColoredBox";
import { styles } from "./styles";
import MemoryCard from "../../components/Profile/Timeline/MemoryCard";
import { getFirestore, collection, query, getDocs, orderBy } from "firebase/firestore";

const Home = () => {
  const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const db = getFirestore();

  const [suggestions, setSuggestions] = useState([]);
  const [memories, setMemories] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [curatorShip, setCuratorShip] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);

  const apiCall = useApiCall();

  useEffect(() => {
    fetchUser();
    fetchSuggestions();
    fetchUpdates();
    fetchSummary();
    fetchCuratorShip();
    fetchMemories();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await apiCall("api/users/me", "GET");

      const data = await result.json();
      dispatch(setUser(data));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchSuggestions = async () => {
    try {
      const result = await apiCall("api/friends/suggestions", "GET");
      const data = await result.json();
      setSuggestions(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchUpdates = async () => {
    try {
      const result = await apiCall("api/users/me/updates?limit=20&offset=0", "GET");
      const data = await result.json();
      setUpdates(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchSummary = async () => {
    try {
      const result = await apiCall("api/users/me/summary", "GET");
      const data = await result.json();
      dispatch(setSummary(data));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const fetchCuratorShip = async () => {
    try {
      const result = await apiCall("api/curatorships", "GET");
      const data = await result.json();
      setCuratorShip(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const handleShowUpdate = async () => {
    setLoader(true);
    try {
      const result = await apiCall("api/users/me/updates?limit=20&offset=" + updates.length, "GET");
      const data = await result.json();

      if (data.length > 0) {
        setUpdates((prevUpdates) => [...prevUpdates, ...data]);
      } else {
        Toast.show({
          type: "error",
          text1: translation.DASHBOARD.noupdates,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setUpdates([]);
    await fetchUpdates();
    setRefreshing(false);
  };

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
    }
  };

  return (
    <ScrollView
      style={theme.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Text style={theme.typography.heading}>{translation.DASHBOARD.suggestions}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={suggestions}
        keyExtractor={(item) => item.userId.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.profileContainer}
            key={item.userId.id}
            onPress={() =>
              navigation.navigate("UserProfile", {
                userId: item.userId.id,
              })
            }
          >
            <UserDP
              imageSource={`https://theafternet.com/images/avatars/${item.userId.avatarPath}`}
            />
          </TouchableOpacity>
        )}
      />

      <Text style={theme.typography.heading}>{translation.DASHBOARD.updates}</Text>
      {/* <View style={styles.updatesContainer}>
        {updates.map((update, index) => {
          return <NetworkUpdates key={`update-${index}`} postData={update} />;
        })}
        {updates?.length === 0 && (
          <ColoredBox
            heading={translation.MENU.network}
            content={translation.DASHBOARD.noupdates}
          />
        )}
      </View> */}
      <View>
        {memories.length === 0 ? (
          <Text style={styles.noMemories}>No Post found.</Text>
        ) : (
          memories.map((memory, index) => (
            <MemoryCard
              key={index}
              imageSource={memory.imageSource || null}
              date={new Date(memory?.date).toLocaleDateString()}
              title={memory?.title}
              authName={memory?.createdBy}
              text={memory?.description}
              memoryId={memory?.id}
              userId={memory?.userId}
              authorId={memory?.userId}
            />
          ))
        )}
      </View>

      <CustomButton
        title={translation.DASHBOARD.moreupdates}
        variant="contained"
        style={{ width: "100%", marginBottom: 30 }}
        onPress={handleShowUpdate}
        loading={loader}
      />

      <View style={styles.summaryContainer}>
        <Text style={theme.typography.heading}>{translation.DASHBOARD.yourafternet}</Text>
        <Summary curatorShip={curatorShip} />
      </View>
      <View style={styles.manageContainer}>
        <Text style={theme.typography.heading}>{translation.MENU.manage}</Text>

        <View style={styles.manageBox}>
          <TouchableOpacity onPress={() => navigation.navigate("Manage")}>
            <Text style={styles.boxContent}>{translation.DASHBOARD.norequests}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
