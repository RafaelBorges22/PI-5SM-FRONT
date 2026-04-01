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
} from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { CornerAccent } from "../../components/CornerAccent";
import { CancelButton } from "../../components/BtnCancelar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute, RouteProp } from "@react-navigation/native";

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
  const route = useRoute<RouteProp<RootStackParamList, "EnterName">>();

 const {
  valor,
  nomeBarbeiro,
  servico,
  produto,
} = route.params;

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
              {/* Header with cancel */}
              <View style={styles.header}>
                  <CancelButton onPress={() => navigation.goBack()} />
              </View>

              {/* Main form area */}
              <View style={styles.formArea}>
                <Text style={styles.label}>Digite seu nome:</Text>

                <Animated.View
                  style={[styles.inputWrapper, { borderColor }]}
                >
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
  header: {
    alignItems: "flex-start",
    marginBottom: 0,
  },
  formArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: -60, // optical centering accounting for header
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    letterSpacing: 0.4,
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
    fontSize: 20,
    fontWeight: "600",
    color: Colors.gold,
    minHeight: 44,
  },
  confirmButton: {
    marginTop: 8,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: "center",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    letterSpacing: 0.5,
  },
});