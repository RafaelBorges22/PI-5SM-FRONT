// src/screens/PaymentScreen.js

import React from 'react';
import { View, Button, Alert } from 'react-native';
import { startPayment } from '../service/InfiniteService';
import { useInfinitePayListener } from '../hooks/useInfinitePayListener';

export default function PaymentScreen() {

  useInfinitePayListener((url) => {
    console.log("Retorno recebido:", url);

    if (url.includes("approved")) {
      Alert.alert("Pagamento aprovado!");
    } else {
      Alert.alert("Pagamento finalizado.");
    }
  });

  const handlePayment = () => {
    startPayment({
      amount: 1000, // R$10,00
      paymentMethod: "credit",
      installments: 1,
      orderId: "PEDIDO-123",
      resultUrl: "meuapp://tap_result"
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button title="Pagar com InfinitePay" onPress={handlePayment} />
    </View>
  );
}
