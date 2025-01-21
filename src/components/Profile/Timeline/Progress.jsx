import { View, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../../util/theme";

export default function Progress({ data }) {
  return (
    <View>
      <View>
        {data.map((obj) => {
          return (
            <View key={obj.id} style={styles.progress}>
              <View style={styles.statusBar}></View>
              <View
                style={{
                  width: 2,
                  height: obj?.media?.length > 0 ? 440 : 222,
                  backgroundColor: theme.colors.text,
                }}
              ></View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    alignItems: "center",
  },
  statusBar: {
    width: 12,
    height: 12,
    borderRadius: 15,
    borderColor: theme.colors.text,
    borderWidth: 2,
  },
});
