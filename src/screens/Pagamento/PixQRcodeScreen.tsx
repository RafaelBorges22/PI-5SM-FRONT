// components/PixQrCodeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Clipboard,
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

const TIMEOUT_SEGUNDOS = 90;

export default function PixQrCodeScreen({ servico, onVoltar, onTimeout }: Props) {
  const [copiado, setCopiado] = useState(false);
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

  const copiarCodigo = () => {
    if (!servico.pixQrCode) return;
    Clipboard.setString(servico.pixQrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(servico.valor);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos}:${String(segundos).padStart(2, '0')}`;
  const progresso = segundosRestantes / TIMEOUT_SEGUNDOS;

  const corTimer =
    segundosRestantes > 30 ? Colors.gold : segundosRestantes > 10 ? '#E07B00' : '#C0392B';

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerLabel}>Método de pagamento</Text>
              <Text style={styles.headerTitulo}>PIX</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{servico.statusPagamento}</Text>
            </View>
          </View>

          {/* TIMER */}
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>Tempo restante</Text>
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
            <Text style={styles.timerSub}>
              O QR Code expira automaticamente
            </Text>
          </View>

          {/* VALOR DESTAQUE */}
          <View style={styles.valorCard}>
            <Text style={styles.valorLabel}>Total a pagar</Text>
            <Text style={styles.valorTexto}>{valorFormatado}</Text>
            <View style={styles.divisorHorizontal} />
            <View style={styles.detalheRow}>
              <Text style={styles.detalheLabel}>Cliente</Text>
              <Text style={styles.detalheValor}>{servico.nomeCliente}</Text>
            </View>
            <View style={styles.detalheRow}>
              <Text style={styles.detalheLabel}>Barbeiro</Text>
              <Text style={styles.detalheValor}>{servico.nomeBarbeiro}</Text>
            </View>
            <View style={styles.detalheRow}>
              <Text style={styles.detalheLabel}>Serviço</Text>
              <Text style={styles.detalheValor}>{servico.servico}</Text>
            </View>
            {servico.produto ? (
              <View style={styles.detalheRow}>
                <Text style={styles.detalheLabel}>Produto</Text>
                <Text style={styles.detalheValor}>{servico.produto}</Text>
              </View>
            ) : null}
          </View>

          {/* QR CODE */}
          <View style={styles.qrSection}>
            <Text style={styles.qrInstrucao}>
              Abra o app do seu banco e escaneie
            </Text>
            {servico.pixImagemQrCode ? (
              <View style={styles.qrWrapper}>
                <View style={styles.qrBorder}>
                  <Image
                    source={{ uri: servico.pixImagemQrCode }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
                {/* Cantos dourados decorativos */}
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

          {/* COPIA E COLA */}
          {servico.pixQrCode ? (
            <View style={styles.copiaColaSection}>
              <Text style={styles.copiaColaLabel}>PIX COPIA E COLA</Text>
              <View style={styles.copiaColaBox}>
                <Text
                  style={styles.copiaColaTexto}
                  numberOfLines={2}
                  ellipsizeMode="middle"
                >
                  {servico.pixQrCode}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.botaoCopiar, copiado && styles.botaoCopiadoAtivo]}
                onPress={copiarCodigo}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoCopiarTexto}>
                  {copiado ? '✓  Código copiado!' : 'Copiar código PIX'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* INSTRUÇÃO */}
          <View style={styles.instrucaoBox}>
            <Text style={styles.instrucaoTexto}>
              Após o pagamento, o sistema será atualizado automaticamente. Se o
              tempo esgotar, você será redirecionado para o início.
            </Text>
          </View>

          {/* VOLTAR */}
          {onVoltar ? (
            <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
              <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
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
    padding: 24,
    paddingBottom: 48,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLabel: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitulo: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  badge: {
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: 'rgba(212,160,23,0.08)',
  },
  badgeTexto: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // TIMER
  timerCard: {
    backgroundColor: Colors.safe,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.2)',
  },
  timerLabel: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  timerValor: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 14,
  },
  timerBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  timerSub: {
    color: '#555',
    fontSize: 11,
  },

  // VALOR CARD
  valorCard: {
    backgroundColor: Colors.safe,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  valorLabel: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valorTexto: {
    color: Colors.gold,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 16,
  },
  divisorHorizontal: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 14,
  },
  detalheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detalheLabel: {
    color: '#555',
    fontSize: 13,
  },
  detalheValor: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },

  // QR CODE
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrInstrucao: {
    color: '#666',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.3,
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

  // Cantos dourados decorativos
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

  // COPIA E COLA
  copiaColaSection: {
    marginBottom: 20,
  },
  copiaColaLabel: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  copiaColaBox: {
    backgroundColor: Colors.safe,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  copiaColaTexto: {
    color: '#555',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 17,
  },
  botaoCopiar: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botaoCopiadoAtivo: {
    backgroundColor: Colors.goldDark,
  },
  botaoCopiarTexto: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // INSTRUÇÃO
  instrucaoBox: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
    paddingLeft: 14,
    marginBottom: 28,
  },
  instrucaoTexto: {
    color: '#555',
    fontSize: 12,
    lineHeight: 19,
  },

  // VOLTAR
  botaoVoltar: {
    alignItems: 'center',
    padding: 12,
  },
  botaoVoltarTexto: {
    color: '#444',
    fontSize: 14,
  },
});