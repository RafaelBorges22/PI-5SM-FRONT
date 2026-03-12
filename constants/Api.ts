const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;