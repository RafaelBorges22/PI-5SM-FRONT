// components/PixQrCodeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ServicoResponse } from '../../types/Servico';
import { Colors } from '../../assets/constants/Colors';

interface Props {
  servico: ServicoResponse;
  onVoltar?: () => void;
  onTimeout?: () => void;
}

const TIMEOUT_SEGUNDOS = 180; // 3 minutos

export default function PixQrCodeScreen({ servico, onVoltar, onTimeout }: Props) {
  const [segundosRestantes, setSegundosRestantes] = useState(TIMEOUT_SEGUNDOS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(servico.valor);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos}:${String(segundos).padStart(2, '0')}`;
  const progresso = segundosRestantes / TIMEOUT_SEGUNDOS;

  const corTimer =
    segundosRestantes > 60
      ? Colors.gold
      : segundosRestantes > 30
      ? '#E07B00'
      : '#C0392B';

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* VALOR */}
          <Text style={styles.valorLabel}>Total a pagar</Text>
          <Text style={styles.valorTexto}>{valorFormatado}</Text>

          {/* QR CODE */}
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

          {/* TIMER */}
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

          {/* VOLTAR */}
          {onVoltar ? (
            <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
              <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
            </TouchableOpacity>
          ) : null}

        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  // VALOR
  valorLabel: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valorTexto: {
    color: Colors.gold,
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 36,
    letterSpacing: 1,
  },

  // QR CODE
  qrArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  qrWrapper: {
    position: 'relative',
  },
  qrBorder: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  qrPlaceholder: {
    width: 252,
    height: 252,
    backgroundColor: Colors.safe,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.2)',
  },
  qrLoadingTexto: {
    color: '#555',
    fontSize: 13,
  },

  // Cantos dourados
  canto: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.gold,
  },
  cantoTL: {
    top: -6,
    left: -6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cantoTR: {
    top: -6,
    right: -6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cantoBL: {
    bottom: -6,
    left: -6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cantoBR: {
    bottom: -6,
    right: -6,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },

  // TIMER
  timerContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  timerValor: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 4,
  },
  timerBarBg: {
    width: '80%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  timerSub: {
    color: '#555',
    fontSize: 12,
    letterSpacing: 0.3,
  },

  // VOLTAR
  botaoVoltar: {
    marginTop: 40,
    padding: 12,
  },
  botaoVoltarTexto: {
    color: '#444',
    fontSize: 14,
  },
});