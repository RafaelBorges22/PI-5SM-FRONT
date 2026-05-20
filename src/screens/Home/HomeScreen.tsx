import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
    Image,
    ImageBackground,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/constants/Colors";
import styles from "./Styles";

type RootStackParamList = {
  Home: undefined;
  SelectBarber: undefined;
};

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require("../../assets/img/Background.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <Image
              source={require("../../assets/img/Logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.wordmark}>BARBER</Text>

            <Text style={styles.welcomeText}>Seja bem-vindo!</Text>

            <TouchableOpacity
              style={styles.startWrapper}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("SelectBarber")}
            >
              <View style={styles.startHighlight} />
              <Text style={styles.startLabel}>INICIAR ATENDIMENTO</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
