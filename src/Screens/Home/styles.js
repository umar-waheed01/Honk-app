import { StyleSheet } from "react-native";
import { theme } from "./../../util/theme";

export const styles = StyleSheet.create({
  profileContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  updatesContainer: {
    marginBottom: 30,
  },
  summaryContainer: {
    marginBottom: 30,
  },
  manageContainer: {
    marginBottom: 30,
  },
  manageBox: {
    elevation: 2,
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  boxContent: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Sofia-Pro-Regular",
  },
});
