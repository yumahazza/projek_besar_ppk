import React from 'react';
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
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AttendanceRecord, Schedule } from '@/data/schedules';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface AttendanceDetailScreenProps {
  navigation: NavigationProp;
}

export const AttendanceDetailScreen: React.FC<AttendanceDetailScreenProps> = ({
  navigation,
}) => {
  const { activeRole, activeUser, activeSchedule, attendanceLogs } = useApp();

  const record: AttendanceRecord =
    navigation.params?.record ||
    attendanceLogs[0] || {
      id: 'default',
      scheduleId: activeSchedule?.id || 'sch-1',
      studentId: activeUser.id,
      studentName: activeUser.name,
      nim: activeUser.nim || '12345678',
      timestamp: '10:02:15 WIB',
      date: '22 Okt 2026',
      status: 'Hadir',
    };

  const schedule: Schedule | undefined =
    navigation.params?.schedule || activeSchedule;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Detail Presensi"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Student Avatar Card */}
        <Card style={styles.studentCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color={APP_COLORS.primary} />
          </View>
          <Text style={styles.studentNameText}>{record.studentName}</Text>
          <Text style={styles.studentNimText}>NIM {record.nim}</Text>
        </Card>

        {/* Attendance Information Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Informasi Kehadiran</Text>

          {/* Praktikum */}
          {schedule && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Praktikum</Text>
              <Text style={styles.detailValue}>{schedule.courseName}</Text>
            </View>
          )}

          {/* Status */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <StatusBadge status={record.status} size="sm" />
          </View>

          {/* Waktu Presensi */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Waktu Presensi</Text>
            <Text style={styles.detailValue}>{record.timestamp}</Text>
          </View>

          {/* Tanggal */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tanggal</Text>
            <Text style={styles.detailValue}>{record.date}</Text>
          </View>

          {/* Metode */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode</Text>
            <Text style={styles.detailValue}>Presensi Mandiri (Mobile App)</Text>
          </View>

          {/* Keterangan */}
          <View style={[styles.detailRow, styles.lastRow]}>
            <Text style={styles.detailLabel}>Keterangan</Text>
            <Text style={styles.detailValue}>-</Text>
          </View>
        </Card>

        {/* Blue Info Confirmation Callout */}
        <View style={styles.infoCallout}>
          <Ionicons
            name="information-circle"
            size={20}
            color={APP_COLORS.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoCalloutText}>
            Presensi tercatat dengan benar dan telah tersimpan di sistem.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
        activeTab={activeRole === 'assistant' ? 'SessionRecap' : 'StudentHistory'}
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
  studentCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.xxl,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  studentNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 4,
  },
  studentNimText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  infoCard: {
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.lg,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: APP_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  infoCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.softBlue,
    borderWidth: 1,
    borderColor: APP_COLORS.lightBlue,
    borderRadius: 10,
    padding: APP_SPACING.md,
  },
  infoIcon: {
    marginRight: APP_SPACING.sm,
  },
  infoCalloutText: {
    flex: 1,
    fontSize: 12,
    color: APP_COLORS.textPrimary,
    lineHeight: 18,
  },
});

export default AttendanceDetailScreen;
