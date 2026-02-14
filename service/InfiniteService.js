// src/services/InfinitePayService.js

import { Linking } from 'react-native';
import { buildInfinitePayUrl } from '../utils/DeepLinkBuilder';

export const startPayment = async (paymentData) => {
  try {
    const url = buildInfinitePayUrl(paymentData);
    await Linking.openURL(url);
  } catch (error) {
    console.log('Erro ao abrir InfinitePay:', error);
  }
};
