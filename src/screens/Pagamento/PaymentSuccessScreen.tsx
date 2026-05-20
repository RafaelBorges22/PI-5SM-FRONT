// screens/PaymentSuccessScreen.tsx

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/constants/Colors";
import styles from "./PaymentSuccessStyles";

type RootStackParamList = {
  Home: undefined;
};

export default function PaymentSuccessScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Ícone de sucesso animado */}
          <Animated.View
            style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}
          >
            <View style={styles.iconCircleOuter}>
              <View style={styles.iconCircleInner}>
                <Text style={styles.iconCheck}>✓</Text>
              </View>
            </View>
          </Animated.View>

          {/* Textos animados */}
          <Animated.View
            style={[
              styles.textBlock,
              { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.titulo}>Pagamento{"\n"}Aprovado!</Text>
            <Text style={styles.subtitulo}>
              A transação foi concluída com sucesso.
            </Text>

            <View style={styles.divisor} />

            <Text style={styles.mensagem}>
              O atendimento foi registrado e o cliente pode ser liberado.
            </Text>
          </Animated.View>

          {/* Botão */}
          <Animated.View
            style={[styles.botaoWrapper, { opacity: opacityAnim }]}
          >
            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: "Home" }] })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.botaoTexto}>Voltar ao início</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
}
