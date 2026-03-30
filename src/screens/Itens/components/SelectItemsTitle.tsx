import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function SelectItemsTitle() {
  return <Text style={styles.text}>Selecione seus itens:</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});