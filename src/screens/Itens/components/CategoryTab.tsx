import React, { useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../../assets/constants/Colors";
import { FontSizes } from "../../../assets/constants/Fonts";
import { Category } from "../Types";

interface CategoryTabProps {
  label: Category;
  icon: string;
  active: boolean;
  onPress: () => void;
}

export function CategoryTab({
  label,
  icon,
  active,
  onPress,
}: CategoryTabProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale }] },
        active && styles.wrapperActive,
      ]}
    >
      <TouchableOpacity
        style={[styles.tab, active && styles.tabActive]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
      >
        <View style={styles.highlight} />
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, active && styles.labelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 96,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  wrapperActive: {
    shadowColor: "#D4A017",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: Colors.whiteSoft,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  icon: { fontSize: 20 },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.small,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelActive: { color: "#1a1a1a" },
});
