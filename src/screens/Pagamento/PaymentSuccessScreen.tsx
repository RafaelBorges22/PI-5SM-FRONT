// screens/PaymentSuccessScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../assets/constants/Colors';

type RootStackParamList = {
  Home: undefined;
};

export default function PaymentSuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
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
            <Text style={styles.titulo}>Pagamento{'\n'}Aprovado!</Text>
            <Text style={styles.subtitulo}>
              A transação foi concluída com sucesso.
            </Text>

            <View style={styles.divisor} />

            <Text style={styles.mensagem}>
              O atendimento foi registrado e o cliente pode ser liberado.
            </Text>
          </Animated.View>

          {/* Botão */}
          <Animated.View style={[styles.botaoWrapper, { opacity: opacityAnim }]}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },

  // Ícone
  iconWrapper: {
    marginBottom: 40,
  },
  iconCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(212,160,23,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCheck: {
    fontSize: 40,
    color: Colors.black,
    fontWeight: '800',
  },

  // Textos
  textBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titulo: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitulo: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  divisor: {
    width: 40,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
    marginVertical: 24,
  },
  mensagem: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 260,
  },

  // Botão
  botaoWrapper: {
    width: '100%',
  },
  botao: {
    backgroundColor: Colors.gold,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  botaoTexto: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});