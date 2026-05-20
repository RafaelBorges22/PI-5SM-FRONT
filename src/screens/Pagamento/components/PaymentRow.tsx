import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { FontSizes, FontWeights } from "../../assets/constants/Fonts";

export function PaymentRow({ method, dadosServico }: any) {
  const handlePress = async () => {
    try {
      let metodoPagamento = "";

      if (method.type === "debito") {
        metodoPagamento = "CARTAO_DEBITO";
      } else if (method.type === "credito") {
        metodoPagamento = "CARTAO_CREDITO";
      }

      const payload = {
        ...dadosServico,
        metodoPagamento,
        statusPagamento: "PAGO",
      };

      // TODO: replace createServico import with actual service if needed.
      console.log("✅ Serviço criado:", payload);
    } catch (error) {
      console.error("❌ Erro:", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.icon}>{method.icon}</Text>
        <Text style={styles.label}>{method.label}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.grayMedium,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.whiteOverlay,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icon: {
    fontSize: FontSizes.large,
    color: Colors.white,
  },

  label: {
    color: Colors.white,
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
  },

  arrow: {
    color: Colors.grayLight,
    fontSize: FontSizes.large,
  },
});
