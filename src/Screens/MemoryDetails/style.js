import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const styles = StyleSheet.create({
  backImage: {
    flex: 1,
    resizeMode: "cover",
  },
  innerContainer: {
    minHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  aboutInfo: {
    marginTop: 20,
    gap: 5,
  },
  aboutText: {
    fontSize: 20,
    color: "#aab2bd",
    fontWeight: "300",
  },
  userName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "300",
  },
  userText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "400",
  },
  memoryText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "400",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  postInfo: {
    marginTop: 100,
  },
  postDate: {
    fontSize: 22,
    color: "#aab2bd",
    fontWeight: "400",
  },
  postText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "300",
  },
  bottomContainer: {
    paddingHorizontal: 30,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
  },
  progressCount: {
    fontSize: 16,
    color: "#aab2bd",
  },
  profileName: {
    fontSize: 18,
    color: "#aab2bd",
    fontWeight: "400",
  },
  userNameLink: {
    fontSize: 18,
    textDecorationLine: "underline",
    fontWeight: "400",
    color: "#aab2bd",
  },
  showLiked: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  hr: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    borderStyle: "solid",
    marginVertical: 5,
  },
  likesLink: {
    fontSize: 20,
    fontWeight: "400",
    color: "#aab2bd",
  },
  inputArea: {
    flexDirection: "row",
    backgroundColor: "black",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginTop: 10,
  },
  iconInput: {
    backgroundColor: "red",
  },
  editName: {
    fontSize: 16,
  },
  editMemory: {
    fontSize: 16,
  },
  editProgress: {
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
