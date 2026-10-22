/**
 * StudentHomeScreen Component
 * Screen for Student to see schedule, session status, submit attendance, and get success feedback
 * Follows DSG.md Section 15, 16, 18 & PRD SRS-STU-001/002/003, SRS-VAL-001/002
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, AttendanceResult } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomButton } from '@/components/CustomButton';
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
    submitAttendance,
    hasStudentAttended,
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Student Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Presensi Mahasiswa</Text>
          <Text style={styles.welcomeSubtitle}>
            Pastikan Anda berada di ruang praktikum saat melakukan presensi
          </Text>
        </View>

        {/* Main Attendance Focal Card */}
        {currentSchedule && (
          <Card
            style={styles.mainCard}
            highlighted={isSessionOpen && !isAttended}>
            <View style={styles.statusRow}>
              <StatusBadge status={currentSchedule.status} size="md" />
              <Text style={styles.dateText}>{currentSchedule.date}</Text>
            </View>

            <Text style={styles.courseTitle}>{currentSchedule.courseName}</Text>
            <Text style={styles.classSubtitle}>{currentSchedule.className}</Text>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={APP_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Waktu Sesi</Text>
                  <Text style={styles.infoValue}>{currentSchedule.time}</Text>
                </View>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={APP_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Ruangan</Text>
                  <Text style={styles.infoValue}>{currentSchedule.room}</Text>
                </View>
              </View>
            </View>

            {/* Attendance CTA Section */}
            <View style={styles.ctaContainer}>
              {isAttended ? (
                // Already Attended State
                <View style={styles.attendedBox}>
                  <View style={styles.attendedHeaderRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={APP_COLORS.opened}
                    />
                    <Text style={styles.attendedTitle}>Kehadiran Tercatat</Text>
                  </View>
                  <Text style={styles.attendedDescription}>
                    Anda telah berhasil melakukan presensi pada sesi ini.
                  </Text>
                  <CustomButton
                    title="✓ Sudah Presensi"
                    variant="outline"
                    disabled
                    onPress={() => {}}
                    style={styles.attendedBtn}
                  />
                </View>
              ) : isSessionOpen ? (
                // Session is Open and Ready for Attendance
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
                    Tekan tombol di atas untuk mencatatkan kehadiran Anda
                  </Text>
                </View>
              ) : currentSchedule.status === 'BELUM_DIBUKA' ? (
                // Session Not Yet Opened
                <View>
                  <CustomButton
                    title="Presensi Belum Dibuka"
                    variant="outline"
                    disabled
                    size="lg"
                    onPress={() => {}}
                  />
                  <Text style={styles.ctaHint}>
                    Sesi akan aktif setelah asisten membuka praktikum
                  </Text>
                </View>
              ) : (
                // Session Closed / SELESAI
                <View>
                  <CustomButton
                    title="Sesi Telah Ditutup"
                    variant="outline"
                    disabled
                    size="lg"
                    onPress={() => {}}
                  />
                  <Text style={styles.ctaHint}>
                    Presensi untuk sesi ini sudah berakhir dan telah ditutup oleh asisten
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* View History Navigation Button */}
        <View style={styles.historyActionWrapper}>
          <CustomButton
            title="Catatan Kehadiran Saya"
            variant="secondary"
            size="md"
            leftIcon={
              <Ionicons
                name="time-outline"
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
            onPress={() => navigation.navigate('StudentHistory')}
          />
        </View>
      </ScrollView>

      {/* Success / Feedback Modal */}
      <Modal
        visible={feedbackModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setFeedbackModal({ visible: false, success: false, message: '' })
        }>
        <TouchableWithoutFeedback
          onPress={() =>
            setFeedbackModal({ visible: false, success: false, message: '' })
          }>
          <View style={styles.feedbackOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.feedbackBox, APP_SHADOWS.modal]}>
                <View
                  style={[
                    styles.feedbackIconCircle,
                    feedbackModal.success
                      ? styles.feedbackSuccessCircle
                      : styles.feedbackErrorCircle,
                  ]}>
                  <Ionicons
                    name={
                      feedbackModal.success
                        ? 'checkmark-circle'
                        : 'alert-circle'
                    }
                    size={42}
                    color={
                      feedbackModal.success
                        ? APP_COLORS.opened
                        : APP_COLORS.error
                    }
                  />
                </View>

                <Text style={styles.feedbackTitle}>
                  {feedbackModal.success
                    ? 'Presensi Berhasil!'
                    : 'Gagal Presensi'}
                </Text>

                <Text style={styles.feedbackMessage}>
                  {feedbackModal.message}
                </Text>

                <View style={styles.feedbackBtnContainer}>
                  <CustomButton
                    title="Oke, Mengerti"
                    variant="primary"
                    size="md"
                    onPress={() =>
                      setFeedbackModal({
                        visible: false,
                        success: false,
                        message: '',
                      })
                    }
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  header: {
    marginBottom: APP_SPACING.lg,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: APP_COLORS.neutral500,
    marginTop: 4,
  },
  mainCard: {
    marginBottom: APP_SPACING.xl,
    padding: APP_SPACING.xl,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  dateText: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    fontWeight: '500',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classSubtitle: {
    fontSize: 16,
    color: APP_COLORS.neutral700,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: APP_SPACING.xl,
    gap: APP_SPACING.md,
  },
  infoCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: APP_COLORS.neutral950,
    fontWeight: '600',
    marginTop: 1,
  },
  ctaContainer: {
    marginTop: APP_SPACING.xs,
  },
  ctaHint: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    textAlign: 'center',
    marginTop: APP_SPACING.sm,
    lineHeight: 18,
  },
  attendedBox: {
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.md,
    alignItems: 'center',
  },
  attendedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  attendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  attendedDescription: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
    textAlign: 'center',
    marginBottom: APP_SPACING.md,
  },
  attendedBtn: {
    backgroundColor: APP_COLORS.white,
    borderColor: '#86EFAC',
  },
  historyActionWrapper: {
    marginTop: APP_SPACING.xs,
  },
  feedbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xl,
  },
  feedbackBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xxl,
    alignItems: 'center',
  },
  feedbackIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.lg,
  },
  feedbackSuccessCircle: {
    backgroundColor: APP_COLORS.openedSoft,
  },
  feedbackErrorCircle: {
    backgroundColor: APP_COLORS.errorSoft,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    textAlign: 'center',
    marginBottom: APP_SPACING.xs,
  },
  feedbackMessage: {
    fontSize: 14,
    color: APP_COLORS.neutral700,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: APP_SPACING.xl,
  },
  feedbackBtnContainer: {
    width: '100%',
  },
});

export default StudentHomeScreen;

