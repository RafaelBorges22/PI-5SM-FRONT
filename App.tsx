import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/Home/HomeScreen';
import SelectBarberScreen from './src/screens/Barbeiros/SelectBarberScreen';
import DigiteSeuNome from './src/screens/DigiteSeuNome/DigiteSeuNome';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={WelcomeScreen} />
        <Stack.Screen name="SelectBarber" component={SelectBarberScreen} />
        <Stack.Screen name="DigiteSeuNome" component={DigiteSeuNome}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}