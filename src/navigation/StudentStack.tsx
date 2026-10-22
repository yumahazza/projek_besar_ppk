/**
 * StudentStack Component
 * SRS-INF-001: Navigation stack for Student screens (StudentHome <-> StudentHistory)
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StudentHomeScreen } from '@/screens/student/StudentHomeScreen';
import { StudentHistoryScreen } from '@/screens/student/StudentHistoryScreen';
import { NavigationProp, StudentScreenName } from '@/navigation/navigationTypes';

export const StudentStack: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<StudentScreenName>('StudentHome');

  const navigation: NavigationProp = {
    currentScreen,
    navigate: (screen: string) => {
      if (screen === 'StudentHistory' || screen === 'StudentHome') {
        setCurrentScreen(screen as StudentScreenName);
      }
    },
    goBack: () => {
      setCurrentScreen('StudentHome');
    },
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'StudentHome' && (
        <StudentHomeScreen navigation={navigation} />
      )}
      {currentScreen === 'StudentHistory' && (
        <StudentHistoryScreen navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudentStack;

