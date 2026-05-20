// service/Api.ts

import Constants from "expo-constants";
import { Platform } from "react-native";

const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const API_URL =
  ((Constants.expoConfig?.extra?.apiUrl as string) ??
    `http://${defaultHost}:8080`) + "/api";

export { API_URL };

