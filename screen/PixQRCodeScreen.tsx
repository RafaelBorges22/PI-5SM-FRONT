// components/PixQrCodeScreen.tsx
// Exibe o QR Code PIX retornado pela API após criar o serviço

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { ServicoResponse } from '../types/Servico';

interface Props {
  servico: ServicoResponse;
  onVoltar?: () => void;
}

export default function PixQrCodeScreen({ servico, onVoltar }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    if (!servico.pixQrCode) return;
    Clipboard.setString(servico.pixQrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(servico.valor);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Pagamento PIX</Text>
        <View style={styles.badgePendente}>
          <Text style={styles.badgeTexto}>{servico.statusPagamento}</Text>
        </View>
      </View>

      {/* Card resumo */}
      <View style={styles.card}>
        <Row label="Cliente" valor={servico.nomeCliente} />
        <Row label="Serviço" valor={servico.servico} />
        {servico.produto && <Row label="Produto" valor={servico.produto} />}
        <Row label="Barbeiro" valor={servico.nomeBarbeiro} />
        <View style={styles.divisor} />
        <Row label="Total" valor={valorFormatado} destaque />
      </View>

      {/* QR Code Image */}
      {servico.pixImagemQrCode ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Escaneie com o app do seu banco</Text>
          <View style={styles.qrBorder}>
            <Image
              source={{ uri: servico.pixImagemQrCode }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </View>
      ) : (
        <View style={styles.qrContainer}>
          <ActivityIndicator size="large" color="#00b37e" />
          <Text style={styles.qrLabel}>Carregando QR Code...</Text>
        </View>
      )}

      {/* Copia e Cola */}
      {servico.pixQrCode && (
        <View style={styles.copiaColaContainer}>
          <Text style={styles.copiaColaLabel}>PIX Copia e Cola</Text>
          <View style={styles.copiaColaBox}>
            <Text style={styles.copiaColaTexto} numberOfLines={2} ellipsizeMode="middle">
              {servico.pixQrCode}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.botaoCopiar, copiado && styles.botaoCopiadoAtivo]}
            onPress={copiarCodigo}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoCopiarTexto}>
              {copiado ? '✓ Código copiado!' : 'Copiar código PIX'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instrução */}
      <View style={styles.instrucao}>
        <Text style={styles.instrucaoTexto}>
          O pagamento será confirmado automaticamente após a transferência.
        </Text>
      </View>

      {/* Botão voltar */}
      {onVoltar && (
        <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
          <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// Subcomponente linha de detalhe
function Row({
  label,
  valor,
  destaque = false,
}: {
  label: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValor, destaque && styles.rowValorDestaque]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#0f0f0f',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f5f5f5',
    letterSpacing: 0.3,
  },
  badgePendente: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTexto: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Card resumo
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowLabel: {
    color: '#888',
    fontSize: 13,
  },
  rowValor: {
    color: '#e5e5e5',
    fontSize: 13,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  rowValorDestaque: {
    color: '#00b37e',
    fontSize: 16,
    fontWeight: '700',
  },
  divisor: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 10,
  },

  // QR Code
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrBorder: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#00b37e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  qrImage: {
    width: 220,
    height: 220,
  },

  // Copia e Cola
  copiaColaContainer: {
    marginBottom: 24,
  },
  copiaColaLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  copiaColaBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 12,
  },
  copiaColaTexto: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  botaoCopiar: {
    backgroundColor: '#00b37e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  botaoCopiadoAtivo: {
    backgroundColor: '#059669',
  },
  botaoCopiarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // Instrução
  instrucao: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#00b37e',
    marginBottom: 24,
  },
  instrucaoTexto: {
    color: '#888',
    fontSize: 13,
    lineHeight: 19,
  },

  // Voltar
  botaoVoltar: {
    alignItems: 'center',
    padding: 12,
  },
  botaoVoltarTexto: {
    color: '#555',
    fontSize: 14,
  },
});