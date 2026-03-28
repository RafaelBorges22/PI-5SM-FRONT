import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../../../assets/constants/Colors';

interface BarberCardProps {
  name: string;
  role?: string;
  index: number;
  photo?: ImageSourcePropType;
  onPress: () => void;
}

export function BarberCard({ name, role = 'Barbeiro', index, photo, onPress }: BarberCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      Animated.timing(glowOpacity, { toValue: 0.6, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const cardNumber = String(index + 1).padStart(2, '0');

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Animated.View style={[styles.neonGlow, { opacity: glowOpacity }]} />
      <View style={styles.borderFrame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
        >
          <View style={styles.innerHighlight} />
          <Text style={styles.number}>{cardNumber}</Text>
          <View style={styles.imageSlot}>
            {photo ? (
              <Image source={photo} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <View style={styles.placeholderIcon}>
                  <View style={styles.phHead} />
                  <View style={styles.phBody} />
                </View>
                <Text style={styles.placeholderLabel}>foto</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  neonGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 18,
  },
  borderFrame: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: Colors.white,
    zIndex: 10,
  },
  cornerTL: { top: -1, left: -1, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderTopLeftRadius: 14 },
  cornerTR: { top: -1, right: -1, borderTopWidth: 1.5, borderRightWidth: 1.5, borderTopRightRadius: 14 },
  cornerBL: { bottom: -1, left: -1, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderBottomLeftRadius: 14 },
  cornerBR: { bottom: -1, right: -1, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderBottomRightRadius: 14 },
  card: {
    backgroundColor: '#222222',
    borderRadius: 13,
    padding: 12,
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '40%',
    backgroundColor: 'rgba(212, 160, 23, 0.05)',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  number: {
    alignSelf: 'flex-start',
    color: 'rgba(212, 160, 23, 0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  imageSlot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
    borderStyle: 'dashed',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderIcon: {
    alignItems: 'center',
    opacity: 0.25,
  },
  phHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.gold,
  },
  phBody: {
    width: 28,
    height: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: Colors.gold,
    marginTop: 2,
  },
  placeholderLabel: {
    color: 'rgba(212, 160, 23, 0.3)',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  name: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 160, 23, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  role: {
    color: 'rgba(200, 148, 26, 0.7)',
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: -4,
  },
});