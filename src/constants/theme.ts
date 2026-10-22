/**
 * Design tokens and theme definitions based on DSG.md
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// === DSG DESIGN TOKENS (Design Guideline & System) ===

export const APP_COLORS = {
  // Brand
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primary500: '#3B82F6',
  primary100: '#DBEAFE',
  primary50: '#EFF6FF',

  // Status
  opened: '#16A34A',
  openedSoft: '#DCFCE7',
  notOpened: '#F59E0B',
  notOpenedSoft: '#FEF3C7',
  finished: '#64748B',
  finishedSoft: '#F1F5F9',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  error: '#DC2626',
  errorSoft: '#FEE2E2',
  info: '#2563EB',
  infoSoft: '#DBEAFE',

  // Neutrals
  neutral950: '#0F172A',
  neutral700: '#334155',
  neutral500: '#64748B',
  neutral300: '#CBD5E1',
  neutral200: '#E2E8F0',
  neutral100: '#F1F5F9',
  neutral50: '#F8FAFC',
  white: '#FFFFFF',
} as const;

export const APP_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const APP_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const APP_SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
    },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
    },
    android: {
      elevation: 10,
    },
    web: {
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
    },
    default: {},
  }),
} as const;
