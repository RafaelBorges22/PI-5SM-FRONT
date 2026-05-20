import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/constants/Colors";
import { BackButton } from "../../components/BtnVoltar";
import styles from "./Styles";

const BARBERS = [
  { name: "Ninguem", photo: require("../../assets/img/Berbeiro3.jpeg") },
  { name: "Fulano", photo: require("../../assets/img/Barbeiro4.jpg") },
  { name: "Deltrano", photo: require("../../assets/img/Barbeiro5.jpeg") },
  { name: "Dono", photo: require("../../assets/img/Barbeiro6.jpeg") },
];

type RootStackParamList = {
  SelectItems: {
    nomeBarbeiro: string;
  };
  SelectBarber: undefined;
};

function SelectBarberTitle() {
  return (
    <Text style={styles.title}>
      {"Selecione por qual\nbarbeiro foi atendido:"}
    </Text>
  );
}

function BarberCard({ name, role = "Barbeiro", index, photo, onPress }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const glowOpacity = React.useRef(new Animated.Value(0.6)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const cardNumber = String(index + 1).padStart(2, "0");

  return (
    <Animated.View style={{ height: "100%", transform: [{ scale }] }}>
      <Animated.View
        style={{
          position: "absolute",
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          borderRadius: 17,
          borderWidth: 1,
          borderColor: Colors.gold,
          shadowColor: Colors.gold,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 6,
          elevation: 18,
          opacity: glowOpacity,
        }}
      />
      <View
        style={{
          height: "100%",
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: Colors.gold,
          shadowColor: Colors.gold,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#222222",
            borderRadius: 13,
            padding: 10,
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
            justifyContent: "space-between",
          }}
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              backgroundColor: "rgba(212, 160, 23, 0.05)",
              borderTopLeftRadius: 13,
              borderTopRightRadius: 13,
            }}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "rgba(212, 160, 23, 0.5)",
              fontSize: 11,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            {cardNumber}
          </Text>
          <View
            style={{
              width: "100%",
              flex: 1,
              maxHeight: 100,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: Colors.black,
              borderWidth: 1,
              borderColor: "rgba(212, 160, 23, 0.2)",
              borderStyle: "dashed",
            }}
          >
            {photo ? (
              <Image
                source={photo}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <View style={{ alignItems: "center", opacity: 0.25 }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: Colors.gold,
                    }}
                  />
                  <View
                    style={{
                      width: 28,
                      height: 14,
                      borderTopLeftRadius: 14,
                      borderTopRightRadius: 14,
                      backgroundColor: Colors.gold,
                      marginTop: 2,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "rgba(212, 160, 23, 0.3)",
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  foto
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: Colors.white,
              fontSize: 14,
              fontWeight: "800",
              letterSpacing: 1.5,
              textAlign: "center",
              textShadowColor: "rgba(212, 160, 23, 0.35)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 6,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              color: "rgba(200, 148, 26, 0.7)",
              fontSize: 10,
              letterSpacing: 0.5,
              textAlign: "center",
              marginTop: -4,
            }}
          >
            {role}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function SelectBarberScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("");

  const handleSelectBarber = (nome: string) => {
    setBarbeiroSelecionado(nome);

    if (!nome) {
      Alert.alert("Erro", "Selecione um barbeiro");
      return;
    }

    navigation.navigate("SelectItems", {
      nomeBarbeiro: nome, // ✅ CORRETO
    });
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
          <View style={styles.content}>
            <SelectBarberTitle />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: Math.ceil(BARBERS.length / 2) }).map(
                (_, rowIndex) => {
                  const left = BARBERS[rowIndex * 2];
                  const right = BARBERS[rowIndex * 2 + 1];

                  return (
                    <View key={rowIndex} style={styles.row}>
                      {left && (
                        <View style={styles.columnItem}>
                          <BarberCard
                            name={left.name}
                            index={rowIndex * 2}
                            photo={left.photo}
                            onPress={() => handleSelectBarber(left.name)} // ✅ CORRETO
                          />
                        </View>
                      )}

                      {right ? (
                        <View style={styles.columnItem}>
                          <BarberCard
                            name={right.name}
                            index={rowIndex * 2 + 1}
                            photo={right.photo}
                            onPress={() => handleSelectBarber(right.name)} // ✅ CORRETO
                          />
                        </View>
                      ) : (
                        <View style={styles.emptySlot} />
                      )}
                    </View>
                  );
                },
              )}
            </ScrollView>

            <View style={styles.backButtonWrap}>
              <BackButton onPress={() => navigation.goBack()} />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
