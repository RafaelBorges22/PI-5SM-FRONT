import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaymentRow } from './PaymentRow';

export function PaymentMethodsList({
  methods,
  selected,
  onSelect,
}: any) {
  return (
    <View style={styles.methods}>
      {methods.map((method: any) => (
        <PaymentRow
          key={method.id}
          method={method}
          selected={selected === method.id}
          onPress={() => onSelect(method.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  methods: {
    gap: 12,
  },
});