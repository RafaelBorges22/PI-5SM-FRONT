import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function WelcomeText() {
  return <Text style={styles.text}>Seja bem-vindo!</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});