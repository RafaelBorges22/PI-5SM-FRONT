import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../assets/constants/Colors";
import { FontSizes, FontWeights } from "../../../assets/constants/Fonts";

type Props = {
  total: number;
};

export function TotalBox({ total }: Props) {
  const formatted = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>Total: </Text>
        {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: Colors.blackOverlay,
  },

  text: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    color: Colors.gold,
  },

  label: {
    color: "#D4A017",
  },
});
