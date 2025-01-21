import { StyleSheet } from "react-native";
import { theme } from "../../../util/theme";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    backgroundColor: theme.colors.white,
  },
  logo: {
    flexDirection: "row",
    gap: 7,
  },
  logoTextSm: {
    fontSize: 14,
    marginTop: 5,
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Medium",
    alignSelf: "flex-start",
  },
  logoTextLg: {
    fontSize: 23,
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Medium",
    alignSelf: "center",
  },
  headerImage: {
    width: 50,
    height: 50,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
  inbox: {
    padding: 10,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  notificationContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  notificationNumber: {
    color: theme.colors.white,
    fontFamily: "Sofia-Pro-Medium",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  inboxText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontFamily: "Sofia-Pro-Medium",
  },
  search: {
    padding: 5,
  },
  dropdown: {
    position: "absolute",
    top: 160,
    left: 10,
    right: 10,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 250,
    zIndex: 999999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ddd",
    padding: 5,
  },
  name: {
    fontSize: 16,
    marginLeft: 10,
    color: theme.colors.text,
    fontFamily: "Sofia-Pro-Medium",
  },
});
