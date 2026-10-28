import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface ScheduleScreenProps {
  navigation: NavigationProp;
}

interface DayItem {
  id: string;
  dayName: string;
  dateNum: number;
}

const DAYS_OF_WEEK: DayItem[] = [
  { id: 'senin', dayName: 'Senin', dateNum: 6 },
  { id: 'selasa', dayName: 'Selasa', dateNum: 7 },
  { id: 'rabu', dayName: 'Rabu', dateNum: 8 },
  { id: 'kamis', dayName: 'Kamis', dateNum: 9 },
  { id: 'jumat', dayName: "Jum'at", dateNum: 10 },
];

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { schedules, setActiveScheduleId, activeRole } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('selasa');

  // Filter schedules based on day if specified, or display all schedules cleanly
  const displayedSchedules = useMemo(() => {
    return schedules;
  }, [schedules]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Blue Top Header */}
      <AppHeader
        title="Jadwal Praktikum"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Horizontal Date Selector */}
        <View style={styles.dateSelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateSelectorScroll}>
            {DAYS_OF_WEEK.map((item) => {
              const isSelected = selectedDay === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedDay(item.id)}
                  style={({ pressed }) => [
                    styles.dayChip,
                    isSelected && styles.dayChipSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text
                    style={[
                      styles.dayNameText,
                      isSelected && styles.dayNameSelected,
                    ]}>
                    {item.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumText,
                      isSelected && styles.dateNumSelected,
                    ]}>
                    {item.dateNum}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Schedule Cards List */}
        <View style={styles.schedulesList}>
          {displayedSchedules.map((schedule) => (
            <Card
              key={schedule.id}
              onPress={() => {
                setActiveScheduleId(schedule.id);
                navigation.navigate('SessionDetail', { scheduleId: schedule.id });
              }}
              style={styles.scheduleCard}>
              <View style={styles.scheduleRow}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.courseTitle}>{schedule.courseName}</Text>
                  <Text style={styles.scheduleMeta}>
                    {schedule.time} | {schedule.room}
                  </Text>
                </View>
                <View style={styles.badgeRow}>
                  <StatusBadge status={schedule.status} size="sm" />
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={APP_COLORS.neutral500}
                    style={styles.chevronIcon}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
        activeTab="ScheduleList"
        onTabChange={(tabKey) => navigation.navigate(tabKey)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.md,
    paddingBottom: APP_SPACING.xl,
  },
  dateSelectorContainer: {
    marginBottom: APP_SPACING.lg,
  },
  dateSelectorScroll: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    paddingVertical: 4,
  },
  dayChip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 72,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  dayChipSelected: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  dayNameText: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  dateNumText: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
  },
  dateNumSelected: {
    color: APP_COLORS.white,
  },
  schedulesList: {
    gap: APP_SPACING.sm,
  },
  scheduleCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleInfo: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 4,
  },
  scheduleMeta: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 6,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ScheduleScreen;
