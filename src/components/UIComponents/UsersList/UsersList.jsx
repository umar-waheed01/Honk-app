import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "../../../Screens/Network/style";
import UserDP from "../UserDp/UserDP";
import { useNavigation } from "@react-navigation/native";

export default function UsersList({ options, onPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.dropdown}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              onPress();
              navigation.navigate("UserProfile", { userId: item.id });
            }}
          >
            <UserDP imageSource={item.avatarUrl} sm={true} />
            <Text style={styles.name}>{item.fullName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
