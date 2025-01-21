import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
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
  },
  forgotText: {
    fontSize: 15,
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: "left",
    textDecorationLine: "underline",
    fontFamily: "Sofia-Pro-Medium",
  },
  error: {
    color: theme.colors.error,
    marginBottom: 10,
  },
});
