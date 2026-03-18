import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';


export function Logo() {
  const [fontsLoaded] = useFonts({
    'InclusiveSans': require('../assets/font/InclusiveSans/static/InclusiveSans-Regular.ttf'),
  });
  return (
    <View style={styles.container}>
      <View style={styles.glow}>
        <Image
          source={require('../assets/Logo.png')}
          style={{ width: 320, height: 320 }}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.wordmark, fontsLoaded && { fontFamily: 'InclusiveSans' }]}>
        BARBER
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 0,
  },
  glow: {
    shadowColor: '#D4A017',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  wordmark: {
    color: '#C8941A',
    fontSize: 25,
    fontWeight: '600',
    letterSpacing: 6,
  },
});