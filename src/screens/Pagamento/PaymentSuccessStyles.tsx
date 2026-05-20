import { StyleSheet } from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { FontSizes, FontWeights } from "../../assets/constants/Fonts";

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.goldOverlay,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCheck: {
    fontSize: FontSizes.huge,
    color: Colors.black,
    fontWeight: FontWeights.black,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 48,
  },
  titulo: {
    color: Colors.white,
    fontSize: FontSizes.heading,
    fontWeight: FontWeights.black,
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitulo: {
    color: Colors.grayDark,
    fontSize: FontSizes.subtitle,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  divisor: {
    width: 40,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
    marginVertical: 24,
  },
  mensagem: {
    color: Colors.gray,
    fontSize: FontSizes.body,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  botaoWrapper: {
    width: "100%",
  },
  botao: {
    backgroundColor: Colors.gold,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  botaoTexto: {
    color: Colors.black,
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.black,
    letterSpacing: 0.5,
  },
});
