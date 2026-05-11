import { Platform } from 'react-native'

export const FontFamilies = {
  primary: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  secondary: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
}

export const FontSizes = {
  display: 44,
  heading: 32,
  title: 22,
  body: 16,
  label: 14,
  caption: 12,
}

export const FontWeights = {
  regular: '400',
  medium: '600',
  semibold: '700',
  bold: '800',
  black: '900',
}
