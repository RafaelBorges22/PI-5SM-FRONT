import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CancelButton } from '../../../components/BtnCancelar';

export function PaymentHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topRow}>
      <CancelButton onPress={onBack} />

      <View style={styles.logoMark}>
        <Text style={styles.logoIcon}>⬆</Text>
        <Text style={styles.logoText}>BARBER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoMark: { alignItems: 'center' },
  logoIcon: { color: '#D4A017', fontSize: 20 },
  logoText: {
    color: '#D4A017',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
});