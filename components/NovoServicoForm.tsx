// components/NovoServicoForm.tsx
// Após submit, exibe automaticamente a tela de QR Code PIX

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useCriarServico } from '../hooks/UseServico';
import { CriarServicoRequest, MetodoPagamento, StatusPagamento, ServicoResponse } from '../types/Servico';
import PixQrCodeScreen from '../screen/PixQRCodeScreen';

export default function NovoServicoForm() {
  const { criarServico, loading, error } = useCriarServico();
  const [resultado, setResultado] = useState<ServicoResponse | null>(null);

  const [form, setForm] = useState<CriarServicoRequest>({
    data: {
      dataServico: new Date().toISOString().split('T')[0],
      nomeCliente: '',
      valor: '',
      nomeBarbeiro: '',
      statusPagamento: 'PENDENTE' as StatusPagamento,
      metodoPagamento: 'PIX' as MetodoPagamento,
      produto: '',
      servico: '',
    },
    pix: {
      chave: '31b007ea-f1f0-48be-a72d-67ed74ddd8d2',
      valor: '',
    },
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    const response = await criarServico(form);
    if (response) {
      setResultado(response as ServicoResponse);
    }
  };

  // Se já temos a resposta, mostra a tela de PIX
  if (resultado) {
    return (
      <PixQrCodeScreen
        servico={resultado}
        onVoltar={() => setResultado(null)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Serviço</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nome do cliente"
        value={form.data.nomeCliente}
        onChangeText={(v) => handleChange('nomeCliente', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do barbeiro"
        value={form.data.nomeBarbeiro}
        onChangeText={(v) => handleChange('nomeBarbeiro', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Serviço (ex: Corte + Barba)"
        value={form.data.servico}
        onChangeText={(v) => handleChange('servico', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Produto (ex: Pomada Modeladora)"
        value={form.data.produto}
        onChangeText={(v) => handleChange('produto', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 50.00)"
        value={form.data.valor}
        keyboardType="decimal-pad"
        onChangeText={(v) => handleChange('valor', v)}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Gerar PIX</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00b37e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#e53e3e', fontSize: 14, textAlign: 'center' },
});