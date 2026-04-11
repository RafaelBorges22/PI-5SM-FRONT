// src/hooks/useInfinitePayListener.ts
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { parseInfinitePayResult, InfinitePayResult } from '../utils/parseInfinitePayResult';

export const useInfinitePayListener = (
  onSuccess: (result: InfinitePayResult) => void,
  onError?: (url: string) => void
) => {
  useEffect(() => {
    const handleUrl = (url: string) => {
      if (!url.includes('tap_result')) return;

      const result = parseInfinitePayResult(url);

      if (result && result.nsu) {
        onSuccess(result);
      } else {
        onError?.(url);
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    // Caso o app tenha sido aberto pelo deep link (estava fechado)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, []);
};