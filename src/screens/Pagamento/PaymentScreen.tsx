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
import { ServicoResponse } from "../../types/Servico";
import PixQrCodeScreen from "../Pagamento/PixQRcodeScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";

// ⚠️ Substitua pela sua chave PIX real (UUID, CPF, e-mail, telefone, etc.)
const CHAVE_PIX = "31b007ea-f1f0-48be-a72d-67ed74ddd8d2";

type RootStackParamList = {
  Home: undefined;
  PaymentSuccess: undefined;
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
  const [servicoPix, setServicoPix] = useState<ServicoResponse | null>(null);

  const orderId = `DSM-${Date.now()}`;
  const valorEmCentavos = Math.round(valor * 100);

  // ─── Listener InfinitePay (crédito / débito) ──────────────────────────────
  // Só chamado após retorno real do deep link — cria o serviço AQUI
  useInfinitePayListener(
    async (result: InfinitePayResult) => {
      console.log("✅ Pagamento aprovado pelo InfinitePay:", result);

      try {
        // selectedMetodo ainda está no closure com o valor correto
        const metodoPagamento =
          selectedMetodo === "credito" ? "CARTAO_CREDITO" : "CARTAO_DEBITO";

        // ✅ Body plano — igual ao ServicoSimples da API
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento,
          produto,
          servico,
        });

        setAguardandoPagamento(false);
        navigation.navigate("PaymentSuccess");
      } catch (error) {
        setAguardandoPagamento(false);
        console.error("Erro ao registrar serviço após pagamento:", error);
        Alert.alert(
          "Atenção",
          "Pagamento aprovado, mas houve uma falha ao registrar o serviço. Contate o suporte."
        );
      }
    },
    () => {
      setAguardandoPagamento(false);
      Alert.alert("Pagamento não aprovado", "Tente novamente.");
    }
  );

  // ─── Confirmar pagamento ───────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!selectedMetodo) {
      Alert.alert("Erro", "Selecione um método de pagamento");
      return;
    }

    setAguardandoPagamento(true);

    try {
      // 💚 PIX → body com "data" + "pix"
      if (selectedMetodo === "pix") {
        const response = await servicoService.criarPix({
          data: {
            valor,
            nomeCliente,
            nomeBarbeiro,
            statusPagamento: "PENDENTE",
            metodoPagamento: "PIX",
            produto,
            servico,
          },
          pix: {
            chave: CHAVE_PIX,
            valor: valor.toFixed(2), // "50.00"
          },
        });

        setServicoPix(response);
        setAguardandoPagamento(false);
        return;
      }

      // 💵 Dinheiro → body plano, cria direto e navega
      if (selectedMetodo === "dinheiro") {
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento: "DINHEIRO",
          produto,
          servico,
        });

        navigation.navigate("PaymentSuccess");
        return;
      }

      // 💳 Crédito → abre InfinitePay; serviço criado no listener
      if (selectedMetodo === "credito") {
        await payWithCredit(valorEmCentavos, orderId, 1);
        // aguardandoPagamento fica true até o listener responder
        return;
      }

      // 💳 Débito → abre InfinitePay; serviço criado no listener
      if (selectedMetodo === "debito") {
        await payWithDebit(valorEmCentavos, orderId);
        // aguardandoPagamento fica true até o listener responder
        return;
      }
    } catch (error) {
      setAguardandoPagamento(false);
      console.error(error);
      Alert.alert("Erro", "Falha ao registrar o pedido. Tente novamente.");
    }
  };

  // ─── Tela PIX QR Code ─────────────────────────────────────────────────────
  if (servicoPix) {
    return (
      <PixQrCodeScreen
        servico={servicoPix}
        onVoltar={() => setServicoPix(null)}
        onTimeout={() =>
          navigation.reset({ index: 0, routes: [{ name: "Home" }] })
        }
      />
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
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
                style={[
                  styles.methodButton,
                  selectedMetodo === "pix" && styles.selected,
                ]}
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
                style={[
                  styles.methodButton,
                  selectedMetodo === "dinheiro" && styles.selected,
                ]}
                onPress={() => setSelectedMetodo("dinheiro")}
              >
                <Text style={styles.methodIcon}>💵</Text>
                <Text style={styles.methodText}>Dinheiro</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === "debito" && styles.selected,
                ]}
                onPress={() => setSelectedMetodo("debito")}
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Débito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === "credito" && styles.selected,
                ]}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: "center",
    gap: 16,
  },
  infoBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  totalContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  totalLabel: {
    color: "#aaa",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 4,
  },
  methodsContainer: {
    gap: 10,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  selected: {
    borderColor: Colors.white ?? "#fff",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  methodIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  methodText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    fontWeight: "500",
  },
  methodArrow: {
    color: "#aaa",
    fontSize: 22,
  },
  confirmButton: {
    backgroundColor: Colors.white ?? "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});