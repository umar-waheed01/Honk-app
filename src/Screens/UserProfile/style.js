import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  backImage: {
    width: "100%",
    height: 500,
    paddingTop: 150,
  },
  dpContainer: {
    alignItems: "center",
  },
  userInfo: {
    width: "85%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    borderRadius: 10,
  },
  dpText: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    fontWeight: "normal",
    textAlign: "center",
    paddingTop: 20,
  },
  userAge: {
    fontSize: 16,
    color: "#aab2bd",
    fontWeight: "normal",
    textAlign: "center",
    paddingVertical: 10,
  },
  summaryArea: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 3,
  },
  summaryTitle: {
    fontSize: 16,
  },
  networkTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
  },
  about: {
    marginTop: 70,
    fontSize: 14,
    fontWeight: "500",
  },
  userDPGrid: {
    paddingBottom: 30,
  },
  touchable: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  memoryContainer: {
    paddingTop: 30,
  },
  memoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    padding: 20,
    paddingLeft: 5,
  },
  progress: {
    width: "10%",
    marginTop: 30,
  },
  cards: {
    width: "90%",
  },
  networkText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    marginVertical: 10,
    fontFamily: "Sofia-Pro-Bold",
    paddingLeft: 20,
  },
});
