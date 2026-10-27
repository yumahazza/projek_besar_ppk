
import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { APP_COLORS, MaxContentWidth } from '@/constants/theme';

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: any;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        <View style={[styles.innerContainer, style]}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.white,
  },
  outerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    minWidth: 0,
    maxWidth: Platform.OS === 'web' ? MaxContentWidth : '100%',
    backgroundColor: APP_COLORS.white,
  },
});
