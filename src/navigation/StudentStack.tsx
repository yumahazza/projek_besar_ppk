import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StudentHomeScreen } from '@/screens/student/StudentHomeScreen';
import { StudentHistoryScreen } from '@/screens/student/StudentHistoryScreen';
import { ScheduleScreen } from '@/screens/shared/ScheduleScreen';
import { SessionDetailScreen } from '@/screens/shared/SessionDetailScreen';
import { AttendanceDetailScreen } from '@/screens/shared/AttendanceDetailScreen';
import { ProfileScreen } from '@/screens/shared/ProfileScreen';
import { NotificationScreen } from '@/screens/shared/NotificationScreen';
import { NavigationProp, StudentScreenName } from '@/navigation/navigationTypes';

interface ScreenEntry {
  screen: StudentScreenName;
  params?: any;
}

export const StudentStack: React.FC = () => {
  const [history, setHistory] = useState<ScreenEntry[]>([
    { screen: 'StudentHome' },
  ]);

  const currentEntry = history[history.length - 1] || { screen: 'StudentHome' };
  const currentScreen = currentEntry.screen;
  const currentParams = currentEntry.params;

  const ROOT_TABS: StudentScreenName[] = [
    'StudentHome',
    'ScheduleList',
    'StudentHistory',
    'Profile',
  ];

  const navigation: NavigationProp = {
    currentScreen,
    params: currentParams,
    navigate: (screen: string, params?: any) => {
      const targetScreen = screen as StudentScreenName;
      if (ROOT_TABS.includes(targetScreen)) {
        // Tab switch
        setHistory([{ screen: targetScreen, params }]);
      } else {
        // Push sub-screen
        setHistory((prev) => [...prev, { screen: targetScreen, params }]);
      }
    },
    goBack: () => {
      setHistory((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, prev.length - 1);
        }
        return [{ screen: 'StudentHome' }];
      });
    },
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'StudentHome' && (
        <StudentHomeScreen navigation={navigation} />
      )}
      {currentScreen === 'ScheduleList' && (
        <ScheduleScreen navigation={navigation} />
      )}
      {currentScreen === 'StudentHistory' && (
        <StudentHistoryScreen navigation={navigation} />
      )}
      {currentScreen === 'Profile' && (
        <ProfileScreen navigation={navigation} />
      )}
      {currentScreen === 'SessionDetail' && (
        <SessionDetailScreen navigation={navigation} />
      )}
      {currentScreen === 'AttendanceDetail' && (
        <AttendanceDetailScreen navigation={navigation} />
      )}
      {currentScreen === 'Notifications' && (
        <NotificationScreen navigation={navigation} />
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
