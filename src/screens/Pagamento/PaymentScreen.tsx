import React, { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../assets/constants/Colors';
import { CornerAccent } from '../../components/CornerAccent';

import { PaymentMethodsList } from './components/PaymentMethodList';
import { TotalBox } from './components/TotalBox';

// ─── Types ─────────────────────────────

type RootStackParamList = {
  Payment: { totalPrice: number };
  Confirmation: undefined;
};

// ─── Screen ────────────────────────────

export default function PaymentScreen() {
  // ✅ Hooks SEMPRE AQUI DENTRO
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, 'Payment'>>();

  const totalPrice = route.params?.totalPrice ?? 0;

  const [selected, setSelected] = useState<string | null>(null);

  const PAYMENT_METHODS = [
    { id: 'pix', label: 'PIX', icon: '💠' },
    { id: 'cash', label: 'Dinheiro', icon: '💵' },
    { id: 'debit', label: 'Cartão de Débito', icon: '💳' },
    { id: 'credit', label: 'Cartão de Crédito', icon: '💳' },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />

      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require('../../assets/img/Background.jpg')}
          style={styles.container}
        >
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />

          <View style={styles.content}>
            <Text style={styles.title}>
              Selecione a forma{'\n'}de pagamento
            </Text>

            <PaymentMethodsList
              methods={PAYMENT_METHODS}
              selected={selected}
              onSelect={setSelected}
            />

            <View style={{ flex: 1 }} />

            <TotalBox total={totalPrice} />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

// ─── Styles ────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.safe },

  container: { flex: 1 },

  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});