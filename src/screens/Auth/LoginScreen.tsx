import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    AppState,
    AppStateStatus,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../assets/constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../service/AuthService";
import styles from "./Styles";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();

  const [userName, setUserName] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const userInputRef = useRef<TextInput | null>(null);
  const passInputRef = useRef<TextInput | null>(null);
  const lastFocusedRef = useRef<"user" | "pass" | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active" && lastFocusedRef.current) {
          setTimeout(() => {
            if (lastFocusedRef.current === "user")
              userInputRef.current?.focus();
            if (lastFocusedRef.current === "pass")
              passInputRef.current?.focus();
          }, 120);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  const userBorderAnim = useRef(new Animated.Value(0)).current;
  const passBorderAnim = useRef(new Animated.Value(0)).current;

  const animateBorder = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const userBorderColor = userBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.background, Colors.gold],
  });

  const passBorderColor = passBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.background, Colors.gold],
  });

  const canLogin = userName.trim().length > 0 && senha.trim().length > 0;

  const handleLogin = async () => {
    if (!canLogin || loading) return;

    setLoading(true);
    try {
      const response = await loginUser({ userName: userName.trim(), senha });
      await signIn(response.token); // salva o token no AsyncStorage + Context
      // A navegação acontece automaticamente via App.tsx (token !== null → Home)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao realizar login.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />
      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require("../../assets/img/Background.jpg")}
          style={styles.container}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoiding}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.content}>
              <View style={styles.formArea}>
                <Text style={styles.title}>Entrar</Text>
                <Text style={styles.subtitle}>Acesse com suas credenciais</Text>

                {/* Campo: Usuário */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Usuário</Text>
                  <Animated.View
                    style={[
                      styles.inputWrapper,
                      { borderColor: userBorderColor },
                    ]}
                  >
                    <TextInput
                      ref={userInputRef}
                      style={styles.input}
                      value={userName}
                      onChangeText={setUserName}
                      onFocus={() => {
                        lastFocusedRef.current = "user";
                        animateBorder(userBorderAnim, true);
                      }}
                      onBlur={() => {
                        lastFocusedRef.current = null;
                        animateBorder(userBorderAnim, false);
                      }}
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => passInputRef.current?.focus()}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="Digite seu usuário"
                    />
                  </Animated.View>
                </View>

                {/* Campo: Senha */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <Animated.View
                    style={[
                      styles.inputWrapper,
                      { borderColor: passBorderColor },
                    ]}
                  >
                    <TextInput
                      ref={passInputRef}
                      style={styles.input}
                      value={senha}
                      onChangeText={setSenha}
                      onFocus={() => {
                        lastFocusedRef.current = "pass";
                        animateBorder(passBorderAnim, true);
                      }}
                      onBlur={() => {
                        lastFocusedRef.current = null;
                        animateBorder(passBorderAnim, false);
                      }}
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="Digite sua senha"
                    />
                  </Animated.View>
                </View>

                {canLogin && (
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      loading && styles.loginButtonDisabled,
                    ]}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.black} />
                    ) : (
                      <Text style={styles.loginButtonText}>Entrar</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
