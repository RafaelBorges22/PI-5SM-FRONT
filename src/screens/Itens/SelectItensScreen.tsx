import React, { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../assets/constants/Colors';
import { CornerAccent } from '../../components/CornerAccent';
import { CancelButton } from '../../components/BtnCancelar';

import { Category, CartEntry, Item } from './Types';
import { CATEGORIES, SECTIONS } from './Data';

import { CategoryTab } from './components/CategoryTab';
import { ItemsGrid } from './components/ItemsGrid';
import { SelectItemsTitle } from './components/SelectItemsTitle';
import { CheckoutBar } from './components/CheckoutBar';
import { CartModal } from './components/CartModal';


// ✅ TIPAGEM CORRIGIDA DO FLOW
type RootStackParamList = {
  SelectItems: {
    nomeBarbeiro: string;
  };
  DigiteSeuNome: {
    valor: number;
    nomeBarbeiro: string;
    servico: string;
    produto: string;
  };
};

export default function SelectItemsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route =
    useRoute<RouteProp<RootStackParamList, 'SelectItems'>>();

  // ✅ vindo da tela anterior
  const { nomeBarbeiro } = route.params;

  const [activeCategory, setActiveCategory] =
    useState<Category>('Serviços');

  const [cart, setCart] =
    useState<Record<string, CartEntry>>({});

  const [cartVisible, setCartVisible] = useState(false);

  // 🛒 adicionar/remover item
  const toggleItem = (item: Item) => {
    setCart(prev => {
      const existing = prev[item.id];

      if (existing) {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      }

      return {
        ...prev,
        [item.id]: { item, qty: 1 },
      };
    });
  };

  // 📊 totais
  const totalItems = Object.values(cart).reduce(
    (acc, e) => acc + e.qty,
    0
  );

  const totalPrice = Object.values(cart).reduce(
    (acc, e) => acc + e.item.price * e.qty,
    0
  );

  // ✅ separar serviços
  const selectedServices = Object.values(cart)
    .filter(e => e.item.category === 'Serviços')
    .map(e => e.item.name);

  // ✅ separar produtos (incluindo bebidas como produto)
  const selectedProducts = Object.values(cart)
    .filter(
      e =>
        e.item.category === 'Produtos' ||
        e.item.category === 'Bebidas'
    )
    .map(e => e.item.name);

  // 🚀 função de navegação final
  const handleFinish = () => {
    if (totalItems === 0) return;

    navigation.navigate('DigiteSeuNome', {
      nomeBarbeiro,
      servico: selectedServices.join(', '),
      produto: selectedProducts.join(', '),
      valor: totalPrice,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.safe} />

      <SafeAreaView style={styles.safe}>
        <ImageBackground
          source={require('../../assets/img/Background.jpg')}
          style={styles.container}
          resizeMode="cover"
        >
          <CornerAccent position="topRight" />
          <CornerAccent position="bottomLeft" />

          <View style={styles.content}>

            {/* Topo */}
            <View style={styles.topRow}>
              <CancelButton onPress={() => navigation.goBack()} />

              <View style={styles.logoMark}>
                <Text style={styles.logoIcon}>⬆</Text>
              </View>
            </View>

            {/* Categorias */}
            <View style={styles.tabs}>
              {CATEGORIES.map(cat => (
                <CategoryTab
                  key={cat.label}
                  label={cat.label}
                  icon={cat.icon}
                  active={activeCategory === cat.label}
                  onPress={() => setActiveCategory(cat.label)}
                />
              ))}
            </View>

            {/* Título */}
            <SelectItemsTitle />

            {/* Grid */}
            <ItemsGrid
              sections={SECTIONS[activeCategory]}
              cart={cart}
              onToggle={toggleItem}
            />

            {/* Barra inferior */}
            <CheckoutBar
              totalItems={totalItems}
              totalPrice={totalPrice}
              onCart={() => setCartVisible(true)}
              onFinish={handleFinish}
            />

            {/* Modal carrinho */}
            <CartModal
              visible={cartVisible}
              cart={cart}
              onClose={() => setCartVisible(false)}
              onRemove={toggleItem}
              onFinish={handleFinish}
            />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoMark: {
    alignItems: 'center',
  },
  logoIcon: {
    color: '#D4A017',
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
  },
});