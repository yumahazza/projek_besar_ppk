/**
 * EmptyState Component
 * SRS-UI-002, SRS-UI-003, SRS-UI-004: Contextual, polished empty state component
 * Follows DSG.md Section 21 (Helpful, Contextual Empty State)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';
import { CustomButton } from '@/components/CustomButton';

export interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  badge?: string;
  title: string;
  description?: string;
  hint?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  secondaryActionTitle?: string;
  onSecondaryActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'calendar-outline',
  iconColor = APP_COLORS.primary500,
  iconBgColor = APP_COLORS.primary50,
  badge,
  title,
  description,
  hint,
  actionTitle,
  onActionPress,
  secondaryActionTitle,
  onSecondaryActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon with soft styled circle container */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: iconBgColor,
            borderColor: APP_COLORS.primary100,
          },
        ]}>
        <Ionicons name={iconName} size={36} color={iconColor} />
      </View>

      {/* Optional Badge */}
      {badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {/* Title & Description */}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}

      {/* Helpful Hint */}
      {hint && (
        <View style={styles.hintContainer}>
          <Ionicons
            name="bulb-outline"
            size={14}
            color={APP_COLORS.primary}
          />
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {(actionTitle || secondaryActionTitle) && (
        <View style={styles.actionsContainer}>
          {actionTitle && onActionPress && (
            <CustomButton
              title={actionTitle}
              onPress={onActionPress}
              variant="primary"
              size="sm"
              fullWidth={false}
            />
          )}
          {secondaryActionTitle && onSecondaryActionPress && (
            <CustomButton
              title={secondaryActionTitle}
              onPress={onSecondaryActionPress}
              variant="outline"
              size="sm"
              fullWidth={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.xxxl,
    paddingHorizontal: APP_SPACING.xxl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: APP_RADIUS.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  badgeContainer: {
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: APP_RADIUS.pill,
    marginBottom: APP_SPACING.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.neutral700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    textAlign: 'center',
    marginBottom: APP_SPACING.xs,
  },
  description: {
    fontSize: 14,
    color: APP_COLORS.neutral500,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 6,
    gap: 6,
    marginTop: APP_SPACING.md,
    maxWidth: 320,
  },
  hintText: {
    fontSize: 12,
    color: APP_COLORS.neutral700,
    lineHeight: 16,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    marginTop: APP_SPACING.lg,
  },
});

export default EmptyState;
