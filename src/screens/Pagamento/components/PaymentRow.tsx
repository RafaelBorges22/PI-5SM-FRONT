import { createServico } from '@/src/service/services';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

      const response = await createServico(payload);

      console.log("✅ Serviço criado:", response.data);
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
    borderColor: '#999',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icon: {
    fontSize: 22,
  },

  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  arrow: {
    color: '#ccc',
    fontSize: 22,
  },
});