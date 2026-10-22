/**
 * StudentHistoryScreen Component
 * Screen for Student to see their personal attendance history
 * Follows DSG.md Section 19 & PRD SRS-STU-004
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface StudentHistoryScreenProps {
  navigation: NavigationProp;
}

export const StudentHistoryScreen: React.FC<StudentHistoryScreenProps> = ({
  navigation,
}) => {
  const { activeUser, getStudentHistory } = useApp();

  const historyLogs = getStudentHistory(activeUser.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Dashboard">
          <Ionicons name="arrow-back" size={22} color={APP_COLORS.neutral950} />
        </Pressable>
        <Text style={styles.navTitle}>Catatan Kehadiran</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Student Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="school" size={22} color={APP_COLORS.opened} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{activeUser.name}</Text>
              <Text style={styles.profileMeta}>
                NIM: {activeUser.nim || '-'} • {activeUser.department || 'Mahasiswa'}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{historyLogs.length}</Text>
              <Text style={styles.statLabel}>Total Kehadiran</Text>
            </View>
          </View>
        </Card>

        {/* History List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionHeading}>Riwayat Praktikum</Text>

          {historyLogs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <EmptyState
                iconName="calendar-outline"
                title="Belum Ada Riwayat"
                description="Anda belum memiliki catatan kehadiran praktikum. Presensi Anda akan otomatis tercatat di sini."
                actionTitle="Kembali ke Dashboard"
                onActionPress={() => navigation.goBack()}
              />
            </Card>
          ) : (
            historyLogs.map((log) => (
              <Card key={log.id} style={styles.historyCard}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.courseName}>
                    {log.schedule?.courseName || 'Praktikum'}
                  </Text>
                  <StatusBadge status="HADIR" size="sm" />
                </View>

                {log.schedule?.className && (
                  <Text style={styles.classInfo}>
                    {log.schedule.className} • {log.schedule.room}
                  </Text>
                )}

                <View style={styles.divider} />

                <View style={styles.timeRow}>
                  <View style={styles.timeItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={APP_COLORS.neutral500}
                    />
                    <Text style={styles.timeText}>{log.date}</Text>
                  </View>

                  <View style={styles.timeItem}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={APP_COLORS.neutral500}
                    />
                    <Text style={styles.timeText}>{log.timestamp}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.neutral50,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.neutral200,
  },
  backBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  placeholder: {
    width: 32,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    padding: APP_SPACING.xl,
    paddingBottom: APP_SPACING.xxxl * 2,
  },
  profileCard: {
    marginBottom: APP_SPACING.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLORS.openedSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  profileMeta: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  statsRow: {
    marginTop: APP_SPACING.md,
    paddingTop: APP_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
  },
  statBox: {
    backgroundColor: APP_COLORS.primary50,
    borderRadius: APP_RADIUS.md,
    paddingVertical: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  listSection: {
    marginTop: APP_SPACING.xs,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.md,
  },
  emptyCard: {
    padding: 0,
  },
  historyCard: {
    marginBottom: APP_SPACING.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classInfo: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.md,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: APP_COLORS.neutral700,
  },
});

export default StudentHistoryScreen;

