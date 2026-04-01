import { Category, Item } from './Types';

export const CATEGORIES: { label: Category; icon: string }[] = [
  { label: 'Serviços', icon: '✂️' },
  { label: 'Produtos', icon: '🧴' },
  { label: 'Bebidas', icon: '🥤' },
];

export const SECTIONS: Record<Category, { section: string; items: Item[] }[]> = {
  Serviços: [
    {
      section: 'Corte',
      items: [
        { id: 's1', name: 'Corte Simples', price: 35, category: 'Serviços', icon: '✂️' },
        { id: 's2', name: 'Corte + Barba', price: 1, category: 'Serviços', icon: '💈' },
        { id: 's3', name: 'Barba', price: 30, category: 'Serviços', icon: '🪒' },
        { id: 's4', name: 'Sobrancelha', price: 15, category: 'Serviços', icon: '👁️' },
        { id: 's5', name: 'Relaxamento', price: 45, category: 'Serviços', icon: '💆' },
        { id: 's6', name: 'Pigmentação', price: 80, category: 'Serviços', icon: '🎨' },
      ],
    },
  ],
  Produtos: [
    {
      section: 'Cuidados',
      items: [
        { id: 'p1', name: 'Pomada Mate', price: 40, category: 'Produtos', icon: '🫙' },
        { id: 'p2', name: 'Óleo de Barba', price: 55, category: 'Produtos', icon: '💧' },
        { id: 'p3', name: 'Shampoo', price: 35, category: 'Produtos', icon: '🧴' },
        { id: 'p4', name: 'Condicionador', price: 35, category: 'Produtos', icon: '🧼' },
        { id: 'p5', name: 'Balm Barba', price: 50, category: 'Produtos', icon: '🪴' },
        { id: 'p6', name: 'Loção Pós', price: 45, category: 'Produtos', icon: '✨' },
      ],
    },
  ],
  Bebidas: [
    {
      section: 'Bebidas',
      items: [
        { id: 'b1', name: 'Água', price: 5, category: 'Bebidas', icon: '💧' },
        { id: 'b2', name: 'Refrigerante', price: 8, category: 'Bebidas', icon: '🥤' },
        { id: 'b3', name: 'Suco', price: 10, category: 'Bebidas', icon: '🧃' },
        { id: 'b4', name: 'Café', price: 6, category: 'Bebidas', icon: '☕' },
        { id: 'b5', name: 'Energético', price: 12, category: 'Bebidas', icon: '⚡' },
        { id: 'b6', name: 'Cerveja', price: 14, category: 'Bebidas', icon: '🍺' },
      ],
    },
  ],
};