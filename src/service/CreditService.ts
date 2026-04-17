// src/services/payWithCredit.ts
import { startPayment } from './InfinitePayService';

export const payWithCredit = async (
  amount: number,
  orderId: string,
  installments: number
): Promise<void> => {
  await startPayment({
    amount,
    orderId,
    resultUrl: 'projectdsm5sm://tap_result',
    paymentMethod: 'credit',
    installments,
  });
};