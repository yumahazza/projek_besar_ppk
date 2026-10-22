/**
 * AssistantHomeScreen Component
 * Screen for Assistant to view active schedules and control session status
 * Follows DSG.md Section 14 & PRD SRS-AST-001/002/003/004
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomButton } from '@/components/CustomButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface AssistantHomeScreenProps {
  navigation: NavigationProp;
}

export const AssistantHomeScreen: React.FC<AssistantHomeScreenProps> = ({
  navigation,
}) => {
  const {
    schedules,
    activeSchedule,
    setActiveScheduleId,
    openSession,
    closeSession,
    getAttendanceForSchedule,
  } = useApp();

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    action: 'open' | 'close';
    scheduleId: string;
  }>({
    visible: false,
    action: 'open',
    scheduleId: '',
  });

  const currentSchedule = activeSchedule || schedules[0];
  const attendanceList = currentSchedule
    ? getAttendanceForSchedule(currentSchedule.id)
    : [];

  const handleOpenSessionModal = (scheduleId: string) => {
    setConfirmModal({
      visible: true,
      action: 'open',
      scheduleId,
    });
  };

  const handleCloseSessionModal = (scheduleId: string) => {
    setConfirmModal({
      visible: true,
      action: 'close',
      scheduleId,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.action === 'open') {
      openSession(confirmModal.scheduleId);
    } else {
      closeSession(confirmModal.scheduleId);
    }
    setConfirmModal({ visible: false, action: 'open', scheduleId: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard Asisten</Text>
          <Text style={styles.sectionSubtitle}>
            Kelola sesi praktikum dan pantau kehadiran mahasiswa
          </Text>
        </View>

        {/* Active Schedule Card */}
        {currentSchedule && (
          <Card
            style={styles.activeCard}
            highlighted={currentSchedule.status === 'DIBUKA'}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.badgeWrapper}>
                <StatusBadge status={currentSchedule.status} size="md" />
              </View>
              <Text style={styles.dateText}>{currentSchedule.date}</Text>
            </View>

            <Text style={styles.courseTitle}>{currentSchedule.courseName}</Text>
            <Text style={styles.classSubtitle}>{currentSchedule.className}</Text>

            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={APP_COLORS.neutral500}
                />
                <Text style={styles.metaText}>{currentSchedule.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={APP_COLORS.neutral500}
                />
                <Text style={styles.metaText}>{currentSchedule.room}</Text>
              </View>
            </View>

            {/* Attendance quick counter */}
            <View style={styles.attendanceCounterRow}>
              <Ionicons
                name="people-outline"
                size={16}
                color={APP_COLORS.primary500}
              />
              <Text style={styles.counterText}>
                Presensi saat ini:{' '}
                <Text style={styles.counterHighlight}>
                  {attendanceList.length}
                </Text>{' '}
                / {currentSchedule.totalStudents} praktikan
              </Text>
            </View>

            {/* Action Buttons based on status */}
            <View style={styles.actionsContainer}>
              {currentSchedule.status === 'BELUM_DIBUKA' && (
                <CustomButton
                  title="Buka Sesi Praktikum"
                  variant="primary"
                  leftIcon={
                    <Ionicons
                      name="play"
                      size={18}
                      color={APP_COLORS.white}
                    />
                  }
                  onPress={() => handleOpenSessionModal(currentSchedule.id)}
                />
              )}

              {currentSchedule.status === 'DIBUKA' && (
                <View style={styles.buttonStack}>
                  <CustomButton
                    title="Lihat Rekap Presensi"
                    variant="primary"
                    leftIcon={
                      <Ionicons
                        name="list"
                        size={18}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={() => navigation.navigate('SessionRecap')}
                  />
                  <CustomButton
                    title="Tutup Sesi"
                    variant="danger"
                    leftIcon={
                      <Ionicons
                        name="stop"
                        size={18}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={() => handleCloseSessionModal(currentSchedule.id)}
                  />
                </View>
              )}

              {currentSchedule.status === 'SELESAI' && (
                <View style={styles.buttonStack}>
                  <View style={styles.sessionFinishedNotice}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={APP_COLORS.finished}
                    />
                    <Text style={styles.sessionFinishedText}>
                      Sesi praktikum telah ditutup
                    </Text>
                  </View>
                  <CustomButton
                    title="Lihat Rekap Presensi"
                    variant="secondary"
                    leftIcon={
                      <Ionicons
                        name="list"
                        size={18}
                        color={APP_COLORS.primary}
                      />
                    }
                    onPress={() => navigation.navigate('SessionRecap')}
                  />
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Other Schedules List */}
        <View style={styles.otherScheduleSection}>
          <Text style={styles.otherScheduleTitle}>Daftar Semua Jadwal</Text>
          {schedules.map((item) => {
            const isSelected = item.id === currentSchedule?.id;
            const logCount = getAttendanceForSchedule(item.id).length;

            return (
              <Card
                key={item.id}
                onPress={() => setActiveScheduleId(item.id)}
                style={[
                  styles.scheduleItemCard,
                  isSelected && styles.scheduleItemSelected,
                ]}>
                <View style={styles.scheduleItemTop}>
                  <View style={styles.scheduleItemInfo}>
                    <Text style={styles.itemCourseName}>
                      {item.courseName} — {item.className}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.time} • {item.room}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="sm" />
                </View>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemAttendance}>
                    {logCount} / {item.totalStudents} hadir
                  </Text>
                  {isSelected && (
                    <Text style={styles.activeLabel}>Sedang Dipilih</Text>
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModal.visible}
        title={
          confirmModal.action === 'open'
            ? 'Buka Sesi Praktikum?'
            : 'Tutup Sesi Praktikum?'
        }
        subtitle={
          confirmModal.action === 'open'
            ? 'Praktikan akan dapat melakukan presensi kehadiran setelah sesi dibuka.'
            : 'Setelah sesi ditutup, praktikan tidak akan dapat melakukan presensi kehadiran lagi.'
        }
        details={{
          courseName: currentSchedule?.courseName,
          className: currentSchedule?.className,
          time: currentSchedule?.time,
          room: currentSchedule?.room,
        }}
        confirmText={
          confirmModal.action === 'open' ? 'Ya, Buka Sesi' : 'Tutup Sesi'
        }
        cancelText="Batal"
        confirmVariant={confirmModal.action === 'open' ? 'primary' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmModal({ visible: false, action: 'open', scheduleId: '' })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: APP_COLORS.neutral50,
  },
  scrollContent: {
    padding: APP_SPACING.xl,
    paddingBottom: APP_SPACING.xxxl * 2,
  },
  sectionHeader: {
    marginBottom: APP_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: APP_COLORS.neutral500,
    marginTop: 4,
  },
  activeCard: {
    marginBottom: APP_SPACING.xxl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  badgeWrapper: {},
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_COLORS.neutral500,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  metaDivider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: APP_SPACING.lg,
    marginBottom: APP_SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
  },
  attendanceCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.primary50,
    paddingVertical: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    gap: 8,
    marginBottom: APP_SPACING.lg,
  },
  counterText: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
  },
  counterHighlight: {
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  actionsContainer: {
    marginTop: APP_SPACING.xs,
  },
  buttonStack: {
    gap: APP_SPACING.sm,
  },
  sessionFinishedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.md,
    marginBottom: APP_SPACING.xs,
  },
  sessionFinishedText: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.finished,
  },
  otherScheduleSection: {
    marginTop: APP_SPACING.sm,
  },
  otherScheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.md,
  },
  scheduleItemCard: {
    marginBottom: APP_SPACING.md,
    padding: APP_SPACING.md,
  },
  scheduleItemSelected: {
    borderColor: APP_COLORS.primary500,
    borderWidth: 1.5,
  },
  scheduleItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleItemInfo: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  itemCourseName: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  itemMeta: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: APP_SPACING.sm,
    paddingTop: APP_SPACING.xs,
  },
  itemAttendance: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
});

export default AssistantHomeScreen;

