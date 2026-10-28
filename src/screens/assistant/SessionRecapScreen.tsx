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
import { SummaryTile } from '@/components/SummaryTile';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface SessionRecapScreenProps {
  navigation: NavigationProp;
}

export const SessionRecapScreen: React.FC<SessionRecapScreenProps> = ({
  navigation,
}) => {
  const {
    activeSchedule,
    schedules,
    getAttendanceForSchedule,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const targetScheduleId = navigation.params?.scheduleId || activeSchedule?.id;
  const currentSchedule =
    schedules.find((s) => s.id === targetScheduleId) ||
    activeSchedule ||
    schedules[0];

  const allAttendanceLogs = useMemo(() => {
    return currentSchedule ? getAttendanceForSchedule(currentSchedule.id) : [];
  }, [currentSchedule, getAttendanceForSchedule]);

  const filteredAttendanceLogs = useMemo(() => {
    if (!searchQuery.trim()) return allAttendanceLogs;
    const q = searchQuery.toLowerCase().trim();
    return allAttendanceLogs.filter(
      (log) =>
        log.studentName.toLowerCase().includes(q) ||
        (log.nim && log.nim.toLowerCase().includes(q))
    );
  }, [allAttendanceLogs, searchQuery]);

  const totalRegistered = currentSchedule?.totalStudents || 20;
  const totalAttended = allAttendanceLogs.length;
  const totalAbsent = Math.max(0, totalRegistered - totalAttended);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Rekap Kehadiran"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Session Info Card */}
        {currentSchedule && (
          <Card style={styles.sessionCard}>
            <View style={styles.sessionHeaderRow}>
              <View style={styles.sessionIconBox}>
                <Ionicons name="book" size={18} color={APP_COLORS.primary} />
              </View>
              <View style={styles.sessionTitleGroup}>
                <Text style={styles.courseName}>{currentSchedule.courseName}</Text>
                <Text style={styles.sessionMeta}>
                  {currentSchedule.className} • {currentSchedule.time} | {currentSchedule.room}
                </Text>
              </View>
              <StatusBadge status={currentSchedule.status} size="sm" />
            </View>
          </Card>
        )}

        {/* 4 Compact Summary Metrics */}
        <SummaryTile
          hadir={totalAttended}
          izin={0}
          alfa={totalAbsent}
          total={totalRegistered}
        />

        {/* Section Daftar Mahasiswa */}
        <View style={styles.studentListSection}>
          <Text style={styles.sectionTitle}>Daftar Mahasiswa</Text>

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
                style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={16} color={APP_COLORS.neutral500} />
              </Pressable>
            )}
          </View>

          {/* Student Table or Empty State */}
          {filteredAttendanceLogs.length === 0 ? (
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
                  : 'Belum ada catatan presensi praktikan untuk sesi praktikum ini.'
              }
            />
          ) : (
            <View style={styles.tableContainer}>
              {/* Table Header Row */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableColHeader, styles.colNo]}>No</Text>
                <Text style={[styles.tableColHeader, styles.colName]}>Nama</Text>
                <Text style={[styles.tableColHeader, styles.colStatus]}>Status</Text>
              </View>

              {/* Table Data Rows */}
              {filteredAttendanceLogs.map((log, index) => (
                <Pressable
                  key={log.id}
                  onPress={() =>
                    navigation.navigate('AttendanceDetail', {
                      record: log,
                      schedule: currentSchedule,
                    })
                  }
                  style={({ pressed }) => [
                    styles.tableDataRow,
                    index % 2 === 1 && styles.tableRowAlt,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.tableCellText, styles.colNo]}>{index + 1}</Text>
                  <View style={styles.colName}>
                    <Text style={styles.studentNameText} numberOfLines={1}>
                      {log.studentName}
                    </Text>
                    <Text style={styles.studentNimText}>NIM {log.nim}</Text>
                  </View>
                  <View style={styles.colStatus}>
                    <StatusBadge status={log.status} size="sm" />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        role="assistant"
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
    marginBottom: APP_SPACING.sm,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  sessionTitleGroup: {
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
  studentListSection: {
    marginTop: APP_SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: APP_SPACING.sm,
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
  clearSearchBtn: {
    padding: 4,
  },
  tableContainer: {
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
  tableColHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.textSecondary,
  },
  tableDataRow: {
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
    width: 32,
    textAlign: 'center',
  },
  colName: {
    flex: 1,
    paddingHorizontal: APP_SPACING.sm,
  },
  colStatus: {
    width: 80,
    alignItems: 'flex-end',
  },
  tableCellText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
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

export default SessionRecapScreen;
