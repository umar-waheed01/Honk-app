import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingRight: 90,
  },
  requestOption: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    paddingTop: 5,
  },
  requestInfo: {
    marginHorizontal: 10,
  },
  requestActions: {
    marginHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  requestText: {
    textTransform: "uppercase",
    color: theme.colors.primary,
  },
  acceptedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  acceptedIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  acceptedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "60%",
    paddingRight: 10,
  },
});
