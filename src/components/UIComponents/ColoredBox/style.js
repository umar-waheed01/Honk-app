import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  coloredBox: {
    backgroundColor: theme.colors.blueBackground,
    borderColor: theme.colors.blueBorder,
    borderWidth: 1,
    padding: 25,
    borderRadius: 10,
    marginVertical: 10,
  },
  boxHeading: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "Sofia-Pro-Bold",
    color: theme.colors.blue,
  },
  boxContent: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.blue,
    fontFamily: "Sofia-Pro-Regular",
  },
});
