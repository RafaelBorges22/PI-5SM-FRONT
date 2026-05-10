import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Item, CartEntry, Category } from '../Types';
import { ItemCard } from './ItemCard';

interface ItemsGridProps {
  sections: { section: string; items: Item[] }[];
  cart: Record<string, CartEntry>;
  onToggle: (item: Item) => void;
}

export function ItemsGrid({ sections, cart, onToggle }: ItemsGridProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      indicatorStyle="white"
    >
      {sections.map(({ section, items }) => (
        <View key={section}>
          <Text style={styles.sectionLabel}>{section}:</Text>
          <View style={styles.grid}>
            {items.map((item, idx) => {
              const entry = cart[item.id];
              return (
                <View key={item.id} style={styles.cardWrapper}>
                  <ItemCard
                    item={item}
                    index={idx}
                    selected={!!entry}
                    qty={entry?.qty ?? 0}
                    onPress={() => onToggle(item)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.65)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.2)',
  },

  scrollContent: {
    padding: 14,
    gap: 16,
  },

  sectionLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  cardWrapper: {
    width: '48%',
  },
});