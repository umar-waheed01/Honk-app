import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "capitalize",
    fontFamily: "Sofia-Pro-Bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "Sofia-Pro-Medium",
    fontFamily: "Sofia-Pro-Medium",
  },
  otherInformation: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 30,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "Sofia-Pro-Regular",
  },
  // errorText: {
  //   color: theme.colors.error,
  //   marginTop: 3,
  //   textAlign: "left",
  // },
});
