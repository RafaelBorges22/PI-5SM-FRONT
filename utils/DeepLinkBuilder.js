export interface PaymentParams {
  amount: number;
  orderId: string;
  resultUrl: string;
  paymentMethod: "credit" | "debit";
  installments?: number;
}

export const buildInfinitePayUrl = ({
  amount,
  orderId,
  resultUrl,
  paymentMethod,
  installments
}: PaymentParams) => {

  let url = `infinitepaydash://infinitetap-app?amount=${amount}&order_id=${orderId}&payment_method=${paymentMethod}&result_url=${encodeURIComponent(resultUrl)}`;

  if (paymentMethod === "credit" && installments) {
    url += `&installments=${installments}`;
  }

  return url;
};
