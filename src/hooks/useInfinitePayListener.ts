// src/hooks/useInfinitePayListener.ts
import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useInfinitePayListener = (callback: (url: string) => void) => {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      callback(event.url);
    });

    Linking.getInitialURL().then((url) => {
        if (url && url.includes("tap_result")) callback(url);
        });

    return () => subscription.remove();
  }, []);
};