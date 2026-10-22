/**
 * EmptyState Component
 * SRS-UI-002: Base reusable Empty State view
 * Follows DSG.md Section 21 (Helpful, contextual empty state)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';
import { CustomButton } from '@/components/CustomButton';

export interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'calendar-outline',
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={APP_COLORS.primary500} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionTitle && onActionPress && (
        <View style={styles.actionContainer}>
          <CustomButton
            title={actionTitle}
            onPress={onActionPress}
            variant="secondary"
            size="sm"
            fullWidth={false}
          />
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
    backgroundColor: APP_COLORS.primary50,
    borderWidth: 1,
    borderColor: APP_COLORS.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.lg,
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
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: APP_SPACING.lg,
  },
});

export default EmptyState;

