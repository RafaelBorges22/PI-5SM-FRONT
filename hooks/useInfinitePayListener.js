// src/hooks/useInfinitePayListener.js

import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useInfinitePayListener = (callback) => {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      callback(event.url);
    });

    return () => subscription.remove();
  }, []);
};
