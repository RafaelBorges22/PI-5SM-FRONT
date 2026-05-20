import { Platform, StyleSheet } from "react-native";
import { Colors } from "../../assets/constants/Colors";

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.safe },
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  header: { alignItems: "flex-start", marginBottom: 0, marginTop: 56 },
  formArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  inputWrapper: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
  },
  input: { fontSize: 20, fontWeight: "600", color: Colors.gold, minHeight: 44 },
  confirmButton: {
    marginTop: 8,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: 0.5,
  },
});
