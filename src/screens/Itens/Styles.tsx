import { StyleSheet } from "react-native";
import { Colors } from "../../assets/constants/Colors";

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.safe },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 110,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
