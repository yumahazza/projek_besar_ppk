/**
 * StatusBadge Component
 * SRS-UI-002: Base reusable UI component for session and attendance status
 * Follows DSG.md Section 12 (Status Badge)
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
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
  let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'information-circle-outline';
  let displayLabel = label;

  switch (normalized) {
    case 'DIBUKA':
      backgroundColor = APP_COLORS.openedSoft;
      textColor = APP_COLORS.opened;
      iconName = 'radio-button-on';
      displayLabel = displayLabel || 'DIBUKA';
      break;
    case 'BELUM_DIBUKA':
    case 'BELUM DIBUKA':
      backgroundColor = APP_COLORS.notOpenedSoft;
      textColor = APP_COLORS.notOpened;
      iconName = 'time-outline';
      displayLabel = displayLabel || 'BELUM DIBUKA';
      break;
    case 'SELESAI':
      backgroundColor = APP_COLORS.finishedSoft;
      textColor = APP_COLORS.finished;
      iconName = 'checkmark-circle-outline';
      displayLabel = displayLabel || 'SELESAI';
      break;
    case 'HADIR':
      backgroundColor = APP_COLORS.openedSoft;
      textColor = APP_COLORS.opened;
      iconName = 'radio-button-on';
      displayLabel = displayLabel || 'Hadir';
      break;
    case 'IZIN':
      backgroundColor = APP_COLORS.warningBg;
      textColor = APP_COLORS.warning;
      iconName = 'time-outline';
      displayLabel = displayLabel || 'Izin';
      break;
    case 'ALFA':
    case 'TIDAK_HADIR':
    case 'TIDAK HADIR':
      backgroundColor = APP_COLORS.errorSoft;
      textColor = APP_COLORS.error;
      iconName = 'close-circle-outline';
      displayLabel = displayLabel || 'Alfa';
      break;
    case 'INFO':
      backgroundColor = APP_COLORS.primary100;
      textColor = APP_COLORS.primary;
      iconName = 'information-circle-outline';
      displayLabel = displayLabel || 'INFO';
      break;
    case 'ERROR':
      backgroundColor = APP_COLORS.errorSoft;
      textColor = APP_COLORS.error;
      iconName = 'alert-circle-outline';
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
      iconSize: 12,
      fontSize: 11,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      iconSize: 14,
      fontSize: 12,
    },
    lg: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      iconSize: 15,
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
      <Ionicons name={iconName} size={sizeStyles.iconSize} color={textColor} />
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
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default StatusBadge;
