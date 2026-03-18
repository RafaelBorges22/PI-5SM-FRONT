import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import { CornerAccent } from '../../components/CornerAccent';
import { Logo } from '../../components/Logo';
import { WelcomeText } from '../../components/TextPrincipal';
import { StartButton } from '../../components/StartButton';
import { Colors } from '../../constants/Colors';

export default function WelcomeScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require('../../assets/Background.jpg')}
          style={styles.container}
          resizeMode="cover"
        >
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />
          <View style={styles.content}>
            <Logo />
            <WelcomeText />
            <StartButton onPress={() => console.log('Iniciar atendimento')} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 32,
  },
});