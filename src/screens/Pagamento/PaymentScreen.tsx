import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../../assets/constants/Colors";
import { CornerAccent } from "../../components/CornerAccent";
import { CancelButton } from "../../components/BtnCancelar";
import { createServico } from "../../service/services";
import { payWithCredit } from "../../service/CreditService";
import { payWithDebit } from "../../service/DebitService";
import { useInfinitePayListener } from "../../hooks/useInfinitePayListener";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";

type RootStackParamList = {
  Home: undefined;
  SelectBarber: undefined;
  SelectItems: { nomeBarbeiro: string };
  DigiteSeuNome: {
    valor: number;
    nomeBarbeiro: string;
    servico: string;
    produto: string;
  };
  Payment: {
    valor: number;
    nomeBarbeiro: string;
    servico: string;
    produto: string;
    nomeCliente: string;
  };
};

export default function PaymentScreen() {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { nomeBarbeiro, valor, servico, produto, nomeCliente } =
    route.params as {
      nomeBarbeiro: string;
      valor: number;
      servico: string;
      produto: string;
      nomeCliente: string;
    };

  const [selectedMetodo, setSelectedMetodo] = useState<string>("");
  const [aguardandoPagamento, setAguardandoPagamento] = useState(false);

  const metodoMap: Record<string, string> = {
    dinheiro: "DINHEIRO",
    credito: "CARTAO_CREDITO",
    debito: "CARTAO_DEBITO",
    pix: "PIX",
  };

  const orderId = `DSM-${Date.now()}`;
  const valorEmCentavos = Math.round(valor * 100);

  // ✅ Listener do retorno do InfinitePay via Deep Link
  useInfinitePayListener(async (url: string) => {
    if (!url.includes("tap_result")) return;
    setAguardandoPagamento(false);

    if (url.includes("approved")) {
      Alert.alert("Sucesso", "Pagamento aprovado!", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            }),
        },
      ]);
    } else {
      Alert.alert("Pagamento não aprovado", "Tente novamente.");
    }
  });

  const handleConfirmPayment = async () => {
    if (!selectedMetodo) {
      Alert.alert("Erro", "Selecione um método de pagamento");
      return;
    }

    const payload = {
      valor,
      nomeCliente,
      nomeBarbeiro,
      statusPagamento: "PAGO",
      metodoPagamento: metodoMap[selectedMetodo],
      produto,
      servico,
    };

    try {
      // ✅ Registra no banco
      await createServico(payload);

      // 💳 Crédito → abre InfinitePay e já reseta para Home
      if (selectedMetodo === "credito") {
        setAguardandoPagamento(true);
        await payWithCredit(valorEmCentavos, orderId, 1);
        navigation.reset({ index: 0, routes: [{ name: "Home" }] }); // ✅
        return;
      }

      // 💳 Débito → abre InfinitePay e já reseta para Home
      if (selectedMetodo === "debito") {
        setAguardandoPagamento(true);
        await payWithDebit(valorEmCentavos, orderId);
        navigation.reset({ index: 0, routes: [{ name: "Home" }] }); // ✅
        return;
      }

      // 💵 Dinheiro ou PIX → reseta para Home direto
      navigation.reset({ index: 0, routes: [{ name: "Home" }] }); // ✅

    } catch (error) {
      setAguardandoPagamento(false);
      console.error(error);
      Alert.alert("Erro", "Falha ao registrar o pedido. Tente novamente.");
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />

      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require("../../assets/img/Background.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />

          <View style={styles.content}>
            {/* BARBEIRO */}
            <View style={styles.infoBox}>
              <Text style={styles.label}>Barbeiro</Text>
              <Text style={styles.value}>{nomeBarbeiro}</Text>
            </View>

            {/* TOTAL */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {valor.toFixed(2)}</Text>
            </View>

          {/* MÉTODOS */}
          <View style={styles.methodsContainer}>
            <TouchableOpacity
              style={[styles.methodButton, selectedMetodo === "pix" && styles.selected]}
              onPress={() => setSelectedMetodo("pix")}
            >
            <FontAwesomeIcon
                icon={faPix}
                size={24}
                color="#32BCAD"
                style={{ marginRight: 14 }}
              />
              <Text style={styles.methodText}>PIX</Text>
              <Text style={styles.methodArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodButton, selectedMetodo === "dinheiro" && styles.selected]}
              onPress={() => setSelectedMetodo("dinheiro")}
            >
              <Text style={styles.methodIcon}>💵</Text>
              <Text style={styles.methodText}>Dinheiro</Text>
              <Text style={styles.methodArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodButton, selectedMetodo === "debito" && styles.selected]}
              onPress={() => setSelectedMetodo("debito")}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <Text style={styles.methodText}>Cartão de Débito</Text>
              <Text style={styles.methodArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodButton, selectedMetodo === "credito" && styles.selected]}
              onPress={() => setSelectedMetodo("credito")}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <Text style={styles.methodText}>Cartão de Crédito</Text>
              <Text style={styles.methodArrow}>›</Text>
            </TouchableOpacity>
          </View>

            {/* BOTÃO CONFIRMAR */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                aguardandoPagamento && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmPayment}
              disabled={aguardandoPagamento}
            >
              <Text style={styles.confirmText}>
                {aguardandoPagamento
                  ? "Aguardando pagamento..."
                  : "Confirmar Pagamento"}
              </Text>
            </TouchableOpacity>

            <CancelButton onPress={() => navigation.goBack()} />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  infoBox: {
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  totalContainer: {
    alignItems: "center",
    marginTop: -20,
  },
  totalLabel: {
    color: "#94A3B8",
    fontSize: 16,
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
  },

  confirmButton: {
    backgroundColor: Colors.gold,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  methodsContainer: {
  gap: 12,
},
methodButton: {
  flexDirection: "row",
  alignItems: "center",
  padding: 18,
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",
},
selected: {
  borderColor: Colors.gold,
  backgroundColor: "rgba(212,160,23,0.15)",
},
methodIcon: {
  fontSize: 24,
  marginRight: 14,
},
methodText: {
  flex: 1,
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "bold",
},
methodArrow: {
  color: "rgba(255,255,255,0.5)",
  fontSize: 26,
  fontWeight: "300",
},
});