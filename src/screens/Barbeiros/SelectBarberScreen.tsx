import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Colors } from "../../assets/constants/Colors";
import { CornerAccent } from "../../components/CornerAccent";
import { BarberCard } from "./components/BarberCard";
import { SelectBarberTitle } from "./components/SelectBarberTitle";
import { CancelButton } from "../../components/BtnCancelar";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const BARBERS = [
  { name: "William", photo: require("../../assets/img/Barbeiro.jpg") },
  { name: "Cleison", photo: require("../../assets/img/Barbeiro.jpg") },
  { name: "Bruno" },
  { name: "Leonardo" },
];

type RootStackParamList = {
  SelectItems: undefined;
  SelectBarber: undefined;
};

export default function SelectBarberScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

          <View style={styles.content}>
            <SelectBarberTitle />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: Math.ceil(BARBERS.length / 2) }).map((_, rowIndex) => {
                const left = BARBERS[rowIndex * 2];
                const right = BARBERS[rowIndex * 2 + 1];
                return (
                  <View key={rowIndex} style={styles.row}>
                    {left && (
                      <BarberCard
                        name={left.name}
                        index={rowIndex * 2}
                        photo={left.photo}
                        onPress={() => navigation.navigate('SelectItems')}
                      />
                    )}
                    {right ? (
                      <BarberCard
                        name={right.name}
                        index={rowIndex * 2 + 1}
                        photo={right.photo}
                        onPress={() => navigation.navigate('SelectItems')}
                      />
                    ) : (
                      <View style={styles.emptySlot} />
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <CancelButton onPress={() => navigation.goBack()} />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.safe },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 28, gap: 24 },
  scroll: { flex: 1 },
  scrollContent: { gap: 14, paddingVertical: 4 },
  row: { flexDirection: 'row', gap: 14 },
  emptySlot: { flex: 1 },
});