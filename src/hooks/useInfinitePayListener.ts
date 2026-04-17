// src/hooks/useInfinitePayListener.ts
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { parseInfinitePayResult, InfinitePayResult } from '../utils/parseInfinitePayResult';

export const useInfinitePayListener = (
  onSuccess: (result: InfinitePayResult) => void,
  onError?: (url: string) => void
) => {
  useEffect(() => {
    // Guarda o momento em que o listener foi registrado
    const registeredAt = Date.now();

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

    // ✅ Só processa a initial URL se ela chegou DEPOIS do hook montar
    // Isso evita processar URLs residuais de sessões anteriores
    Linking.getInitialURL().then((url) => {
      if (url && Date.now() - registeredAt < 2000) {
        handleUrl(url);
      }
    });

    return () => subscription.remove();
  }, []);
};