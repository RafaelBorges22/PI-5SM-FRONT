import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/constants/Colors";
import { ServicoResponse } from "../../types/Servico";
import styles from "./PixQRcodeStyles";

interface Props {
  servico: ServicoResponse;
  onVoltar?: () => void;
  onTimeout?: () => void;
}

const TIMEOUT_SEGUNDOS = 180;

export default function PixQrCodeScreen({
  servico,
  onVoltar,
  onTimeout,
}: Props) {
  const [segundosRestantes, setSegundosRestantes] = useState(TIMEOUT_SEGUNDOS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigation = useNavigation<any>();
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(servico.valor);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos}:${String(segundos).padStart(2, "0")}`;
  const progresso = segundosRestantes / TIMEOUT_SEGUNDOS;

  const corTimer =
    segundosRestantes > 60
      ? Colors.gold
      : segundosRestantes > 30
        ? "#E07B00"
        : "#C0392B";

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.valorLabel}>Total a pagar</Text>
          <Text style={styles.valorTexto}>{valorFormatado}</Text>

          <View style={styles.qrArea}>
            {servico.pixImagemQrCode ? (
              <View style={styles.qrWrapper}>
                <View style={styles.qrBorder}>
                  <Image
                    source={{ uri: servico.pixImagemQrCode }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.canto, styles.cantoTL]} />
                <View style={[styles.canto, styles.cantoTR]} />
                <View style={[styles.canto, styles.cantoBL]} />
                <View style={[styles.canto, styles.cantoBR]} />
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <ActivityIndicator size="large" color={Colors.gold} />
                <Text style={styles.qrLoadingTexto}>Gerando QR Code...</Text>
              </View>
            )}
          </View>

          <View style={styles.avisoContainer}>
            <Text style={styles.avisoTexto}>
              Após o pagamento, por favor apresentar o comprovante a um de
              nossos barbeiros.
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={[styles.timerValor, { color: corTimer }]}>
              {tempoFormatado}
            </Text>

            <View style={styles.timerBarBg}>
              <View
                style={[
                  styles.timerBarFill,
                  {
                    width: `${progresso * 100}%`,
                    backgroundColor: corTimer,
                  },
                ]}
              />
            </View>

            <Text style={styles.timerSub}>QR Code expira em</Text>
          </View>

          <Animated.View
            style={[styles.botaoWrapper, { opacity: opacityAnim }]}
          >
            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.85}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                })
              }
            >
              <Text style={styles.botaoTexto}>Voltar ao início</Text>
            </TouchableOpacity>
          </Animated.View>

          {onVoltar ? (
            <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
              <Text style={styles.botaoVoltarTexto}>
                ← Voltar a tela de pagamentos
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    </>
  );
}
