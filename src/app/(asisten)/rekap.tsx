import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePracticum } from '@/context/PracticumContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function AsistenRekapScreen() {
  const { sessions, getSessionAttendance } = usePracticum();
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?.id || ''
  );

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const attendanceList = currentSession ? getSessionAttendance(currentSession.id) : [];

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
          {sessions.map((session) => {
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
                  {session.name} ({session.classId})
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
                  <Text style={styles.sessionTitle}>{currentSession.name}</Text>
                  <Text style={styles.sessionMeta}>
                    {currentSession.classId} • {currentSession.room}
                  </Text>
                  <Text style={styles.sessionTime}>
                    {currentSession.date} • {currentSession.startTime} –{' '}
                    {currentSession.endTime} WIB
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
                  <Ionicons name="people" size={18} color={Colors.primary} />
                </View>
              </View>
            </View>

            {/* Attendance List Title */}
            <Text style={styles.listSectionTitle}>Daftar Mahasiswa Hadir</Text>

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
                        <Text style={styles.studentName}>{record.studentName}</Text>
                        <Text style={styles.studentNim}>NIM: {record.studentNim}</Text>
                        <View style={styles.timestampRow}>
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color={Colors.textSecondary}
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
                        color={Colors.success}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabContainer: {
    paddingVertical: Spacing.md,
  },
  tabScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  sessionTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sessionTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sessionTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    shadowColor: Colors.cardShadow,
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
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  recapStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {},
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  statUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  statBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  studentNim: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
  },
  presentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  presentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
});
