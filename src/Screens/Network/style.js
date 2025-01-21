import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
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
    color: theme.colors.text,
    marginLeft: 10,
    fontWeight: "500",
  },
  touchable: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 30,
    width: "70%",
  },
  requestContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  requestInfo: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  friendsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    right: -5,
  },
});
