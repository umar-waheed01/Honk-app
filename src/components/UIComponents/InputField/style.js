import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Medium",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Regular",
  },
  multiLineText: {
    borderWidth: 1,
    textAlignVertical: "top",
    borderRadius: 5,
    padding: 10,
    backgroundColor: theme.colors.white,
    fontFamily: "Sofia-Pro-Regular",
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Sofia-Pro-Regular",
  },
});
