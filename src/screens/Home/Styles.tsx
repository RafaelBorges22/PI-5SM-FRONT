import { StyleSheet } from "react-native";
import { Colors } from "../../assets/constants/Colors";

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoImage: {
    width: 240,
    height: 240,
  },
  wordmark: {
    color: Colors.goldDark,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 6,
    marginTop: -60,
  },
  welcomeText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0.5,
    textAlign: "center",
    marginTop: 70, 
  },
  startWrapper: {
    width: "100%",
    marginTop: 24,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  startHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  startLabel: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
  },
});
