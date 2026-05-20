import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { BackButton } from "../../components/BtnVoltar";
import styles from "./Styles";

type RootStackParamList = {
  EnterName: {
    valor: number;
    nomeBarbeiro: string;
    servico: string;
    produto: string;
    nomeCliente: string;
  };
  Payment: {
    valor: number;
    nomeBarbeiro: string;
    servico: string;
    produto: string;
    nomeCliente: string;
  };
  SelectBarber: undefined;
  SelectItems: undefined;
};

export default function DigiteSeuNome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const nameInputRef = useRef<TextInput | null>(null);
  const lastFocusedRef = useRef<boolean>(false);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active" && lastFocusedRef.current) {
        setTimeout(() => nameInputRef.current?.focus(), 120);
      }
    });
    return () => sub.remove();
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.background, Colors.gold],
  });

  const canContinue = name.trim().length > 0;

  const route = useRoute<RouteProp<RootStackParamList, "EnterName">>();
  const { valor, nomeBarbeiro, servico, produto } = route.params;

  const handleConfirm = () => {
    if (canContinue) {
      navigation.navigate("Payment", {
        valor,
        nomeBarbeiro,
        servico,
        produto,
        nomeCliente: name,
      });
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
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <BackButton compact onPress={() => navigation.goBack()} />
              </View>

              <View style={styles.formArea}>
                <Text style={styles.label}>Digite seu nome:</Text>

                <Animated.View style={[styles.inputWrapper, { borderColor }]}>
                  <TextInput
                    ref={nameInputRef}
                    style={styles.input}
                    value={name}
                    onChangeText={(text) =>
                      setName(text.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
                    }
                    onFocus={() => {
                      lastFocusedRef.current = true;
                      handleFocus();
                    }}
                    onBlur={() => {
                      lastFocusedRef.current = false;
                      handleBlur();
                    }}
                    autoFocus
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleConfirm}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                </Animated.View>

                {canContinue && (
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
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

// styles are in src/screens/DigiteSeuNome/Styles.tsx
