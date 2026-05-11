import { faPix } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { BackButton } from "../../components/BtnVoltar";
import { CornerAccent } from "../../components/CornerAccent";
import { MetodoPagamento } from "../../enum/PaymentMethod";
import { useInfinitePayListener } from "../../hooks/useInfinitePayListener";
import { payWithCredit } from "../../service/CreditService";
import { payWithDebit } from "../../service/DebitService";
import { servicoService } from "../../service/ServicoService";
import { ServicoResponse } from "../../types/Servico";
import { InfinitePayResult } from "../../utils/parseInfinitePayResult";
import PixQrCodeScreen from "../Pagamento/PixQRcodeScreen";

const PIX_CHAVE = "31b007ea-f1f0-48be-a72d-67ed74ddd8d2";

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

// ─── Tipos do Modal ───────────────────────────────────────────────────────────
type ModalConfig = {
  visible: boolean;
  titulo: string;
  mensagem: string;
  tipo: "erro" | "aviso" | "cancelado" | "processando";
  onConfirm?: () => void;
};

const modalInicial: ModalConfig = {
  visible: false,
  titulo: "",
  mensagem: "",
  tipo: "aviso",
  onConfirm: undefined,
};

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { nomeBarbeiro, valor, servico, produto, nomeCliente } =
    route.params as RootStackParamList["Payment"];

  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPagamento | null>(null);
  const [aguardandoPagamento, setAguardandoPagamento] = useState(false);
  const [servicoPix, setServicoPix] = useState<ServicoResponse | null>(null);
  const [modal, setModal] = useState<ModalConfig>(modalInicial);

  const selectedMetodoRef = useRef<MetodoPagamento | null>(null);

  const orderId = `DSM-${Date.now()}`;
  const valorEmCentavos = Math.round(valor * 100);

  // ─── Helpers do Modal ─────────────────────────────────────────────────────────
  const fecharModal = () => setModal((m) => ({ ...m, visible: false }));

  const mostrarModal = (config: Omit<ModalConfig, "visible">) => {
    setModal({ ...config, visible: true });
  };

  // ─── Listener InfinitePay ─────────────────────────────────────────────────────
  useInfinitePayListener(
    async (_result: InfinitePayResult) => {
      const metodo = selectedMetodoRef.current;
      if (!metodo) return;

      try {
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento:
            metodo === MetodoPagamento.CARTAO_CREDITO
              ? "CARTAO_CREDITO"
              : "CARTAO_DEBITO",
          produto,
          servico,
        });

        setAguardandoPagamento(false);
        navigation.navigate("PaymentSuccess");
      } catch {
        setAguardandoPagamento(false);
        mostrarModal({
          tipo: "aviso",
          titulo: "Atenção",
          mensagem:
            "Pagamento aprovado na máquina, mas falhou ao registrar. Entre em contato com o suporte.",
        });
      }
    },
    () => {
      setAguardandoPagamento(false);
      mostrarModal({
        tipo: "cancelado",
        titulo: "Cancelado",
        mensagem: "Pagamento não concluído.",
      });
    }
  );

  // ─── Seleção de método ────────────────────────────────────────────────────────
  const handleSelectMetodo = (metodo: MetodoPagamento) => {
    setSelectedMetodo(metodo);
    selectedMetodoRef.current = metodo;
  };

  // ─── Confirmação ─────────────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!selectedMetodo) {
      mostrarModal({
        tipo: "erro",
        titulo: "Atenção",
        mensagem: "Selecione um método de pagamento.",
      });
      return;
    }

    setAguardandoPagamento(true);

    try {
      if (selectedMetodo === MetodoPagamento.PIX) {
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
            chave: PIX_CHAVE,
            valor: valor.toFixed(2),
          },
        });
        setServicoPix(response);
        setAguardandoPagamento(false);
      }

      else if (selectedMetodo === MetodoPagamento.DINHEIRO) {
        await servicoService.criarSimples({
          valor,
          nomeCliente,
          nomeBarbeiro,
          statusPagamento: "PAGO",
          metodoPagamento: "DINHEIRO",
          produto,
          servico,
        });
        setAguardandoPagamento(false);
        navigation.navigate("PaymentSuccess");
      }

      else if (selectedMetodo === MetodoPagamento.CARTAO_CREDITO) {
        selectedMetodoRef.current = MetodoPagamento.CARTAO_CREDITO;
        await payWithCredit(valorEmCentavos, orderId, 1);
      }

      else if (selectedMetodo === MetodoPagamento.CARTAO_DEBITO) {
        selectedMetodoRef.current = MetodoPagamento.CARTAO_DEBITO;
        await payWithDebit(valorEmCentavos, orderId);
      }

    } catch (error) {
      setAguardandoPagamento(false);
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido.";
      mostrarModal({
        tipo: "erro",
        titulo: "Erro",
        mensagem,
      });
    }
  };

  // ─── Ícone por tipo ───────────────────────────────────────────────────────────
  const iconeModal = (tipo: ModalConfig["tipo"]) => {
    switch (tipo) {
      case "erro":     return { simbolo: "✕", cor: "#c0392b" };
      case "aviso":    return { simbolo: "!", cor: Colors.gold };
      case "cancelado":return { simbolo: "✕", cor: Colors.gold };
      case "processando": return { simbolo: "...", cor: Colors.gold };
    }
  };

  // ─── Render PIX ───────────────────────────────────────────────────────────────
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

  const icone = iconeModal(modal.tipo);

  // ─── Render principal ─────────────────────────────────────────────────────────
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
              {/* PIX */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.PIX && styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.PIX)}
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

              {/* DINHEIRO */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.DINHEIRO && styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.DINHEIRO)}
              >
                <Text style={styles.methodIcon}>💵</Text>
                <Text style={styles.methodText}>Dinheiro</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              {/* DÉBITO */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.CARTAO_DEBITO && styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.CARTAO_DEBITO)}
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Débito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              {/* CRÉDITO */}
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.CARTAO_CREDITO && styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.CARTAO_CREDITO)}
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Crédito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                aguardandoPagamento && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmPayment}
              disabled={aguardandoPagamento}
            >
              {aguardandoPagamento ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <Text style={styles.confirmText}>Confirmar Pagamento</Text>
              )}
            </TouchableOpacity>

            <BackButton onPress={() => navigation.goBack()} />
          </View>
        </ImageBackground>
      </SafeAreaView>

      {/* ─── Modal ─────────────────────────────────────────────────────────────── */}
      <Modal
        visible={modal.visible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Ícone */}
            <View style={[styles.modalIconCircle, { borderColor: icone.cor }]}>
              <Text style={[styles.modalIconText, { color: icone.cor }]}>
                {icone.simbolo}
              </Text>
            </View>

            {/* Título */}
            <Text style={styles.modalTitulo}>{modal.titulo}</Text>

            {/* Mensagem */}
            <Text style={styles.modalMensagem}>{modal.mensagem}</Text>

            {/* Botão */}
            <TouchableOpacity
              style={styles.modalBotao}
              onPress={() => {
                fecharModal();
                modal.onConfirm?.();
              }}
            >
              <Text style={styles.modalBotaoTexto}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 24,
    justifyContent: "center",
  },
  infoBox: {
    marginBottom: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 13,
  },
  value: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  totalLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  totalValue: {
    color: Colors.gold,
    fontSize: 36,
    fontWeight: "700",
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  selected: {
    borderColor: Colors.gold,
    backgroundColor: "#2e2a1a",
  },
  methodIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  methodText: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  methodArrow: {
    color: "#aaa",
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
    fontSize: 16,
    fontWeight: "700",
  },

  // ─── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalBox: {
    backgroundColor: "#242424",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
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
    fontWeight: "700",
  },
  modalTitulo: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMensagem: {
    color: "#aaa",
    fontSize: 14,
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
    fontSize: 15,
    fontWeight: "700",
  },
});