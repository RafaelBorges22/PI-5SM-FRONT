import React from 'react';
import { View, StyleSheet } from 'react-native';

type Position = 'topRight' | 'bottomLeft';

interface CornerAccentProps {
  position: Position;
}

export function CornerAccent({ position }: CornerAccentProps) {
  const isTopRight = position === 'topRight';
  return (
    <View
      style={[
        styles.base,
        isTopRight ? styles.topRight : styles.bottomLeft,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    width: 64,
    height: 64,
    backgroundColor: '#D4A017',
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomLeftRadius: 64,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopRightRadius: 64,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});