/**
 * AppNavigator Component
 * SRS-INF-001: Main entry navigator switching between AssistantStack and StudentStack based on active role
 * SRS-UI-001: Includes HeaderRolePicker for instant role toggling
 * SRS-UI-005: Responsive Flexbox layout supporting mobile, tablet, and web
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { HeaderRolePicker } from '@/components/HeaderRolePicker';
import { AssistantStack } from '@/navigation/AssistantStack';
import { StudentStack } from '@/navigation/StudentStack';
import { APP_COLORS } from '@/constants/theme';

export const AppNavigator: React.FC = () => {
  const { activeRole } = useApp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Global Role & User Switcher Header */}
        <HeaderRolePicker />

        {/* Role-Specific Screen Flow */}
        <View style={styles.content}>
          {activeRole === 'assistant' ? <AssistantStack /> : <StudentStack />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.white,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    backgroundColor: APP_COLORS.neutral50,
  },
  content: {
    flex: 1,
  },
});

export default AppNavigator;
