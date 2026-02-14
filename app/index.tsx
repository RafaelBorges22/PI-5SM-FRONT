import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert
} from "react-native";

import { payWithCredit } from "../service/CreditService";
import { payWithDebit } from "../service/DebitService";

export default function Home() {

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [installments, setInstallments] = useState("");

  const handleCredit = async () => {
    if (!amount || !orderId || !installments) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    await payWithCredit(
      Number(amount),
      orderId,
      Number(installments)
    );
  };

  const handleDebit = async () => {
    if (!amount || !orderId) {
      Alert.alert("Preencha valor e pedido");
      return;
    }

    await payWithDebit(
      Number(amount),
      orderId
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento InfinitePay</Text>

      <TextInput
        placeholder="Valor (em centavos)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TextInput
        placeholder="Order ID"
        value={orderId}
        onChangeText={setOrderId}
        style={styles.input}
      />

      <TextInput
        placeholder="Parcelas (crédito)"
        keyboardType="numeric"
        value={installments}
        onChangeText={setInstallments}
        style={styles.input}
      />

      <Button title="Pagar no Crédito" onPress={handleCredit} />
      <View style={{ height: 10 }} />
      <Button title="Pagar no Débito" onPress={handleDebit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});
