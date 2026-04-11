// service/Api.ts

import Constants from 'expo-constants';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string ?? 'http://localhost:8080') + '/api';

export { API_URL };