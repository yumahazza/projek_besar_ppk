
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  badge?: string;
  title: string;
  description: string;
  hint?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconName,
  iconColor = APP_COLORS.neutral500,
  iconBgColor = APP_COLORS.neutral100,
  badge,
  title,
  description,
  hint,
  actionTitle,
  onActionPress,
}) => {
  const resolvedIcon = iconName ?? icon ?? 'file-tray-outline';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBgColor },
        ]}
      >
        <Ionicons
          name={resolvedIcon}
          size={40}
          color={iconColor}
        />
      </View>

      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {hint ? (
        <View style={styles.hintContainer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={APP_COLORS.primary}
          />
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      ) : null}

      {actionTitle && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>{actionTitle}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    padding: APP_SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: APP_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  badge: {
    backgroundColor: APP_COLORS.primary50,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: APP_RADIUS.pill,
    marginBottom: APP_SPACING.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: APP_SPACING.xs,
    width: '100%',
    marginTop: APP_SPACING.md,
    padding: APP_SPACING.md,
    backgroundColor: APP_COLORS.primary50,
    borderRadius: APP_RADIUS.md,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: APP_COLORS.neutral700,
  },
  actionButton: {
    marginTop: APP_SPACING.lg,
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.primary,
    borderRadius: APP_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.75,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.white,
  },
});

export default EmptyState;
