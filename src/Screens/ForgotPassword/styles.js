import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
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
    fontFamily: "Sofia-Pro-Bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "Sofia-Pro-Medium",
  },
  input: {
    height: 50,
    borderColor: theme.colors.error,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 10,
    textAlign: "center",
  },
});
