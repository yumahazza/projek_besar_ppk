
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';

export default function AsistenRekapScreen() {
  const { schedules, getAttendanceForSchedule } = useApp();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    schedules[0]?.id || ''
  );

  const currentSession =
    schedules.find((schedule) => schedule.id === selectedSessionId) ||
    schedules[0];

  const attendanceList = currentSession
    ? getAttendanceForSchedule(currentSession.id)
    : [];

  return (
    <ResponsiveContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Rekap Kehadiran</Text>
        <Text style={styles.subtitle}>
          Daftar rekapitulasi kehadiran praktikan per sesi praktikum
        </Text>
      </View>

      {/* Session Horizontal Selector Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}>
          {schedules.map((session) => {
            const isSelected = (currentSession?.id || '') === session.id;
            return (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionTab, isSelected && styles.sessionTabActive]}
                onPress={() => setSelectedSessionId(session.id)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.sessionTabText,
                    isSelected && styles.sessionTabTextActive,
                  ]}>
                  {session.courseName} ({session.className})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {currentSession ? (
          <View>
            {/* Session Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle}>
                    {currentSession.courseName}
                  </Text>
                  <Text style={styles.sessionMeta}>
                    {currentSession.className} • {currentSession.room}
                  </Text>
                  <Text style={styles.sessionTime}>
                    {currentSession.date} • {currentSession.time}
                  </Text>
                </View>
                <StatusBadge status={currentSession.status} size="sm" />
              </View>

              <View style={styles.divider} />

              <View style={styles.recapStatRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Total Hadir</Text>
                  <Text style={styles.statValue}>
                    {attendanceList.length}{' '}
                    <Text style={styles.statUnit}>Praktikan</Text>
                  </Text>
                </View>
                <View style={styles.statBadge}>
                  <Ionicons
                    name="people"
                    size={18}
                    color={APP_COLORS.primary}
                  />
                </View>
              </View>
            </View>

            {/* Attendance List Title */}
            <Text style={styles.listSectionTitle}>
              Daftar Mahasiswa Hadir
            </Text>

            {attendanceList.length === 0 ? (
              <EmptyState
                icon="people-outline"
                title="Belum ada praktikan presensi"
                description="Daftar praktikan yang hadir akan muncul di sini setelah ada presensi pada sesi ini."
              />
            ) : (
              <View style={styles.listContainer}>
                {attendanceList.map((record, index) => (
                  <View key={record.id} style={styles.studentCard}>
                    <View style={styles.studentLeft}>
                      <View style={styles.indexCircle}>
                        <Text style={styles.indexText}>{index + 1}</Text>
                      </View>
                      <View>
                        <Text style={styles.studentName}>
                          {record.studentName}
                        </Text>
                        <Text style={styles.studentNim}>
                          NIM: {record.nim}
                        </Text>
                        <View style={styles.timestampRow}>
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color={APP_COLORS.neutral500}
                          />
                          <Text style={styles.timestampText}>
                            Presensi: {record.timestamp}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.presentBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.presentText}>Hadir</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <EmptyState
            title="Sesi Tidak Ditemukan"
            description="Pilih salah satu sesi praktikum untuk melihat rekap kehadiran."
          />
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.lg,
    paddingBottom: APP_SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.neutral950,
  },
  subtitle: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  tabContainer: {
    paddingVertical: APP_SPACING.md,
  },
  tabScroll: {
    paddingHorizontal: APP_SPACING.lg,
    gap: APP_SPACING.sm,
  },
  sessionTab: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 7,
    borderRadius: APP_RADIUS.pill,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
  },
  sessionTabActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  sessionTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral500,
  },
  sessionTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: APP_SPACING.lg,
    paddingTop: APP_SPACING.xs,
    paddingBottom: APP_SPACING.xxl,
  },
  summaryCard: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.lg,
    padding: APP_SPACING.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    marginBottom: APP_SPACING.xl,
    shadowColor: APP_COLORS.neutral950,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral100,
    marginVertical: APP_SPACING.md,
  },
  recapStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {},
  statLabel: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: APP_COLORS.primary,
  },
  statUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.neutral500,
  },
  statBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_COLORS.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.md,
  },
  listContainer: {
    gap: APP_SPACING.sm,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.white,
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
    flex: 1,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.neutral500,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  studentNim: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 1,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  timestampText: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
  },
  presentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 3,
    borderRadius: APP_RADIUS.sm,
  },
  presentText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.opened,
  },
});
