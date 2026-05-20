import { Platform, StyleSheet } from "react-native";
import { Colors } from "../../assets/constants/Colors";

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.safe },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 72 : 76,
    paddingBottom: 56,
    gap: 16,
    alignItems: "center",
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  scroll: { flex: 1, width: "100%", maxHeight: "82%" },
  scrollContent: { gap: 12, paddingVertical: 4, alignItems: "center" },
  row: { flexDirection: "row", gap: 12, width: "100%", paddingHorizontal: 8 },
  columnItem: { width: "48%", height: 200 },
  emptySlot: { width: "48%" },
  backButtonWrap: {
    position: "absolute",
    left: 16,
    bottom: 75,
    zIndex: 60,
  },
});
