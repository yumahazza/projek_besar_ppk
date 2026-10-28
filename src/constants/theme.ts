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
  // Brand - Deep Navy Academic Palette
  deepNavy: '#0D47A1',
  accentBlue: '#2196F3',
  lightBlue: '#90CAF9',
  softBlue: '#E3F2FD',

  // Primary & Variants
  primary: '#0D47A1',
  primaryHover: '#0A3882',
  deepBlue: '#0A3882',
  accent: '#2196F3',
  primary500: '#2196F3',
  primary100: '#90CAF9',
  primary50: '#E3F2FD',

  // Status
  opened: '#16A34A',
  openedSoft: '#DCFCE7',
  notOpened: '#D97706',
  notOpenedSoft: '#FEF3C7',
  finished: '#64748B',
  finishedSoft: '#F1F5F9',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  error: '#DC2626',
  errorSoft: '#FEE2E2',
  info: '#0D47A1',
  infoSoft: '#E3F2FD',
  infoBorder: '#90CAF9',

  // Neutrals
  neutral950: '#0F172A',
  neutral700: '#334155',
  neutral500: '#64748B',
  neutral400: '#94A3B8',
  neutral300: '#CBD5E1',
  neutral200: '#E2E8F0',
  neutral100: '#F1F5F9',
  neutral50: '#F8FAFC',
  white: '#FFFFFF',

  // Semantic Aliases
  navyHeading: '#0F172A',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  success: '#16A34A',
  successBg: '#DCFCE7',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  completed: '#64748B',
  completedBg: '#F1F5F9',
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
  md: 10,
  card: 12,
  lg: 14,
  xl: 16,
  modal: 20,
  pill: 999,
} as const;

export const APP_TYPOGRAPHY = {
  pageTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: APP_COLORS.white,
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: APP_COLORS.navyHeading,
    lineHeight: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: APP_COLORS.navyHeading,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: APP_COLORS.textPrimary,
    lineHeight: 18,
  },
  bodySecondary: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: APP_COLORS.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: APP_COLORS.textMuted,
    lineHeight: 15,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
} as const;

export const APP_SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
    },
    android: {
      elevation: 1.5,
    },
    web: {
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
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
