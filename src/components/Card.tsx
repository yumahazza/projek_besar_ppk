/**
 * Card Component
 * SRS-UI-002: Base reusable Card container
 * Follows DSG.md Section 8 & 13 (Rounded cards, subtle shadow, clean hierarchy)
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { APP_COLORS, APP_RADIUS, APP_SPACING, APP_SHADOWS } from '@/constants/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: number;
  highlighted?: boolean;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  header,
  footer,
  padding = APP_SPACING.lg,
  highlighted = false,
  accessibilityLabel,
}) => {
  const cardStyle: ViewStyle = {
    padding,
    borderColor: highlighted ? APP_COLORS.primary500 : APP_COLORS.neutral200,
    backgroundColor: APP_COLORS.white,
  };

  const content = (
    <>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.body}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.container,
          APP_SHADOWS.card,
          cardStyle,
          pressed && styles.pressed,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, APP_SHADOWS.card, cardStyle, style]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  header: {
    marginBottom: APP_SPACING.md,
  },
  body: {
    width: '100%',
  },
  footer: {
    marginTop: APP_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
    paddingTop: APP_SPACING.md,
  },
});

export default Card;

