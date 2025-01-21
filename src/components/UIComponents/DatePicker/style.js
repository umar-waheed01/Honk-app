import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 5,
    marginTop: 15,
    alignItems: "flex-start",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Medium",
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Regular",
  },
});
