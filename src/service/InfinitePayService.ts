// src/services/InfinitePayService.ts
import { Linking } from 'react-native';
import { buildInfinitePayUrl, PaymentParams } from '../utils/DeepLinkBuilder';

export const startPayment = async (paymentData: PaymentParams): Promise<void> => {
  const url = buildInfinitePayUrl(paymentData);
  console.log('Abrindo URL InfinitePay:', url);
  await Linking.openURL(url);
};