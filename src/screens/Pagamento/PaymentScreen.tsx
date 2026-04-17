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
import { payWithCredit } from "../../service/CreditService";
import { payWithDebit } from "../../service/DebitService";
import { useInfinitePayListener } from "../../hooks/useInfinitePayListener";
import { InfinitePayResult } from "../../utils/parseInfinitePayResult";
import { servicoService } from "../../service/ServicoService";
import { ServicoResponse, MetodoPagamento } from "../../types/Servico"; // Importando o Type do seu arquivo
import PixQrCodeScreen from "../Pagamento/PixQRcodeScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";

type RootStackParamList = {
  Home: undefined;
  PaymentSuccess: undefined;
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { nomeBarbeiro, valor, servico, produto, nomeCliente } =
    route.params as {
      nomeBarbeiro: string;
      valor: number;
      servico: string;
      produto: string;
      nomeCliente: string;
    };

  // Agora o estado usa o tipo MetodoPagamento vindo do seu types/Servico.ts
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPagamento | null>(null);
  const [aguardandoPagamento, setAguardandoPagamento] = useState(false);
  const [servicoPix, setServicoPix] = useState<ServicoResponse | null>(null);

  const orderId = `DSM-${Date.now()}`;
  const valorEmCentavos = Math.round(valor * 100);

  // ─── Listener InfinitePay (Cartões) ──────────────────────────────
  useInfinitePayListener(
    async (result: InfinitePayResult) => {
      try {
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento: selectedMetodo!, 
          produto,
          servico,
        });

        setAguardandoPagamento(false);
        navigation.navigate("PaymentSuccess");
      } catch (error) {
        setAguardandoPagamento(false);
        Alert.alert("Erro", "Pagamento aprovado, mas falhou ao registrar.");
      }
    },
    () => {
      setAguardandoPagamento(false);
      Alert.alert("Cancelado", "Pagamento não concluído.");
    }
  );

  // ─── Confirmar Pagamento ──────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!selectedMetodo) {
      Alert.alert("Erro", "Selecione um método de pagamento");
      return;
    }

    setAguardandoPagamento(true);

    try {
      if (selectedMetodo === 'PIX') {
        const response = await servicoService.criarPix({
          data: {
            valor: valor.toString(), // Seu ServicoData pede string no valor
            nomeCliente,
            nomeBarbeiro,
            statusPagamento: "PENDENTE",
            metodoPagamento: 'PIX',
            produto,
            servico,
            dataServico: new Date().toISOString(),
          }
        });

        setServicoPix(response);
        setAguardandoPagamento(false);
        return;
      }

      if (selectedMetodo === 'DINHEIRO') {
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento: 'DINHEIRO',
          produto,
          servico,
        });

        navigation.navigate("PaymentSuccess");
        return;
      }

      if (selectedMetodo === 'CARTAO_CREDITO') {
        await payWithCredit(valorEmCentavos, orderId, 1);
        return;
      }

      if (selectedMetodo === 'CARTAO_DEBITO') {
        await payWithDebit(valorEmCentavos, orderId);
        return;
      }
    } catch (error) {
      setAguardandoPagamento(false);
      Alert.alert("Erro", "Falha na comunicação com o servidor.");
    }
  };

  if (servicoPix) {
    return (
      <PixQrCodeScreen
        servico={servicoPix}
        onVoltar={() => setServicoPix(null)}
        onTimeout={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}
      />
    );
  }

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
            <View style={styles.infoBox}>
              <Text style={styles.label}>Barbeiro</Text>
              <Text style={styles.value}>{nomeBarbeiro}</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {valor.toFixed(2)}</Text>
            </View>

            <View style={styles.methodsContainer}>
              <TouchableOpacity
                style={[styles.methodButton, selectedMetodo === 'PIX' && styles.selected]}
                onPress={() => setSelectedMetodo('PIX')}
              >
                <FontAwesomeIcon icon={faPix} size={24} color="#32BCAD" style={{ marginRight: 14 }} />
                <Text style={styles.methodText}>PIX</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodButton, selectedMetodo === 'DINHEIRO' && styles.selected]}
                onPress={() => setSelectedMetodo('DINHEIRO')}
              >
                <Text style={styles.methodIcon}>💵</Text>
                <Text style={styles.methodText}>Dinheiro</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodButton, selectedMetodo === 'CARTAO_DEBITO' && styles.selected]}
                onPress={() => setSelectedMetodo('CARTAO_DEBITO')}
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Débito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodButton, selectedMetodo === 'CARTAO_CREDITO' && styles.selected]}
                onPress={() => setSelectedMetodo('CARTAO_CREDITO')}
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Crédito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, aguardandoPagamento && styles.confirmButtonDisabled]}
              onPress={handleConfirmPayment}
              disabled={aguardandoPagamento}
            >
              <Text style={styles.confirmText}>
                {aguardandoPagamento ? "Processando..." : "Confirmar Pagamento"}
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
  safe: { flex: 1, backgroundColor: Colors.safe },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 16 },
  infoBox: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 12, padding: 16 },
  label: { color: "#aaa", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  value: { color: "#fff", fontSize: 18, fontWeight: "600" },
  totalContainer: { alignItems: "center", marginVertical: 8 },
  totalLabel: { color: "#aaa", fontSize: 14, textTransform: "uppercase" },
  totalValue: { color: "#fff", fontSize: 36, fontWeight: "700" },
  methodsContainer: { gap: 10 },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  selected: { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.15)" },
  methodIcon: { fontSize: 22, marginRight: 14 },
  methodText: { color: "#fff", fontSize: 16, flex: 1, fontWeight: "500" },
  methodArrow: { color: "#aaa", fontSize: 22 },
  confirmButton: { backgroundColor: "#fff", borderRadius: 12, padding: 18, alignItems: "center", marginTop: 8 },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmText: { color: "#000", fontSize: 16, fontWeight: "700" },
});