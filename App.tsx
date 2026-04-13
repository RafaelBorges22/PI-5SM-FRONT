import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef } from 'react';
import { Linking } from 'react-native';
import { useEffect } from 'react';
import WelcomeScreen from './src/screens/Home/HomeScreen';
import SelectBarberScreen from './src/screens/Barbeiros/SelectBarberScreen';
import SelectItemsScreen from './src/screens/Itens/SelectItensScreen';
import DigiteSeuNome from './src/screens/DigiteSeuNome/DigiteSeuNome';
import PaymentScreen from './src/screens/Pagamento/PaymentScreen';
import PaymentSuccessScreen from './src/screens/Pagamento/PaymentSuccessScreen';
import { parseInfinitePayResult } from './src/utils/parseInfinitePayResult';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Captura deep link quando app já está aberto
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Captura deep link quando app estava fechado
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    if (!url.includes('tap_result')) return;

    const result = parseInfinitePayResult(url);

    if (result?.nsu) {
      // Pagamento aprovado → navega para sucesso
      navigationRef.current?.navigate('PaymentSuccess' as never);
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home"           component={WelcomeScreen} />
        <Stack.Screen name="SelectBarber"   component={SelectBarberScreen} />
        <Stack.Screen name="SelectItems"    component={SelectItemsScreen} />
        <Stack.Screen name="DigiteSeuNome"  component={DigiteSeuNome} />
        <Stack.Screen name="Payment"        component={PaymentScreen} />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}