import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform, StyleSheet, View } from 'react-native';
import { Colors } from '../assets/constants/Colors';

type Position = 'topRight' | 'bottomLeft';

interface CornerAccentProps {
  position: Position;
}

export function CornerAccent({ position }: CornerAccentProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isTopRight = position === 'topRight';

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => setKeyboardHeight(event.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.base,
        isTopRight ? styles.topRight : styles.bottomLeft,
        !isTopRight && { bottom: keyboardHeight },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    width: 64,
    height: 64,
    backgroundColor: Colors.gold,
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