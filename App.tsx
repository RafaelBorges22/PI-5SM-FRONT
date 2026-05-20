import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Linking, Platform } from "react-native";

import { CornerAccent } from "./src/components/CornerAccent";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import SelectBarberScreen from "./src/screens/Barbeiros/SelectBarberScreen";
import DigiteSeuNome from "./src/screens/DigiteSeuNome/DigiteSeuNome";
import WelcomeScreen from "./src/screens/Home/HomeScreen";
import SelectItemsScreen from "./src/screens/Itens/SelectItensScreen";
import PaymentScreen from "./src/screens/Pagamento/PaymentScreen";
import PaymentSuccessScreen from "./src/screens/Pagamento/PaymentSuccessScreen";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { parseInfinitePayResult } from "./src/utils/parseInfinitePayResult";

const Stack = createNativeStackNavigator();

function AppRoutes({
  onRouteChange,
}: {
  onRouteChange?: (routeName?: string) => void;
}) {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { token, isLoading } = useAuth();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    if (!url.includes("tap_result")) return;

    const result = parseInfinitePayResult(url);

    if (result?.nsu) {
      navigationRef.current?.navigate("PaymentSuccess" as never);
    }
  };

  // Enquanto verifica token salvo
  if (isLoading) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() =>
        onRouteChange?.(navigationRef.current?.getCurrentRoute()?.name)
      }
    >
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = () => setKeyboardVisible(true);
    const onHide = () => setKeyboardVisible(false);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  return (
    <AuthProvider>
      <AppRoutes onRouteChange={setCurrentRoute} />

      {/* Global corners so they are not affected by per-screen keyboard resizing */}
      {!keyboardVisible && currentRoute !== "SelectItems" && (
        <>
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />
        </>
      )}
    </AuthProvider>
  );
}
