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
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  infoBox: {
    marginBottom: 16,
  },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.small,
  },
  value: {
    color: Colors.white,
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  totalLabel: {
    color: Colors.gray,
    fontSize: FontSizes.label,
  },
  totalValue: {
    color: Colors.gold,
    fontSize: 36,
    fontWeight: FontWeights.black,
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selected: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surfaceActive,
  },
  methodIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  methodText: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.body,
  },
  methodArrow: {
    color: Colors.gray,
    fontSize: 20,
  },
  confirmButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: Colors.black,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.surfaceDark,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 22,
    fontWeight: FontWeights.black,
  },
  modalTitulo: {
    color: Colors.white,
    fontSize: FontSizes.title,
    fontWeight: FontWeights.black,
    marginBottom: 8,
    textAlign: "center",
  },
  modalMensagem: {
    color: Colors.gray,
    fontSize: FontSizes.label,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBotao: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 48,
  },
  modalBotaoTexto: {
    color: Colors.black,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },
});
