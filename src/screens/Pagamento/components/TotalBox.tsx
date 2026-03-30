import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  total: number;
};

export function TotalBox({ total }: Props) {
  const formatted = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>Total: </Text>
        {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#D4A017',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D4A017'
  },

  label: {
    color: '#D4A017',
  },
});