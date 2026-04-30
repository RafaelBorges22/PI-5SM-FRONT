import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef, useEffect } from 'react';
import { Linking } from 'react-native';

import WelcomeScreen from './src/screens/Home/HomeScreen';
import SelectBarberScreen from './src/screens/Barbeiros/SelectBarberScreen';
import SelectItemsScreen from './src/screens/Itens/SelectItensScreen';
import DigiteSeuNome from './src/screens/DigiteSeuNome/DigiteSeuNome';
import PaymentScreen from './src/screens/Pagamento/PaymentScreen';
import PaymentSuccessScreen from './src/screens/Pagamento/PaymentSuccessScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';

import { parseInfinitePayResult } from './src/utils/parseInfinitePayResult';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { token, isLoading } = useAuth();

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    if (!url.includes('tap_result')) return;

    const result = parseInfinitePayResult(url);

    if (result?.nsu) {
      navigationRef.current?.navigate('PaymentSuccess' as never);
    }
  };

  // Enquanto verifica token salvo
  if (isLoading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={WelcomeScreen} />
            <Stack.Screen name="SelectBarber" component={SelectBarberScreen} />
            <Stack.Screen name="SelectItems" component={SelectItemsScreen} />
            <Stack.Screen name="DigiteSeuNome" component={DigiteSeuNome} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen
              name="PaymentSuccess"
              component={PaymentSuccessScreen}
              options={{ gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}