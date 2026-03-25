import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { CornerAccent } from "./components/CornerAccent";
import { Logo } from "./components/Logo";
import { StartButton } from "./components/StartButton";
import { WelcomeText } from "./components/TextPrincipal";

export default function WelcomeScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require("../../assets/Background.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />
          <View style={styles.content}>
            <Logo />
            <WelcomeText />
            <StartButton onPress={() => console.log("Iniciar atendimento")} />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 32,
  },
});
