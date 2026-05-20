import React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../../assets/constants/Colors";
import { FontSizes, FontWeights } from "../../../assets/constants/Fonts";

export function SelectItemsTitle() {
  return <Text style={styles.text}>Selecione seus itens:</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
