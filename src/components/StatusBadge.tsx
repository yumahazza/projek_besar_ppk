/**
 * StatusBadge Component
 * SRS-UI-002: Base reusable UI component for session and attendance status
 * Follows DSG.md Section 12 (Status Badge)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { SessionStatus } from '@/data/schedules';
import { APP_COLORS, APP_RADIUS } from '@/constants/theme';

export type BadgeStatus = SessionStatus | 'HADIR' | 'TIDAK_HADIR' | 'INFO';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  style,
}) => {
  const normalized = (status || '').toUpperCase();

  let backgroundColor: string = APP_COLORS.neutral100;
  let textColor: string = APP_COLORS.neutral700;
  let dotColor: string = APP_COLORS.neutral500;
  let displayLabel = label;

  switch (normalized) {
    case 'DIBUKA':
      backgroundColor = APP_COLORS.openedSoft;
      textColor = APP_COLORS.opened;
      dotColor = APP_COLORS.opened;
      displayLabel = displayLabel || 'DIBUKA';
      break;
    case 'BELUM_DIBUKA':
    case 'BELUM DIBUKA':
      backgroundColor = APP_COLORS.notOpenedSoft;
      textColor = APP_COLORS.notOpened;
      dotColor = APP_COLORS.notOpened;
      displayLabel = displayLabel || 'BELUM DIBUKA';
      break;
    case 'SELESAI':
      backgroundColor = APP_COLORS.finishedSoft;
      textColor = APP_COLORS.finished;
      dotColor = APP_COLORS.finished;
      displayLabel = displayLabel || 'SELESAI';
      break;
    case 'HADIR':
      backgroundColor = APP_COLORS.openedSoft;
      textColor = APP_COLORS.opened;
      dotColor = APP_COLORS.opened;
      displayLabel = displayLabel || 'HADIR';
      break;
    case 'ERROR':
      backgroundColor = APP_COLORS.errorSoft;
      textColor = APP_COLORS.error;
      dotColor = APP_COLORS.error;
      displayLabel = displayLabel || 'ERROR';
      break;
    default:
      displayLabel = displayLabel || normalized;
      break;
  }

  const sizeStyles = {
    sm: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      dotSize: 6,
      fontSize: 11,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      dotSize: 7,
      fontSize: 12,
    },
    lg: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      dotSize: 8,
      fontSize: 13,
    },
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${displayLabel}`}>
      <View
        style={[
          styles.dot,
          {
            width: sizeStyles.dotSize,
            height: sizeStyles.dotSize,
            borderRadius: sizeStyles.dotSize / 2,
            backgroundColor: dotColor,
          },
        ]}
      />
      <Text
        style={[
          styles.label,
          {
            color: textColor,
            fontSize: sizeStyles.fontSize,
          },
        ]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: APP_RADIUS.pill,
    gap: 6,
  },
  dot: {
    marginRight: 2,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default StatusBadge;
