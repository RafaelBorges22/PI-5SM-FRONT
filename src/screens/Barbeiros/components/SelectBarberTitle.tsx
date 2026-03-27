import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../../assets/constants/Colors';

export function SelectBarberTitle() {
  return (
    <Text style={styles.text}>
      {'Selecione por qual\nbarbeiro foi atendido:'}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});