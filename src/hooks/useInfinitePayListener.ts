import { useEffect } from 'react';
import { Linking } from 'react-native';
import { parseInfinitePayResult, InfinitePayResult } from '../utils/parseInfinitePayResult';

export const useInfinitePayListener = (
  onSuccess: (result: InfinitePayResult) => void,
  onError?: (url: string) => void
) => {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      const url = event.url;
      if (!url.includes('tap_result')) return;

      const result = parseInfinitePayResult(url);
      if (result?.nsu) {
        onSuccess(result);
      } else {
        onError?.(url);
      }
    });

    return () => subscription.remove();
  }, []);

  return { markPaymentStarted: () => {} };
};