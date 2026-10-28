import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { AssistantStack } from '@/navigation/AssistantStack';
import { StudentStack } from '@/navigation/StudentStack';
import { APP_COLORS } from '@/constants/theme';

export const AppNavigator: React.FC = () => {
  const { activeRole } = useApp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
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
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: APP_COLORS.background,
  },
  content: {
    flex: 1,
  },
});

export default AppNavigator;
