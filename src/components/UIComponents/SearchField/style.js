import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  errorInputWrapper: {
    borderColor: "red",
  },
  input: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    fontSize: 16,
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Regular",
  },
  icon: {
    marginRight: 8,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Sofia-Pro-Regular",
  },
});
