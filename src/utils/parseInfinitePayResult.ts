// src/utils/parseInfinitePayResult.ts

export interface InfinitePayResult {
  orderId: string;
  nsu: string;
  aut: string;
  cardBrand: string;
  userId: string;
  accessId: string;
  handle: string;
  merchantDocument: string;
}

export const parseInfinitePayResult = (url: string): InfinitePayResult | null => {
  try {
    // A URL chega como: projectdsm5sm://tap_result?order_id=...&nsu=...
    const queryString = url.split('?')[1];
    if (!queryString) return null;

    const params = Object.fromEntries(
      queryString.split('&').map((param) => {
        const [key, value] = param.split('=');
        return [key, decodeURIComponent(value)];
      })
    );

    return {
      orderId: params['order_id'],
      nsu: params['nsu'],
      aut: params['aut'],
      cardBrand: params['card_brand'],
      userId: params['user_id'],
      accessId: params['access_id'],
      handle: params['handle'],
      merchantDocument: params['merchant_document'],
    };
  } catch (error) {
    console.error('Erro ao parsear resultado do InfinitePay:', error);
    return null;
  }
};