import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@app:token";

interface AuthContextData {
  token: string | null;
  isLoading: boolean;       // true enquanto lê o AsyncStorage na inicialização
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura o token salvo quando o app abre
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((stored) => setToken(stored))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (newToken: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}