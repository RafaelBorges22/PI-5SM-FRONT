export type Category = 'Serviços' | 'Produtos' | 'Bebidas';

export interface Item {
  id: string;
  name: string;
  price: number;
  category: Category;
  icon?: string;
}

export interface CartEntry {
  item: Item;
  qty: number;
}

export type RootStackParamList = {
  Home: undefined;
  SelectBarber: undefined;
  SelectItems: undefined;
  DigiteSeuNome: undefined;
};