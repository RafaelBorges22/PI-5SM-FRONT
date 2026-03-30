import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { Colors } from '../../../assets/constants/Colors';
import { CartEntry, Item } from '../Types';

interface CartModalProps {
  visible: boolean;
  cart: Record<string, CartEntry>;
  onClose: () => void;
  onRemove: (item: Item) => void;
  onFinish: () => void;
}

function CartRow({
  entry,
  onRemove,
}: {
  entry: CartEntry;
  onRemove: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 5 }).start();

  return (
    <View style={rowStyles.row}>
      {/* Icon */}
      <View style={rowStyles.iconBox}>
        <Text style={rowStyles.icon}>{entry.item.icon ?? '✂️'}</Text>
      </View>

      {/* Info */}
      <View style={rowStyles.info}>
        <Text style={rowStyles.name}>{entry.item.name}</Text>
        <Text style={rowStyles.category}>{entry.item.category}</Text>
      </View>

      {/* Price */}
      <Text style={rowStyles.price}>R$ {entry.item.price}</Text>

      {/* Remove button */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={rowStyles.removeBtn}
          onPress={onRemove}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={rowStyles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,160,23,0.1)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(212,160,23,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  name: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  category: {
    color: 'rgba(200,148,26,0.7)',
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  price: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '800',
    minWidth: 56,
    textAlign: 'right',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,60,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,60,60,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: '#ff5c5c',
    fontSize: 11,
    fontWeight: '900',
  },
});

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function CartModal({ visible, cart, onClose, onRemove, onFinish }: CartModalProps) {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scaleFinish = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
          speed: 14,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const pressFinishIn = () =>
    Animated.spring(scaleFinish, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const pressFinishOut = () =>
    Animated.spring(scaleFinish, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const entries = Object.values(cart);
  const totalItems = entries.reduce((acc, e) => acc + e.qty, 0);
  const totalPrice = entries.reduce((acc, e) => acc + e.item.price * e.qty, 0);
  const isEmpty = entries.length === 0;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>

        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Carrinho</Text>
            {!isEmpty && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptySubtitle}>Adicione itens para continuar</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {entries.map(entry => (
              <CartRow
                key={entry.item.id}
                entry={entry}
                onRemove={() => onRemove(entry.item)}
              />
            ))}
          </ScrollView>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {totalPrice}</Text>
          </View>

          {/* Finish button */}
          <Animated.View style={[styles.finishWrapper, { transform: [{ scale: scaleFinish }] }]}>
            <TouchableOpacity
              style={[styles.finishBtn, isEmpty && styles.finishBtnDisabled]}
              onPress={isEmpty ? undefined : onFinish}
              onPressIn={isEmpty ? undefined : pressFinishIn}
              onPressOut={isEmpty ? undefined : pressFinishOut}
              activeOpacity={1}
              disabled={isEmpty}
            >
              <View style={styles.finishHighlight} />
              <Text style={styles.finishLabel}>FINALIZAR COMPRA</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── Backdrop ────────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  // ── Sheet ───────────────────────────────────────────────────
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: Colors.gold,
    paddingBottom: 36,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 24,
    maxHeight: '80%',
  },

  // ── Handle ──────────────────────────────────────────────────
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(212,160,23,0.4)',
    marginTop: 12,
    marginBottom: 4,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: '#1a1a1a',
    fontSize: 11,
    fontWeight: '900',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '800',
  },

  // ── Divider ─────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: 'rgba(212,160,23,0.15)',
    marginHorizontal: 20,
  },

  // ── List ────────────────────────────────────────────────────
  list: {
    maxHeight: 320,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingVertical: 4,
  },

  // ── Empty state ─────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: { fontSize: 48, opacity: 0.4 },
  emptyTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.5,
  },
  emptySubtitle: {
    color: '#aaa',
    fontSize: 12,
    opacity: 0.5,
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,160,23,0.15)',
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  totalValue: {
    color: Colors.gold,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // ── Finish button ───────────────────────────────────────────
  finishWrapper: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  finishBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  finishBtnDisabled: {
    backgroundColor: '#2a2a2a',
    shadowOpacity: 0,
  },
  finishHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  finishLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});