import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingBottom: 16,
    marginTop: 16,
    elevation: 2,
    flexDirection: "column",
  },
  backgroundImage: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 150,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    marginRight: 80,
    textTransform: "capitalize",
    fontFamily: "Sofia-Pro-Bold",
    color: theme.colors.white,
  },
  link: {
    fontSize: 16,
    marginTop: 12,
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Medium",
  },
  footerLinksContainer: {
    marginTop: 5,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderTopColor: "#e8e9e8",
    borderTopWidth: 1,
    marginLeft: 16,
  },
  footerLinks: {
    fontSize: 16,
    textTransform: "uppercase",
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Medium",
  },
});
