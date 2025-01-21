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
  },
  cardImageContainer: {
    backgroundColor: theme.colors.white,
    width: 85,
    height: 85,
    borderRadius: 40,
    borderBottomLeftRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderBottomLeftRadius: 0,
  },
  title: {
    fontSize: 20,
    textTransform: "capitalize",
    fontFamily: "Sofia-Pro-Bold",
    marginRight: 80,
  },
  date: {
    marginTop: 3,
    lineHeight: 20,
    fontSize: 18,
    fontFamily: "Sofia-Pro-Medium",
  },
  description: {
    fontSize: 18,
    marginTop: 10,
    lineHeight: 25,
    fontFamily: "Sofia-Pro-Regular",
  },
  memoryDate: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: 8,
    fontFamily: "Merriweather-Regular",
  },
  memoryTitle: {
    fontSize: 22,
    marginTop: 10,
    lineHeight: 25,
    fontFamily: "Merriweather-Regular",
  },
  memoryDescription: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: "Merriweather-Regular",
  },
  cardContent: {
    marginHorizontal: 16,
    flex: 1,
  },
  time: {
    color: theme.colors.muted,
    fontSize: 12,
    marginVertical: 12,
    fontFamily: "Sofia-Pro-Regular",
  },
  link: {
    fontSize: 16,
    marginTop: 8,
    color: theme.colors.primary,
    textDecorationLine: "underline",
    fontFamily: "Sofia-Pro-Medium",
    textTransform: "uppercase",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
