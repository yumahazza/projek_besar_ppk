/**
 * SessionRecapScreen Component
 * Screen for Assistant to view attendance recap list and close the session
 * Follows DSG.md Section 20 & PRD SRS-AST-003/005, SRS-UI-003
 */

import React, { useState } from 'react';
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
import { CustomButton } from '@/components/CustomButton';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmModal } from '@/components/ConfirmModal';
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
  const { activeSchedule, schedules, getAttendanceForSchedule, closeSession } =
    useApp();

  const [closeModalVisible, setCloseModalVisible] = useState(false);

  const currentSchedule = activeSchedule || schedules[0];
  const attendanceLogs = currentSchedule
    ? getAttendanceForSchedule(currentSchedule.id)
    : [];

  const handleCloseSession = () => {
    if (currentSchedule) {
      closeSession(currentSchedule.id);
    }
    setCloseModalVisible(false);
  };

  const attendanceRatio = currentSchedule
    ? attendanceLogs.length / (currentSchedule.totalStudents || 1)
    : 0;

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
        <Text style={styles.navTitle}>Rekap Presensi</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Schedule Info Summary Card */}
        {currentSchedule && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View style={styles.summaryTextGroup}>
                <Text style={styles.courseTitle}>
                  {currentSchedule.courseName}
                </Text>
                <Text style={styles.classSubtitle}>
                  {currentSchedule.className} • {currentSchedule.room}
                </Text>
                <Text style={styles.timeSubtitle}>
                  {currentSchedule.time} • {currentSchedule.date}
                </Text>
              </View>
              <StatusBadge status={currentSchedule.status} size="sm" />
            </View>

            {/* Attendance Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Tingkat Kehadiran</Text>
                <Text style={styles.progressStats}>
                  <Text style={styles.progressHighlight}>
                    {attendanceLogs.length}
                  </Text>{' '}
                  / {currentSchedule.totalStudents} Mahasiswa
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, Math.round(attendanceRatio * 100))}%` },
                  ]}
                />
              </View>
            </View>

            {/* Close Session CTA if still open */}
            {currentSchedule.status === 'DIBUKA' && (
              <View style={styles.closeActionContainer}>
                <CustomButton
                  title="Tutup Sesi Praktikum"
                  variant="danger"
                  leftIcon={
                    <Ionicons name="stop" size={16} color={APP_COLORS.white} />
                  }
                  onPress={() => setCloseModalVisible(true)}
                  size="sm"
                />
              </View>
            )}
          </Card>
        )}

        {/* Attendance List Section */}
        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Daftar Mahasiswa Hadir</Text>

          {attendanceLogs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <EmptyState
                iconName="people-outline"
                title="Belum Ada Presensi"
                description="Belum ada praktikan yang mencatatkan kehadiran pada sesi ini. Data akan otomatis terupdate saat praktikan melakukan presensi."
              />
            </Card>
          ) : (
            attendanceLogs.map((item, index) => (
              <Card key={item.id} style={styles.attendeeCard}>
                <View style={styles.attendeeRow}>
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.attendeeDetails}>
                    <Text style={styles.attendeeName}>{item.studentName}</Text>
                    <Text style={styles.attendeeNim}>NIM: {item.nim}</Text>
                  </View>
                  <View style={styles.attendeeTimeCol}>
                    <View style={styles.statusPill}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.statusPillText}>Hadir</Text>
                    </View>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Close Session Confirmation Modal */}
      <ConfirmModal
        visible={closeModalVisible}
        title="Tutup Sesi Praktikum?"
        subtitle="Setelah sesi ditutup, praktikan tidak dapat melakukan presensi kehadiran lagi."
        details={{
          courseName: currentSchedule?.courseName,
          className: currentSchedule?.className,
          time: currentSchedule?.time,
          room: currentSchedule?.room,
        }}
        confirmText="Tutup Sesi"
        cancelText="Batal"
        confirmVariant="danger"
        onConfirm={handleCloseSession}
        onCancel={() => setCloseModalVisible(false)}
      />
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
  summaryCard: {
    marginBottom: APP_SPACING.xl,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryTextGroup: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classSubtitle: {
    fontSize: 14,
    color: APP_COLORS.neutral700,
    marginTop: 2,
  },
  timeSubtitle: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: APP_SPACING.lg,
    paddingTop: APP_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral500,
  },
  progressStats: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
  },
  progressHighlight: {
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: APP_COLORS.neutral200,
    borderRadius: APP_RADIUS.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: APP_COLORS.primary,
    borderRadius: APP_RADIUS.pill,
  },
  closeActionContainer: {
    marginTop: APP_SPACING.lg,
  },
  listSection: {
    marginTop: APP_SPACING.sm,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.md,
  },
  emptyCard: {
    padding: 0,
  },
  attendeeCard: {
    marginBottom: APP_SPACING.sm,
    padding: APP_SPACING.md,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  indexNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral700,
  },
  attendeeDetails: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  attendeeNim: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  attendeeTimeCol: {
    alignItems: 'flex-end',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
    gap: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  timestampText: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    marginTop: 4,
  },
});

export default SessionRecapScreen;

