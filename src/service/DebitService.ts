// src/services/payWithDebit.ts
import { startPayment } from './InfinitePayService';

export const payWithDebit = async (
  amount: number,
  orderId: string
): Promise<void> => {
  await startPayment({
    amount,
    orderId,
    resultUrl: 'projectdsm5sm://tap_result',
    paymentMethod: 'debit',
  });
};