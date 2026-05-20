import { faPix } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Modal,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/constants/Colors";
import { BackButton } from "../../components/BtnVoltar";
import { MetodoPagamento } from "../../enum/PaymentMethod";
import { useInfinitePayListener } from "../../hooks/useInfinitePayListener";
import { payWithCredit } from "../../service/CreditService";
import { payWithDebit } from "../../service/DebitService";
import { servicoService } from "../../service/ServicoService";
import { ServicoResponse } from "../../types/Servico";
import { InfinitePayResult } from "../../utils/parseInfinitePayResult";
import styles from "./PaymentStyles";
import PixQrCodeScreen from "./PixQRcodeScreen";

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { nomeBarbeiro, valor, servico, produto, nomeCliente } =
    route.params as RootStackParamList["Payment"];

  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPagamento | null>(
    null,
  );
  const [aguardandoPagamento, setAguardandoPagamento] = useState(false);
  const [servicoPix, setServicoPix] = useState<ServicoResponse | null>(null);
  const [modal, setModal] = useState<ModalConfig>(modalInicial);

  const selectedMetodoRef = useRef<MetodoPagamento | null>(null);

  const orderId = `DSM-${Date.now()}`;
  const valorEmCentavos = Math.round(valor * 100);

  const fecharModal = () => setModal((m) => ({ ...m, visible: false }));

  const mostrarModal = (config: Omit<ModalConfig, "visible">) => {
    setModal({ ...config, visible: true });
  };

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
    },
  );

  const handleSelectMetodo = (metodo: MetodoPagamento) => {
    setSelectedMetodo(metodo);
    selectedMetodoRef.current = metodo;
  };

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
      } else if (selectedMetodo === MetodoPagamento.DINHEIRO) {
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
      } else if (selectedMetodo === MetodoPagamento.CARTAO_CREDITO) {
        selectedMetodoRef.current = MetodoPagamento.CARTAO_CREDITO;
        await payWithCredit(valorEmCentavos, orderId, 1);
      } else if (selectedMetodo === MetodoPagamento.CARTAO_DEBITO) {
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

  const iconeModal = (tipo: ModalConfig["tipo"]) => {
    switch (tipo) {
      case "erro":
        return { simbolo: "✕", cor: Colors.danger };
      case "aviso":
        return { simbolo: "!", cor: Colors.gold };
      case "cancelado":
        return { simbolo: "✕", cor: Colors.gold };
      case "processando":
        return { simbolo: "...", cor: Colors.gold };
    }
  };

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

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require("../../assets/img/Background.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
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
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.PIX && styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.PIX)}
              >
                <FontAwesomeIcon
                  icon={faPix}
                  size={24}
                  color={Colors.success}
                  style={{ marginRight: 14 }}
                />
                <Text style={styles.methodText}>PIX</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.DINHEIRO &&
                    styles.selected,
                ]}
                onPress={() => handleSelectMetodo(MetodoPagamento.DINHEIRO)}
              >
                <Text style={styles.methodIcon}>💵</Text>
                <Text style={styles.methodText}>Dinheiro</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.CARTAO_DEBITO &&
                    styles.selected,
                ]}
                onPress={() =>
                  handleSelectMetodo(MetodoPagamento.CARTAO_DEBITO)
                }
              >
                <Text style={styles.methodIcon}>💳</Text>
                <Text style={styles.methodText}>Cartão de Débito</Text>
                <Text style={styles.methodArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  selectedMetodo === MetodoPagamento.CARTAO_CREDITO &&
                    styles.selected,
                ]}
                onPress={() =>
                  handleSelectMetodo(MetodoPagamento.CARTAO_CREDITO)
                }
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
                <ActivityIndicator color={Colors.black} />
              ) : (
                <Text style={styles.confirmText}>Confirmar Pagamento</Text>
              )}
            </TouchableOpacity>

            <BackButton onPress={() => navigation.goBack()} />
          </View>
        </ImageBackground>
      </SafeAreaView>

      <Modal
        visible={modal.visible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[styles.modalIconCircle, { borderColor: icone.cor }]}>
              <Text style={[styles.modalIconText, { color: icone.cor }]}>
                {icone.simbolo}
              </Text>
            </View>
            <Text style={styles.modalTitulo}>{modal.titulo}</Text>
            <Text style={styles.modalMensagem}>{modal.mensagem}</Text>
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
