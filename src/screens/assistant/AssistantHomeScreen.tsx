/**
 * AssistantHomeScreen Component
 * Programmer: Fritz (Flow Asisten & Pengelolaan Sesi)
 * SRS-AST-001: Daftar jadwal praktikum & informasi detailnya
 * SRS-AST-002: Buka sesi praktikum (BELUM_DIBUKA -> DIBUKA)
 * SRS-AST-003: Tutup sesi praktikum (DIBUKA -> SELESAI)
 * SRS-AST-004: Modal konfirmasi sebelum buka / tutup sesi
 * SRS-AST-005: Akses rekapitulasi kehadiran praktikan
 * Follows DSG.md Section 10, 13, 14, 17, 23, 25
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

interface BannerNotification {
  visible: boolean;
  type: 'success' | 'info';
  message: string;
}

export const AssistantHomeScreen: React.FC<AssistantHomeScreenProps> = ({
  navigation,
}) => {
  const {
    activeUser,
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

  const [notification, setNotification] = useState<BannerNotification>({
    visible: false,
    type: 'success',
    message: '',
  });

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ visible: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const currentSchedule = activeSchedule || schedules[0];
  const attendanceList = currentSchedule
    ? getAttendanceForSchedule(currentSchedule.id)
    : [];

  const targetScheduleForModal = schedules.find(
    (s) => s.id === confirmModal.scheduleId
  ) || currentSchedule;

  // SRS-AST-004: Buka modal konfirmasi sebelum aksi
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

  // Eksekusi aksi setelah konfirmasi pengguna
  const handleConfirmAction = () => {
    const { action, scheduleId } = confirmModal;
    const target = schedules.find((s) => s.id === scheduleId) || currentSchedule;

    if (action === 'open') {
      // SRS-AST-002: Status berubah ke DIBUKA
      openSession(scheduleId);
      showNotification(
        `Sesi "${target?.courseName} - ${target?.className}" berhasil DIBUKA. Praktikan sekarang dapat melakukan presensi!`,
        'success'
      );
    } else {
      // SRS-AST-003: Status berubah ke SELESAI
      closeSession(scheduleId);
      showNotification(
        `Sesi "${target?.courseName} - ${target?.className}" telah DITUTUP. Presensi sudah diakhiri.`,
        'info'
      );
    }
    setConfirmModal({ visible: false, action: 'open', scheduleId: '' });
  };

  const attendancePercent = currentSchedule && currentSchedule.totalStudents > 0
    ? Math.round((attendanceList.length / currentSchedule.totalStudents) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Banner Notifikasi Aksi */}
        {notification.visible && (
          <View
            style={[
              styles.notificationBanner,
              notification.type === 'success'
                ? styles.bannerSuccess
                : styles.bannerInfo,
            ]}>
            <Ionicons
              name={
                notification.type === 'success'
                  ? 'checkmark-circle'
                  : 'information-circle'
              }
              size={20}
              color={
                notification.type === 'success'
                  ? APP_COLORS.opened
                  : APP_COLORS.primary
              }
            />
            <Text style={styles.notificationText}>{notification.message}</Text>
            <Pressable
              onPress={() => setNotification((prev) => ({ ...prev, visible: false }))}
              style={styles.closeNotification}>
              <Ionicons name="close" size={16} color={APP_COLORS.neutral500} />
            </Pressable>
          </View>
        )}

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard Asisten</Text>
          <Text style={styles.sectionSubtitle}>
            Pantau jadwal praktikum, kontrol sesi kehadiran, dan tinjau rekap mahasiswa
          </Text>
        </View>

        {/* SRS-AST-001: Active Schedule Hero Card */}
        {currentSchedule && (
          <Card
            style={styles.activeCard}
            highlighted={currentSchedule.status === 'DIBUKA'}>
            {/* Header Card: Status Badge & Date */}
            <View style={styles.cardHeaderRow}>
              <StatusBadge status={currentSchedule.status} size="md" />
              <View style={styles.dateBadge}>
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={APP_COLORS.neutral500}
                />
                <Text style={styles.dateText}>{currentSchedule.date}</Text>
              </View>
            </View>

            {/* Course Title & Class Info */}
            <Text style={styles.courseTitle}>{currentSchedule.courseName}</Text>
            <Text style={styles.classSubtitle}>{currentSchedule.className}</Text>

            {/* Session Status Live Banner (if DIBUKA) */}
            {currentSchedule.status === 'DIBUKA' && (
              <View style={styles.liveSessionBadge}>
                <View style={styles.pulsingDot} />
                <Text style={styles.liveSessionText}>
                  SESI SEDANG DIBUKA • Presensi Aktif
                </Text>
              </View>
            )}

            <View style={styles.metaDivider} />

            {/* Schedule Metadata Grid */}
            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <View style={styles.metaIconCircle}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={APP_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.metaLabel}>Waktu</Text>
                  <Text style={styles.metaValue}>{currentSchedule.time}</Text>
                </View>
              </View>

              <View style={styles.metaItem}>
                <View style={styles.metaIconCircle}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={APP_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.metaLabel}>Ruangan</Text>
                  <Text style={styles.metaValue}>{currentSchedule.room}</Text>
                </View>
              </View>

              <View style={styles.metaItem}>
                <View style={styles.metaIconCircle}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={APP_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.metaLabel}>Asisten Pengampu</Text>
                  <Text style={styles.metaValue}>
                    {currentSchedule.assistantName || activeUser.name}
                  </Text>
                </View>
              </View>
            </View>

            {/* SRS-AST-005: Attendance Quick Summary Bar */}
            <View style={styles.attendanceSummaryBox}>
              <View style={styles.attendanceSummaryHeader}>
                <View style={styles.attendanceSummaryTitleGroup}>
                  <Ionicons
                    name="people"
                    size={18}
                    color={APP_COLORS.primary}
                  />
                  <Text style={styles.attendanceSummaryTitle}>
                    Kehadiran Mahasiswa
                  </Text>
                </View>
                <Text style={styles.attendanceCountText}>
                  <Text style={styles.attendanceHighlight}>
                    {attendanceList.length}
                  </Text>{' '}
                  / {currentSchedule.totalStudents} ({attendancePercent}%)
                </Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, attendancePercent)}%` },
                  ]}
                />
              </View>
            </View>

            {/* Session Action Buttons based on status */}
            <View style={styles.actionsContainer}>
              {/* SRS-AST-002: Buka Sesi saat BELUM_DIBUKA */}
              {currentSchedule.status === 'BELUM_DIBUKA' && (
                <CustomButton
                  title="Buka Sesi"
                  variant="primary"
                  size="lg"
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

              {/* SRS-AST-003 & SRS-AST-005: Saat DIBUKA */}
              {currentSchedule.status === 'DIBUKA' && (
                <View style={styles.buttonStack}>
                  <CustomButton
                    title="Lihat Rekap Presensi"
                    variant="primary"
                    size="md"
                    leftIcon={
                      <Ionicons
                        name="list"
                        size={18}
                        color={APP_COLORS.white}
                      />
                    }
                    rightIcon={
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={() =>
                      navigation.navigate('SessionRecap', {
                        scheduleId: currentSchedule.id,
                      })
                    }
                  />
                  <CustomButton
                    title="Tutup Sesi"
                    variant="danger"
                    size="md"
                    leftIcon={
                      <Ionicons
                        name="stop-circle"
                        size={18}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={() => handleCloseSessionModal(currentSchedule.id)}
                  />
                </View>
              )}

              {/* Saat SELESAI */}
              {currentSchedule.status === 'SELESAI' && (
                <View style={styles.buttonStack}>
                  <View style={styles.sessionFinishedNotice}>
                    <Ionicons
                      name="checkmark-done-circle"
                      size={20}
                      color={APP_COLORS.finished}
                    />
                    <Text style={styles.sessionFinishedText}>
                      Sesi praktikum telah selesai & ditutup
                    </Text>
                  </View>
                  <CustomButton
                    title="Lihat Rekap Presensi"
                    variant="secondary"
                    size="md"
                    leftIcon={
                      <Ionicons
                        name="list"
                        size={18}
                        color={APP_COLORS.primary}
                      />
                    }
                    rightIcon={
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={APP_COLORS.primary}
                      />
                    }
                    onPress={() =>
                      navigation.navigate('SessionRecap', {
                        scheduleId: currentSchedule.id,
                      })
                    }
                  />
                </View>
              )}
            </View>
          </Card>
        )}

        {/* SRS-AST-001: Daftar Semua Jadwal Praktikum yang Diampu */}
        <View style={styles.scheduleListSection}>
          <View style={styles.scheduleListHeaderRow}>
            <Text style={styles.scheduleListTitle}>Daftar Jadwal Praktikum</Text>
            <Text style={styles.scheduleListCountBadge}>
              {schedules.length} Kelas
            </Text>
          </View>

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
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemCourseName}>
                        {item.courseName}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedPill}>
                          <Text style={styles.selectedPillText}>Aktif</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemClassText}>{item.className}</Text>
                    <Text style={styles.itemMeta}>
                      {item.time} • {item.room}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="sm" />
                </View>

                <View style={styles.itemDivider} />

                <View style={styles.itemFooter}>
                  <View style={styles.itemAttendanceGroup}>
                    <Ionicons
                      name="people-outline"
                      size={14}
                      color={APP_COLORS.neutral500}
                    />
                    <Text style={styles.itemAttendance}>
                      {logCount} / {item.totalStudents} praktikan hadir
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      setActiveScheduleId(item.id);
                      navigation.navigate('SessionRecap', { scheduleId: item.id });
                    }}
                    style={styles.quickRecapLink}>
                    <Text style={styles.quickRecapText}>Rekap</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={APP_COLORS.primary}
                    />
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* SRS-AST-004: Modal Konfirmasi Aksi Buka / Tutup Sesi */}
      <ConfirmModal
        visible={confirmModal.visible}
        title={
          confirmModal.action === 'open'
            ? 'Buka Sesi?'
            : 'Tutup Sesi?'
        }
        subtitle={
          confirmModal.action === 'open'
            ? 'Praktikan akan dapat melakukan presensi setelah sesi dibuka.'
            : 'Setelah sesi ditutup, praktikan tidak dapat melakukan presensi lagi.'
        }
        details={{
          courseName: targetScheduleForModal?.courseName,
          className: targetScheduleForModal?.className,
          time: targetScheduleForModal?.time,
          room: targetScheduleForModal?.room,
        }}
        confirmText={
          confirmModal.action === 'open' ? 'Ya, Buka' : 'Tutup Sesi'
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
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    marginBottom: APP_SPACING.lg,
    borderWidth: 1,
    gap: 8,
  },
  bannerSuccess: {
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#BBF7D0',
  },
  bannerInfo: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: APP_COLORS.neutral950,
    fontWeight: '500',
    lineHeight: 18,
  },
  closeNotification: {
    padding: 4,
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
    lineHeight: 20,
  },
  activeCard: {
    marginBottom: APP_SPACING.xxl,
    padding: APP_SPACING.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: APP_RADIUS.pill,
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_COLORS.neutral700,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.primary,
    marginTop: 2,
  },
  liveSessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.openedSoft,
    paddingVertical: 6,
    paddingHorizontal: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    marginTop: APP_SPACING.md,
    gap: 8,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_COLORS.opened,
  },
  liveSessionText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.opened,
    letterSpacing: 0.3,
  },
  metaDivider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.lg,
  },
  metaGrid: {
    gap: APP_SPACING.md,
    marginBottom: APP_SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
  },
  metaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    color: APP_COLORS.neutral950,
    fontWeight: '600',
    marginTop: 1,
  },
  attendanceSummaryBox: {
    backgroundColor: APP_COLORS.neutral50,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.md,
    marginBottom: APP_SPACING.lg,
  },
  attendanceSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendanceSummaryTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendanceSummaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  attendanceCountText: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
  },
  attendanceHighlight: {
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
    gap: 8,
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.md,
    marginBottom: APP_SPACING.xs,
  },
  sessionFinishedText: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.finished,
  },
  scheduleListSection: {
    marginTop: APP_SPACING.xs,
  },
  scheduleListHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  scheduleListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  scheduleListCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral500,
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
  },
  scheduleItemCard: {
    marginBottom: APP_SPACING.md,
    padding: APP_SPACING.md,
  },
  scheduleItemSelected: {
    borderColor: APP_COLORS.primary500,
    borderWidth: 1.5,
    backgroundColor: '#FAF5FF',
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
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCourseName: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  selectedPill: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: APP_RADIUS.pill,
  },
  selectedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  itemClassText: {
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.primary,
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  itemAttendanceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemAttendance: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  quickRecapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  quickRecapText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
});

export default AssistantHomeScreen;
