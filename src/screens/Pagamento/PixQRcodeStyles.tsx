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
    padding: 32,
  },
  valorLabel: {
    color: Colors.grayDark,
    fontSize: FontSizes.small,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valorTexto: {
    color: Colors.gold,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.black,
    marginBottom: 36,
    letterSpacing: 1,
  },
  qrArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrWrapper: {
    position: "relative",
  },
  qrBorder: {
    padding: 16,
    backgroundColor: Colors.whitePure,
    borderRadius: 16,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  qrPlaceholder: {
    width: 252,
    height: 252,
    backgroundColor: Colors.safe,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.goldOverlay,
  },
  qrLoadingTexto: {
    color: Colors.grayDark,
    fontSize: FontSizes.small,
  },
  avisoContainer: {
    backgroundColor: Colors.goldHighlight,
    borderWidth: 1,
    borderColor: Colors.goldOverlay,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 28,
    width: "90%",
  },
  avisoTexto: {
    color: Colors.gold,
    fontSize: FontSizes.small,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: FontWeights.semibold,
  },
  canto: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: Colors.gold,
  },
  cantoTL: {
    top: -6,
    left: -6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cantoTR: {
    top: -6,
    right: -6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cantoBL: {
    bottom: -6,
    left: -6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cantoBR: {
    bottom: -6,
    right: -6,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  timerContainer: {
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  timerValor: {
    fontSize: FontSizes.display,
    fontWeight: FontWeights.black,
    letterSpacing: 4,
  },
  timerBarBg: {
    width: "80%",
    height: 3,
    backgroundColor: Colors.whiteSoft,
    borderRadius: 2,
    overflow: "hidden",
  },
  timerBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  timerSub: {
    color: Colors.grayDark,
    fontSize: FontSizes.caption,
    letterSpacing: 0.3,
  },
  botaoWrapper: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  botao: {
    width: "85%",
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  botaoTexto: {
    color: Colors.background,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.black,
    letterSpacing: 0.5,
  },
  botaoVoltar: {
    marginTop: 20,
    padding: 12,
  },
  botaoVoltarTexto: {
    color: Colors.grayDarker,
    fontSize: FontSizes.label,
  },
});
