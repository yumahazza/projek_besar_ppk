/**
 * CustomButton Component
 * SRS-UI-002: Base reusable UI button with primary, secondary, destructive, and outline variants
 * Follows DSG.md Section 23 (Button System)
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    if (disabled) {
      return {
        container: {
          backgroundColor: APP_COLORS.neutral200,
          borderColor: 'transparent',
        },
        text: {
          color: APP_COLORS.neutral500,
        },
      };
    }

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: APP_COLORS.primary,
            borderColor: 'transparent',
          },
          text: {
            color: APP_COLORS.white,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: APP_COLORS.primary50,
            borderColor: APP_COLORS.primary100,
            borderWidth: 1,
          },
          text: {
            color: APP_COLORS.primary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: APP_COLORS.danger,
            borderColor: 'transparent',
          },
          text: {
            color: APP_COLORS.white,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: APP_COLORS.white,
            borderColor: APP_COLORS.neutral300,
            borderWidth: 1.5,
          },
          text: {
            color: APP_COLORS.neutral700,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            color: APP_COLORS.primary,
          },
        };
      default:
        return {
          container: {
            backgroundColor: APP_COLORS.primary,
            borderColor: 'transparent',
          },
          text: {
            color: APP_COLORS.white,
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            height: 38,
            paddingHorizontal: APP_SPACING.md,
            borderRadius: APP_RADIUS.md,
          },
          text: {
            fontSize: 13,
            fontWeight: '600',
          },
        };
      case 'lg':
        return {
          container: {
            height: 52,
            paddingHorizontal: APP_SPACING.xxl,
            borderRadius: APP_RADIUS.md,
          },
          text: {
            fontSize: 16,
            fontWeight: '700',
          },
        };
      case 'md':
      default:
        return {
          container: {
            height: 48,
            paddingHorizontal: APP_SPACING.lg,
            borderRadius: APP_RADIUS.md,
          },
          text: {
            fontSize: 15,
            fontWeight: '600',
          },
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.baseContainer,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.text.color}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconMargin}>{leftIcon}</View>}
          <Text
            style={[
              styles.baseText,
              variantStyle.text,
              sizeStyle.text,
              textStyle,
            ]}
            numberOfLines={2}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconMargin}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 44, // Accessibility standard touch target
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  baseText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  iconMargin: {
    marginRight: APP_SPACING.sm,
  },
  rightIconMargin: {
    marginLeft: APP_SPACING.sm,
  },
});

export default CustomButton;

