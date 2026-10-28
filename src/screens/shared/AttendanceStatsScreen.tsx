import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DonutChart } from '@/components/DonutChart';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface AttendanceStatsScreenProps {
  navigation: NavigationProp;
}

export const AttendanceStatsScreen: React.FC<AttendanceStatsScreenProps> = ({
  navigation,
}) => {
  const {
    activeSchedule,
    schedules,
    getAttendanceForSchedule,
    activeRole,
  } = useApp();

  const targetScheduleId = navigation.params?.scheduleId || activeSchedule?.id;
  const currentSchedule =
    schedules.find((s) => s.id === targetScheduleId) ||
    activeSchedule ||
    schedules[0];

  const attendanceList = useMemo(() => {
    return currentSchedule ? getAttendanceForSchedule(currentSchedule.id) : [];
  }, [currentSchedule, getAttendanceForSchedule]);

  const totalRegistered = currentSchedule?.totalStudents || 20;
  const hadirCount = attendanceList.length;
  const izinCount = 0;
  const alfaCount = Math.max(0, totalRegistered - hadirCount);
  const attendancePercentage =
    totalRegistered > 0 ? Math.round((hadirCount / totalRegistered) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Statistik Kehadiran"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Session Info Card */}
        {currentSchedule && (
          <Card style={styles.sessionCard}>
            <View style={styles.sessionRow}>
              <View style={styles.iconBox}>
                <Ionicons name="stats-chart" size={18} color={APP_COLORS.primary} />
              </View>
              <View style={styles.sessionTextCol}>
                <Text style={styles.courseName}>{currentSchedule.courseName}</Text>
                <Text style={styles.sessionMeta}>
                  {currentSchedule.time} | {currentSchedule.room}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Donut Chart Card */}
        <Card style={styles.chartCard}>
          <DonutChart
            percentage={attendancePercentage}
            hadir={hadirCount}
            izin={izinCount}
            alfa={alfaCount}
          />
        </Card>

        {/* Section Per Sesi (Horizontal Progress Bars) */}
        <View style={styles.perSessionSection}>
          <Text style={styles.sectionTitle}>Per Sesi</Text>

          <View style={styles.barsList}>
            {schedules.map((schedule) => {
              const count = getAttendanceForSchedule(schedule.id).length;
              const total = schedule.totalStudents || 20;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <Card key={schedule.id} style={styles.barCard}>
                  <View style={styles.barLabelRow}>
                    <Text style={styles.barCourseName}>{schedule.courseName}</Text>
                    <Text style={styles.barPercentText}>{percent}%</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.max(5, Math.min(100, percent))}%` },
                      ]}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
        activeTab="SessionRecap"
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
  sessionCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  sessionTextCol: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
  },
  chartCard: {
    borderRadius: APP_RADIUS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    padding: APP_SPACING.xs,
    marginBottom: APP_SPACING.lg,
  },
  perSessionSection: {
    marginBottom: APP_SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: APP_SPACING.sm,
  },
  barsList: {
    gap: APP_SPACING.sm,
  },
  barCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barCourseName: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  barPercentText: {
    fontSize: 13,
    fontWeight: '700',
    color: APP_COLORS.accentBlue,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: APP_COLORS.accentBlue,
    borderRadius: 4,
  },
});

export default AttendanceStatsScreen;
