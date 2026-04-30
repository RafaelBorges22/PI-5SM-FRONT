import React, { useState, useRef } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { CornerAccent } from "../../components/CornerAccent";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginUser } from "../../service/AuthService";
import { useAuth } from "../../context/AuthContext";

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
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />

          <KeyboardAvoidingView
            style={styles.keyboardAvoiding}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.content}>
              <View style={styles.formArea}>
                <Text style={styles.title}>Entrar</Text>
                <Text style={styles.subtitle}>Acesse com suas credenciais</Text>

                {/* Campo: Usuário */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Usuário</Text>
                  <Animated.View
                    style={[styles.inputWrapper, { borderColor: userBorderColor }]}
                  >
                    <TextInput
                      style={styles.input}
                      value={userName}
                      onChangeText={setUserName}
                      onFocus={() => animateBorder(userBorderAnim, true)}
                      onBlur={() => animateBorder(userBorderAnim, false)}
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      placeholder="Digite seu usuário"
                    />
                  </Animated.View>
                </View>

                {/* Campo: Senha */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <Animated.View
                    style={[styles.inputWrapper, { borderColor: passBorderColor }]}
                  >
                    <TextInput
                      style={styles.input}
                      value={senha}
                      onChangeText={setSenha}
                      onFocus={() => animateBorder(passBorderAnim, true)}
                      onBlur={() => animateBorder(passBorderAnim, false)}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.safe,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  formArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.gold,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  fieldGroup: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
    letterSpacing: 0.4,
    paddingLeft: 4,
  },
  inputWrapper: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gold,
    minHeight: 44,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    width: "100%",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: 0.5,
  },
});