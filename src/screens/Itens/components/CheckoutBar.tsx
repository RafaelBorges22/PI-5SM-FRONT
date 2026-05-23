import React, { useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../../assets/constants/Colors";
import { FontSizes, FontWeights } from "../../../assets/constants/Fonts";

interface CheckoutBarProps {
  totalItems: number;
  totalPrice: number;
  onCart: () => void;
  onFinish: () => void;
}

export function CheckoutBar({
  totalItems,
  totalPrice,
  onCart,
  onFinish,
}: CheckoutBarProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

  return (
    <View style={styles.bar}>
      {/* Cart button */}
      <TouchableOpacity
        style={styles.cartBtn}
        onPress={onCart}
        activeOpacity={0.8}
      >
        <Text style={styles.cartIcon}>🛒</Text>
        {totalItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
        )}
        <Text style={styles.cartLabel}>Ver itens</Text>
      </TouchableOpacity>

      {/* Finish button */}
      <Animated.View style={[styles.finishWrapper, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={onFinish}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
        >
          <View style={styles.finishHighlight} />
          <Text style={styles.finishLabel}>FINALIZAR COMPRA</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
bar: {
    position: "absolute",
    bottom: 0,            
    left: 0,              
    right: 0,             
    backgroundColor: Colors.black, 
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 12,
    paddingBottom: 24,    
    paddingHorizontal: 16, 
    borderTopWidth: 1,
    borderTopColor: Colors.goldSoft,
  },
  cartBtn: {
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 4,
  },
  cartIcon: { fontSize: 28 },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.black,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.black,
  },
  cartLabel: {
    color: Colors.gray,
    fontSize: FontSizes.caption,
    marginTop: 2,
    fontWeight: FontWeights.semibold,
  },
  finishWrapper: {
    flex: 1,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  finishBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  finishHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  finishLabel: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
