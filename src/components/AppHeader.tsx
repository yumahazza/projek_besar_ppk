import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { APP_COLORS, APP_SPACING } from '@/constants/theme';

export interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'PPK',
  onBack,
  onNotificationPress,
  hasUnreadNotifications = true,
  rightAction,
  subtitle,
}) => {
  return (
    <View style={styles.headerWrapper}>
      <StatusBar style="light" />
      <View style={styles.headerContent}>
        {/* Left: Back button or App Brand Icon */}
        <View style={styles.leftContainer}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Ionicons name="arrow-back" size={22} color={APP_COLORS.white} />
            </Pressable>
          ) : (
            <View style={styles.brandIconWrapper}>
              <Ionicons name="school" size={20} color={APP_COLORS.white} />
            </View>
          )}
        </View>

        {/* Center: Title & Optional Subtitle */}
        <View style={styles.centerContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right: Notification bell or custom action */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : onNotificationPress ? (
            <Pressable
              onPress={onNotificationPress}
              accessibilityRole="button"
              accessibilityLabel="Notifikasi"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Ionicons name="notifications-outline" size={22} color={APP_COLORS.white} />
              {hasUnreadNotifications && <View style={styles.notificationDot} />}
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: APP_COLORS.primary,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 8 : 10,
    paddingBottom: 14,
    paddingHorizontal: APP_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.deepBlue,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: APP_SPACING.sm,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.white,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
    textAlign: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: APP_COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
});

export default AppHeader;
