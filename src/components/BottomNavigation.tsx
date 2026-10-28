import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { UserRole } from '@/data/users';

export interface TabItem {
  key: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  activeIconName: keyof typeof Ionicons.glyphMap;
}

interface BottomNavigationProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  role,
  activeTab,
  onTabChange,
}) => {
  const assistantTabs: TabItem[] = [
    {
      key: 'AssistantHome',
      label: 'Beranda',
      iconName: 'home-outline',
      activeIconName: 'home',
    },
    {
      key: 'SessionRecap',
      label: 'Rekap',
      iconName: 'stats-chart-outline',
      activeIconName: 'stats-chart',
    },
    {
      key: 'ScheduleList',
      label: 'Jadwal',
      iconName: 'calendar-outline',
      activeIconName: 'calendar',
    },
    {
      key: 'Profile',
      label: 'Profil',
      iconName: 'person-outline',
      activeIconName: 'person',
    },
  ];

  const studentTabs: TabItem[] = [
    {
      key: 'StudentHome',
      label: 'Beranda',
      iconName: 'home-outline',
      activeIconName: 'home',
    },
    {
      key: 'ScheduleList',
      label: 'Jadwal',
      iconName: 'calendar-outline',
      activeIconName: 'calendar',
    },
    {
      key: 'StudentHistory',
      label: 'Riwayat',
      iconName: 'time-outline',
      activeIconName: 'time',
    },
    {
      key: 'Profile',
      label: 'Profil',
      iconName: 'person-outline',
      activeIconName: 'person',
    },
  ];

  const tabs = role === 'assistant' ? assistantTabs : studentTabs;

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const icon = isActive ? tab.activeIconName : tab.iconName;
        const color = isActive ? APP_COLORS.primary : APP_COLORS.neutral500;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
            <Ionicons name={icon} size={22} color={color} />
            <Text
              style={[
                styles.tabLabel,
                { color },
                isActive && styles.activeTabLabel,
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    height: 58,
    backgroundColor: APP_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 48,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.1,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default BottomNavigation;
