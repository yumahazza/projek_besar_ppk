import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AssistantHomeScreen } from '@/screens/assistant/AssistantHomeScreen';
import { SessionRecapScreen } from '@/screens/assistant/SessionRecapScreen';
import { ScheduleScreen } from '@/screens/shared/ScheduleScreen';
import { SessionDetailScreen } from '@/screens/shared/SessionDetailScreen';
import { SessionControlScreen } from '@/screens/assistant/SessionControlScreen';
import { StudentListScreen } from '@/screens/shared/StudentListScreen';
import { AttendanceDetailScreen } from '@/screens/shared/AttendanceDetailScreen';
import { AttendanceStatsScreen } from '@/screens/shared/AttendanceStatsScreen';
import { ProfileScreen } from '@/screens/shared/ProfileScreen';
import { NotificationScreen } from '@/screens/shared/NotificationScreen';
import { NavigationProp, AssistantScreenName } from '@/navigation/navigationTypes';

interface ScreenEntry {
  screen: AssistantScreenName;
  params?: any;
}

export const AssistantStack: React.FC = () => {
  const [history, setHistory] = useState<ScreenEntry[]>([
    { screen: 'AssistantHome' },
  ]);

  const currentEntry = history[history.length - 1] || { screen: 'AssistantHome' };
  const currentScreen = currentEntry.screen;
  const currentParams = currentEntry.params;

  const ROOT_TABS: AssistantScreenName[] = [
    'AssistantHome',
    'SessionRecap',
    'ScheduleList',
    'Profile',
  ];

  const navigation: NavigationProp = {
    currentScreen,
    params: currentParams,
    navigate: (screen: string, params?: any) => {
      const targetScreen = screen as AssistantScreenName;
      if (ROOT_TABS.includes(targetScreen)) {
        // Root tab switch: reset stack to root tab
        setHistory([{ screen: targetScreen, params }]);
      } else {
        // Push sub-screen to stack
        setHistory((prev) => [...prev, { screen: targetScreen, params }]);
      }
    },
    goBack: () => {
      setHistory((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, prev.length - 1);
        }
        return [{ screen: 'AssistantHome' }];
      });
    },
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'AssistantHome' && (
        <AssistantHomeScreen navigation={navigation} />
      )}
      {currentScreen === 'SessionRecap' && (
        <SessionRecapScreen navigation={navigation} />
      )}
      {currentScreen === 'ScheduleList' && (
        <ScheduleScreen navigation={navigation} />
      )}
      {currentScreen === 'Profile' && (
        <ProfileScreen navigation={navigation} />
      )}
      {currentScreen === 'SessionDetail' && (
        <SessionDetailScreen navigation={navigation} />
      )}
      {currentScreen === 'SessionControl' && (
        <SessionControlScreen navigation={navigation} />
      )}
      {currentScreen === 'StudentList' && (
        <StudentListScreen navigation={navigation} />
      )}
      {currentScreen === 'AttendanceDetail' && (
        <AttendanceDetailScreen navigation={navigation} />
      )}
      {currentScreen === 'AttendanceStats' && (
        <AttendanceStatsScreen navigation={navigation} />
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

export default AssistantStack;
