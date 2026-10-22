/**
 * StudentStack Component
 * SRS-INF-001: Navigation stack for Student screens (StudentHome <-> StudentHistory)
 * SRS-UI-005: Responsive screen switching with param passing
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StudentHomeScreen } from '@/screens/student/StudentHomeScreen';
import { StudentHistoryScreen } from '@/screens/student/StudentHistoryScreen';
import { NavigationProp, StudentScreenName } from '@/navigation/navigationTypes';

export const StudentStack: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<StudentScreenName>('StudentHome');
  const [screenParams, setScreenParams] = useState<any>(undefined);

  const navigation: NavigationProp = {
    currentScreen,
    params: screenParams,
    navigate: (screen: string, params?: any) => {
      if (screen === 'StudentHistory' || screen === 'StudentHome') {
        setScreenParams(params);
        setCurrentScreen(screen as StudentScreenName);
      }
    },
    goBack: () => {
      setScreenParams(undefined);
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
