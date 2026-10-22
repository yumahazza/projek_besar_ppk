/**
 * AssistantStack Component
 * SRS-INF-001: Navigation stack for Assistant screens (AssistantHome <-> SessionRecap)
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AssistantHomeScreen } from '@/screens/assistant/AssistantHomeScreen';
import { SessionRecapScreen } from '@/screens/assistant/SessionRecapScreen';
import { NavigationProp, AssistantScreenName } from '@/navigation/navigationTypes';

export const AssistantStack: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AssistantScreenName>('AssistantHome');

  const navigation: NavigationProp = {
    currentScreen,
    navigate: (screen: string) => {
      if (screen === 'SessionRecap' || screen === 'AssistantHome') {
        setCurrentScreen(screen as AssistantScreenName);
      }
    },
    goBack: () => {
      setCurrentScreen('AssistantHome');
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AssistantStack;

