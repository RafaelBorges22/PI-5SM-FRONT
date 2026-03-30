import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { Colors } from '../../../assets/constants/Colors';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  index: number;
  selected: boolean;
  qty: number;
  onPress: () => void;
}

export function ItemCard({ item, index, selected, qty, onPress }: ItemCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(selected ? 1 : 0.6)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      Animated.timing(glowOpacity, { toValue: selected ? 1 : 0.6, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const cardNumber = String(index + 1).padStart(2, '0');

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      {/* Neon glow ring — brighter when selected */}
      <Animated.View
        style={[
          styles.neonGlow,
          selected && styles.neonGlowSelected,
          { opacity: glowOpacity },
        ]}
      />

      <View style={[styles.borderFrame, selected && styles.borderFrameSelected]}>
        {/* Corner accents */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        <TouchableOpacity
          style={[styles.card, selected && styles.cardSelected]}
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
        >
          <View style={[styles.innerHighlight, selected && styles.innerHighlightSelected]} />

          {/* Index number */}
          <Text style={styles.number}>{cardNumber}</Text>

          {/* Selected checkmark badge */}
          {qty > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓</Text>
            </View>
          )}

          {/* Icon slot — mirrors BarberCard imageSlot */}
          <View style={[styles.iconSlot, selected && styles.iconSlotSelected]}>
            <Text style={[styles.categoryIcon, selected && styles.categoryIconSelected]}>
              {item.icon ?? '✂️'}
            </Text>
          </View>

          {/* Name */}
          <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Price — plays the role of "role" in BarberCard */}
          <Text style={[styles.price, selected && styles.priceSelected]}>
            R$ {item.price}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: 0,
  },

  // ── Neon glow ──────────────────────────────────────────────
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
  neonGlowSelected: {
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 24,
  },

  // ── Border frame ───────────────────────────────────────────
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
  borderFrameSelected: {
    shadowOpacity: 1,
    shadowRadius: 14,
  },

  // ── White corner accents ───────────────────────────────────
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

  // ── Card body ──────────────────────────────────────────────
  card: {
    backgroundColor: '#222222',
    borderRadius: 13,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: '#1c1600',
  },

  // ── Inner top highlight ────────────────────────────────────
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(212, 160, 23, 0.05)',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  innerHighlightSelected: {
    backgroundColor: 'rgba(212, 160, 23, 0.12)',
  },

  // ── Index number ───────────────────────────────────────────
  number: {
    alignSelf: 'flex-start',
    color: 'rgba(212, 160, 23, 0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ── Selected badge ─────────────────────────────────────────
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: '900',
  },

  // ── Icon slot (mirrors BarberCard imageSlot) ───────────────
  iconSlot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlotSelected: {
    borderColor: 'rgba(212, 160, 23, 0.7)',
    borderStyle: 'solid',
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
  },
  categoryIcon: {
    fontSize: 32,
    opacity: 0.5,
  },
  categoryIconSelected: {
    opacity: 1,
  },

  // ── Name ───────────────────────────────────────────────────
  name: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 160, 23, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  nameSelected: {
    color: Colors.gold,
    textShadowRadius: 10,
  },

  // ── Price (mirrors BarberCard "role") ──────────────────────
  price: {
    color: 'rgba(200, 148, 26, 0.7)',
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: -4,
    fontWeight: '700',
  },
  priceSelected: {
    color: Colors.gold,
  },
});