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
import { StatusBadge } from '@/components/StatusBadge';
import { CustomButton } from '@/components/CustomButton';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DonutChart } from '@/components/DonutChart';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface SessionDetailScreenProps {
  navigation: NavigationProp;
}

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  navigation,
}) => {
  const {
    activeSchedule,
    schedules,
    getAttendanceForSchedule,
    activeRole,
    activeUser,
    hasStudentAttended,
    submitAttendance,
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

  const isAttended = currentSchedule
    ? hasStudentAttended(currentSchedule.id, activeUser.id)
    : false;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Detail Sesi"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Main Session Banner Card */}
        {currentSchedule && (
          <Card style={styles.topCard}>
            <View style={styles.topCardRow}>
              <View style={styles.courseInfoGroup}>
                <Text style={styles.courseName}>{currentSchedule.courseName}</Text>
                <Text style={styles.courseMeta}>
                  {currentSchedule.date} • {currentSchedule.time}
                </Text>
              </View>
              <StatusBadge status={currentSchedule.status} size="sm" />
            </View>
          </Card>
        )}

        {/* Info Rows Cards */}
        {currentSchedule && (
          <View style={styles.infoSection}>
            {/* Ruang */}
            <Card style={styles.infoRowCard}>
              <View style={styles.infoRowContent}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="business" size={18} color={APP_COLORS.primary} />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Ruang</Text>
                  <Text style={styles.infoValue}>{currentSchedule.room}</Text>
                </View>
              </View>
            </Card>

            {/* Dosen / Asisten */}
            <Card style={styles.infoRowCard}>
              <View style={styles.infoRowContent}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="person" size={18} color={APP_COLORS.primary} />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>
                    {activeRole === 'assistant' ? 'Asisten Pengampu' : 'Dosen / Asisten'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {currentSchedule.assistantName || 'Pak Budi'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Jumlah Mahasiswa */}
            <Card style={styles.infoRowCard}>
              <View style={styles.infoRowContent}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="people" size={18} color={APP_COLORS.primary} />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Jumlah Mahasiswa</Text>
                  <Text style={styles.infoValue}>{totalRegistered}</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Persentase Kehadiran Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Persentase Kehadiran</Text>
          <Card style={styles.chartCard}>
            <DonutChart
              percentage={attendancePercentage}
              hadir={hadirCount}
              izin={izinCount}
              alfa={alfaCount}
            />
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <CustomButton
            title="Lihat Daftar Mahasiswa"
            variant="primary"
            size="lg"
            onPress={() =>
              navigation.navigate('StudentList', {
                scheduleId: currentSchedule?.id,
              })
            }
          />

          {/* If Assistant: button to Kontrol Sesi */}
          {activeRole === 'assistant' && (
            <CustomButton
              title="Buka / Kontrol Sesi"
              variant="secondary"
              size="lg"
              style={styles.extraBtn}
              onPress={() =>
                navigation.navigate('SessionControl', {
                  scheduleId: currentSchedule?.id,
                })
              }
            />
          )}

          {/* If Student & Session Open & not attended: Presensi Sekarang */}
          {activeRole === 'student' && currentSchedule?.status === 'DIBUKA' && !isAttended && (
            <CustomButton
              title="Presensi Sekarang"
              variant="primary"
              size="lg"
              style={styles.extraBtn}
              onPress={() => {
                submitAttendance(currentSchedule.id);
                navigation.navigate('StudentHome');
              }}
            />
          )}
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
  topCard: {
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  topCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseInfoGroup: {
    flex: 1,
    paddingRight: APP_SPACING.sm,
  },
  courseName: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 4,
  },
  courseMeta: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  infoSection: {
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.lg,
  },
  infoRowCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  infoRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
  },
  statsSection: {
    marginBottom: APP_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: APP_SPACING.sm,
  },
  chartCard: {
    borderRadius: APP_RADIUS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    padding: APP_SPACING.xs,
  },
  actionButtonsContainer: {
    gap: APP_SPACING.sm,
    marginTop: APP_SPACING.sm,
  },
  extraBtn: {
    marginTop: 2,
  },
});

export default SessionDetailScreen;
