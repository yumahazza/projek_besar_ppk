import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp, AttendanceResult } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomButton } from '@/components/CustomButton';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HeaderRolePicker } from '@/components/HeaderRolePicker';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
  APP_SHADOWS,
} from '@/constants/theme';

interface StudentHomeScreenProps {
  navigation: NavigationProp;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  navigation,
}) => {
  const {
    activeUser,
    activeSchedule,
    schedules,
    setActiveScheduleId,
    submitAttendance,
    hasStudentAttended,
    getStudentAttendanceForSchedule,
  } = useApp();

  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    success: boolean;
    message: string;
    timestamp?: string;
  }>({
    visible: false,
    success: false,
    message: '',
  });

  const currentSchedule = activeSchedule || schedules[0];
  const isAttended = currentSchedule
    ? hasStudentAttended(currentSchedule.id, activeUser.id)
    : false;

  const studentRecord = currentSchedule
    ? getStudentAttendanceForSchedule(currentSchedule.id, activeUser.id)
    : undefined;

  const isSessionOpen = currentSchedule?.status === 'DIBUKA';

  const handleAttendancePress = () => {
    if (!currentSchedule) return;
    const result: AttendanceResult = submitAttendance(currentSchedule.id);
    setFeedbackModal({
      visible: true,
      success: result.success,
      message: result.message,
      timestamp: result.timestamp,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="PPK"
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Section with Role Switcher */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextGroup}>
            <Text style={styles.greetingName}>
              Halo, {activeUser.name.split(' ')[0]} 👋
            </Text>
            <Text style={styles.greetingRole}>
              Praktikan · NIM {activeUser.nim || '-'}
            </Text>
          </View>
          <HeaderRolePicker compact />
        </View>

        {/* Main Schedule & Presensi Card */}
        {currentSchedule && (
          <Card
            style={[
              styles.mainCard,
              isSessionOpen && !isAttended && styles.mainCardOpen,
            ]}>
            {/* Header: StatusBadge & Date */}
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardSubtitleLabel}>Sesi Praktikum</Text>
                <Text style={styles.courseTitle}>{currentSchedule.courseName}</Text>
              </View>
              <StatusBadge status={currentSchedule.status} size="sm" />
            </View>

            <Text style={styles.courseMeta}>
              {currentSchedule.className} • {currentSchedule.time} | {currentSchedule.room}
            </Text>

            {/* Live Indicator Banner */}
            {isSessionOpen && !isAttended && (
              <View style={styles.liveBanner}>
                <View style={styles.pulsingDot} />
                <Text style={styles.liveBannerText}>
                  Sesi Sedang Dibuka • Presensi Aktif Sekarang
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            {/* Attendance CTA Section */}
            <View style={styles.ctaContainer}>
              {isAttended ? (
                /* Kasus Sudah Presensi */
                <View style={styles.attendedBox}>
                  <View style={styles.attendedTitleRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={APP_COLORS.opened}
                    />
                    <Text style={styles.attendedTitle}>Kehadiran Tercatat</Text>
                  </View>
                  {studentRecord && (
                    <Text style={styles.timestampText}>
                      Waktu Presensi: {studentRecord.timestamp}
                    </Text>
                  )}
                  <CustomButton
                    title="✓ Sudah Presensi"
                    variant="outline"
                    disabled
                    size="md"
                    onPress={() => {}}
                    style={styles.attendedBtn}
                  />
                </View>
              ) : isSessionOpen ? (
                /* Kasus Sesi Dibuka & Belum Presensi */
                <View>
                  <CustomButton
                    title="Presensi Sekarang"
                    variant="primary"
                    size="lg"
                    leftIcon={
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={handleAttendancePress}
                  />
                  <Text style={styles.ctaHint}>
                    Tekan tombol untuk mencatatkan kehadiran Anda di sesi ini
                  </Text>
                </View>
              ) : currentSchedule.status === 'BELUM_DIBUKA' ? (
                /* Kasus Belum Dibuka */
                <View style={styles.disabledBox}>
                  <Text style={styles.disabledText}>
                    Sesi praktikum belum dibuka oleh asisten.
                  </Text>
                  <CustomButton
                    title="Presensi Belum Dibuka"
                    variant="outline"
                    disabled
                    size="md"
                    onPress={() => {}}
                  />
                </View>
              ) : (
                /* Kasus Selesai */
                <View style={styles.disabledBox}>
                  <Text style={styles.disabledText}>
                    Sesi praktikum telah ditutup. Presensi berakhir.
                  </Text>
                  <CustomButton
                    title="Sesi Telah Ditutup"
                    variant="outline"
                    disabled
                    size="md"
                    onPress={() => {}}
                  />
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Section Jadwal Hari Ini */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Jadwal Hari Ini</Text>
          <Pressable
            onPress={() => navigation.navigate('ScheduleList')}
            style={({ pressed }) => pressed && styles.pressed}>
            <Text style={styles.seeAllText}>Lihat Semua &gt;</Text>
          </Pressable>
        </View>

        {/* Schedule List */}
        <View style={styles.scheduleList}>
          {schedules.map((item, idx) => {
            const isSelected = item.id === currentSchedule?.id;
            return (
              <Card
                key={item.id}
                onPress={() => {
                  setActiveScheduleId(item.id);
                  navigation.navigate('SessionDetail', { scheduleId: item.id });
                }}
                style={[
                  styles.scheduleItemCard,
                  isSelected && styles.scheduleItemSelected,
                ]}>
                <View style={styles.scheduleRowContent}>
                  <View style={styles.courseIndexBadge}>
                    <Text style={styles.courseIndexText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.courseInfoCol}>
                    <Text style={styles.courseNameText}>{item.courseName}</Text>
                    <Text style={styles.courseMetaText}>
                      {item.time} | {item.room}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="sm" />
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Feedback Modal Presensi */}
      <Modal
        visible={feedbackModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackModal((prev) => ({ ...prev, visible: false }))}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, APP_SHADOWS.modal]}>
            <View
              style={[
                styles.feedbackIconBox,
                feedbackModal.success
                  ? styles.feedbackSuccessBox
                  : styles.feedbackErrorBox,
              ]}>
              <Ionicons
                name={feedbackModal.success ? 'checkmark-circle' : 'alert-circle'}
                size={40}
                color={
                  feedbackModal.success ? APP_COLORS.opened : APP_COLORS.danger
                }
              />
            </View>
            <Text style={styles.modalFeedbackTitle}>
              {feedbackModal.success ? 'Presensi Berhasil!' : 'Presensi Gagal'}
            </Text>
            <Text style={styles.modalFeedbackMessage}>
              {feedbackModal.message}
            </Text>
            {feedbackModal.timestamp ? (
              <View style={styles.modalTimeBox}>
                <Ionicons name="time-outline" size={16} color={APP_COLORS.primary} />
                <Text style={styles.modalTimeText}>
                  Waktu: {feedbackModal.timestamp}
                </Text>
              </View>
            ) : null}
            <CustomButton
              title="Tutup"
              variant="primary"
              size="md"
              onPress={() => setFeedbackModal((prev) => ({ ...prev, visible: false }))}
            />
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation
        role="student"
        activeTab="StudentHome"
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
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: APP_SPACING.md,
  },
  greetingTextGroup: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
  },
  greetingRole: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginTop: 2,
  },
  mainCard: {
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  mainCardOpen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardSubtitleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginTop: 2,
  },
  courseMeta: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.sm,
  },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: APP_COLORS.opened,
    marginRight: 6,
  },
  liveBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.opened,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.border,
    marginVertical: APP_SPACING.md,
  },
  ctaContainer: {
    marginTop: 2,
  },
  attendedBox: {
    alignItems: 'center',
    paddingVertical: APP_SPACING.xs,
  },
  attendedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  attendedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  timestampText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.md,
  },
  attendedBtn: {
    width: '100%',
    backgroundColor: '#F8FAFC',
  },
  ctaHint: {
    fontSize: 12,
    color: APP_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  disabledBox: {
    alignItems: 'center',
    gap: 10,
  },
  disabledText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: APP_SPACING.lg,
    marginBottom: APP_SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  scheduleList: {
    gap: APP_SPACING.sm,
  },
  scheduleItemCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  scheduleItemSelected: {
    borderColor: APP_COLORS.primary,
  },
  scheduleRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  courseIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  courseInfoCol: {
    flex: 1,
  },
  courseNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
    marginBottom: 2,
  },
  courseMetaText: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.modal,
    padding: APP_SPACING.xl,
    alignItems: 'center',
  },
  feedbackIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  feedbackSuccessBox: {
    backgroundColor: '#DCFCE7',
  },
  feedbackErrorBox: {
    backgroundColor: '#FEE2E2',
  },
  modalFeedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 6,
  },
  modalFeedbackMessage: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: APP_SPACING.md,
  },
  modalTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: APP_COLORS.softBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: APP_SPACING.lg,
  },
  modalTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default StudentHomeScreen;
