import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface StudentListScreenProps {
  navigation: NavigationProp;
}

export const StudentListScreen: React.FC<StudentListScreenProps> = ({
  navigation,
}) => {
  const {
    activeSchedule,
    schedules,
    getAttendanceForSchedule,
    activeRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const targetScheduleId = navigation.params?.scheduleId || activeSchedule?.id;
  const currentSchedule =
    schedules.find((s) => s.id === targetScheduleId) ||
    activeSchedule ||
    schedules[0];

  const attendanceLogs = useMemo(() => {
    return currentSchedule ? getAttendanceForSchedule(currentSchedule.id) : [];
  }, [currentSchedule, getAttendanceForSchedule]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return attendanceLogs;
    const q = searchQuery.toLowerCase().trim();
    return attendanceLogs.filter(
      (log) =>
        log.studentName.toLowerCase().includes(q) ||
        (log.nim && log.nim.toLowerCase().includes(q))
    );
  }, [attendanceLogs, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Daftar Mahasiswa"
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
                <Ionicons name="book" size={18} color={APP_COLORS.primary} />
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

        {/* Search Field */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={APP_COLORS.neutral500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau NIM..."
            placeholderTextColor={APP_COLORS.neutral400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={APP_COLORS.neutral500} />
            </Pressable>
          )}
        </View>

        {/* Students Table or Empty State */}
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title={
              searchQuery.trim()
                ? 'Mahasiswa Tidak Ditemukan'
                : 'Belum Ada Mahasiswa Hadir'
            }
            description={
              searchQuery.trim()
                ? `Tidak ada data presensi yang cocok dengan kata kunci "${searchQuery}".`
                : 'Belum ada data kehadiran praktikan yang tercatat pada sesi ini.'
            }
          />
        ) : (
          <View style={styles.tableCard}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableColTitle, styles.colNo]}>No</Text>
              <Text style={[styles.tableColTitle, styles.colName]}>Nama</Text>
              <Text style={[styles.tableColTitle, styles.colStatus]}>Status</Text>
              <Text style={[styles.tableColTitle, styles.colTime]}>Waktu</Text>
            </View>

            {/* Table Rows */}
            {filteredLogs.map((log, index) => {
              const formattedTime = log.timestamp
                ? log.timestamp.replace(' WIB', '')
                : '-';

              return (
                <Pressable
                  key={log.id}
                  onPress={() =>
                    navigation.navigate('AttendanceDetail', {
                      record: log,
                      schedule: currentSchedule,
                    })
                  }
                  style={({ pressed }) => [
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlt,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.cellText, styles.colNo]}>{index + 1}</Text>
                  <View style={styles.colName}>
                    <Text style={styles.studentNameText} numberOfLines={1}>
                      {log.studentName}
                    </Text>
                    <Text style={styles.studentNimText}>NIM {log.nim}</Text>
                  </View>
                  <View style={styles.colStatus}>
                    <StatusBadge status={log.status} size="sm" />
                  </View>
                  <Text style={[styles.timeCellText, styles.colTime]}>
                    {formattedTime}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: APP_SPACING.md,
    height: 44,
    marginBottom: APP_SPACING.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: APP_SPACING.sm,
    fontSize: 13,
    color: APP_COLORS.navyHeading,
  },
  clearBtn: {
    padding: 4,
  },
  tableCard: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: APP_SPACING.md,
  },
  tableColTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowAlt: {
    backgroundColor: '#FAFCFF',
  },
  colNo: {
    width: 28,
    textAlign: 'center',
  },
  colName: {
    flex: 1,
    paddingHorizontal: APP_SPACING.sm,
  },
  colStatus: {
    width: 72,
    alignItems: 'center',
  },
  colTime: {
    width: 60,
    textAlign: 'right',
  },
  cellText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  timeCellText: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    fontWeight: '500',
  },
  studentNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  studentNimText: {
    fontSize: 11,
    color: APP_COLORS.textMuted,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default StudentListScreen;
