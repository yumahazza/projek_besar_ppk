/**
 * StudentHomeScreen Component
 * Programmer: Hanna & Birela (Flow Praktikan, Form Presensi, Disabled/Empty State & Polish UI)
 * SRS-STU-001: Melihat jadwal praktikum beserta respons status sesi (BELUM DIBUKA, DIBUKA, SELESAI)
 * SRS-STU-002: Presensi kehadiran melalui tombol "Presensi Sekarang" saat sesi DIBUKA
 * SRS-STU-003: Feedback Modal / Toast menampilkan waktu kehadiran (timestamp) setelah presensi berhasil
 * SRS-VAL-001: Tombol presensi dinonaktifkan (disabled) saat sesi BELUM DIBUKA atau SELESAI
 * SRS-VAL-002: Validasi pencegahan presensi ganda untuk mahasiswa yang sama
 * SRS-UI-004: Tampilan penjelasan (Empty/Disabled State View) saat sesi belum buka atau tutup
 * SRS-UI-005: Responsive Flexbox Layout & Polished UI
 * Follows DSG.md Section 10, 15, 16, 18, 21, 23, 25
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

  // SRS-STU-002: Aksi presensi saat sesi DIBUKA
  const handleAttendancePress = () => {
    if (!currentSchedule) return;

    // Panggil logika presensi dengan validasi waktu & validasi presensi ganda
    const result: AttendanceResult = submitAttendance(currentSchedule.id);

    // SRS-STU-003: Tampilkan feedback modal dengan waktu kehadiran
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
        {/* Welcome Header Praktikan */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Presensi Mahasiswa</Text>
          <Text style={styles.welcomeSubtitle}>
            Pastikan Anda terhubung di jaringan lab dan berada di ruang kelas saat presensi
          </Text>
        </View>

        {/* SRS-STU-001: Main Schedule & Session Status Focal Card */}
        {currentSchedule && (
          <Card
            style={styles.mainCard}
            highlighted={isSessionOpen && !isAttended}>
            {/* Header: StatusBadge & Date */}
            <View style={styles.statusRow}>
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

            {/* Course Title & Class */}
            <Text style={styles.courseTitle}>{currentSchedule.courseName}</Text>
            <Text style={styles.classSubtitle}>{currentSchedule.className}</Text>

            {/* Live Indicator Banner jika sesi DIBUKA */}
            {isSessionOpen && !isAttended && (
              <View style={styles.liveBanner}>
                <View style={styles.pulsingDot} />
                <Text style={styles.liveBannerText}>
                  Sesi Praktikum Dibuka • Presensi Tersedia Sekarang
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            {/* Session Info Grid */}
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

            {/* Asisten Info Row */}
            <View style={styles.assistantRow}>
              <Ionicons
                name="person-circle-outline"
                size={18}
                color={APP_COLORS.neutral500}
              />
              <Text style={styles.assistantText}>
                Asisten Lab:{' '}
                <Text style={styles.assistantName}>
                  {currentSchedule.assistantName}
                </Text>
              </Text>
            </View>

            {/* SRS-STU-002, SRS-VAL-001, SRS-VAL-002, SRS-UI-004: Dynamic Attendance CTA Section */}
            <View style={styles.ctaContainer}>
              {/* KASUS A: SUDAH PRESENSI (SRS-VAL-002: Validasi Presensi Ganda) */}
              {isAttended ? (
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
                  {studentRecord && (
                    <View style={styles.timestampBadge}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.timestampBadgeText}>
                        Waktu Presensi: {studentRecord.timestamp}
                      </Text>
                    </View>
                  )}
                  <CustomButton
                    title="✓ Sudah Presensi"
                    variant="outline"
                    disabled
                    onPress={() => {}}
                    style={styles.attendedBtn}
                  />
                  <Text style={styles.attendedHint}>
                    Pencegahan presensi ganda aktif. Presensi Anda telah tersimpan di sistem.
                  </Text>
                </View>
              ) : isSessionOpen ? (
                /* KASUS B: SESI DIBUKA & BELUM PRESENSI (SRS-STU-002) */
                <View>
                  <CustomButton
                    title="Presensi Sekarang"
                    variant="primary"
                    size="lg"
                    leftIcon={
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={APP_COLORS.white}
                      />
                    }
                    onPress={handleAttendancePress}
                  />
                  <Text style={styles.ctaHint}>
                    Tekan tombol di atas untuk mencatatkan kehadiran Anda secara realtime
                  </Text>
                </View>
              ) : currentSchedule.status === 'BELUM_DIBUKA' ? (
                /* KASUS C: SESI BELUM DIBUKA (SRS-VAL-001 & SRS-UI-004) */
                <View style={styles.disabledStateView}>
                  <View style={styles.disabledIconRow}>
                    <View style={styles.iconCircleWarning}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={APP_COLORS.notOpened}
                      />
                    </View>
                    <View style={styles.disabledTextGroup}>
                      <Text style={styles.disabledStateTitle}>
                        Presensi Belum Dibuka
                      </Text>
                      <Text style={styles.disabledStateSubtitle}>
                        Sesi akan aktif setelah asisten membuka praktikum.
                      </Text>
                    </View>
                  </View>
                  <CustomButton
                    title="Presensi Belum Dibuka"
                    variant="outline"
                    disabled
                    size="lg"
                    onPress={() => {}}
                  />
                </View>
              ) : (
                /* KASUS D: SESI TELAH SELESAI / TUTUP (SRS-VAL-001 & SRS-UI-004) */
                <View style={styles.disabledStateView}>
                  <View style={styles.disabledIconRow}>
                    <View style={styles.iconCircleFinished}>
                      <Ionicons
                        name="lock-closed"
                        size={18}
                        color={APP_COLORS.finished}
                      />
                    </View>
                    <View style={styles.disabledTextGroup}>
                      <Text style={styles.disabledStateTitle}>
                        Sesi Telah Ditutup
                      </Text>
                      <Text style={styles.disabledStateSubtitle}>
                        Presensi untuk sesi praktikum ini sudah berakhir.
                      </Text>
                    </View>
                  </View>
                  <CustomButton
                    title="Sesi Telah Ditutup"
                    variant="outline"
                    disabled
                    size="lg"
                    onPress={() => {}}
                  />
                </View>
              )}
            </View>
          </Card>
        )}

        {/* SRS-STU-001: Daftar Jadwal Praktikan Lainnya */}
        <View style={styles.scheduleListSection}>
          <Text style={styles.scheduleListTitle}>Daftar Praktikum Saya</Text>
          {schedules.map((item) => {
            const isSelected = item.id === currentSchedule?.id;
            const attendedItem = hasStudentAttended(item.id, activeUser.id);

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
                    <Text style={styles.itemCourseName}>{item.courseName}</Text>
                    <Text style={styles.itemClassSubtitle}>
                      {item.className} • {item.room}
                    </Text>
                    <Text style={styles.itemTimeText}>
                      {item.date} • {item.time}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="sm" />
                </View>

                <View style={styles.itemDivider} />

                <View style={styles.itemFooter}>
                  {attendedItem ? (
                    <View style={styles.itemAttendedPill}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.itemAttendedText}>Sudah Hadir</Text>
                    </View>
                  ) : item.status === 'DIBUKA' ? (
                    <View style={styles.itemReadyPill}>
                      <Ionicons
                        name="alert-circle"
                        size={13}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.itemReadyText}>Presensi Tersedia</Text>
                    </View>
                  ) : (
                    <Text style={styles.itemStatusDesc}>
                      {item.status === 'BELUM_DIBUKA'
                        ? 'Menunggu sesi dibuka'
                        : 'Sesi berakhir'}
                    </Text>
                  )}

                  {isSelected && (
                    <Text style={styles.selectedScheduleLabel}>
                      Sedang Dipantau
                    </Text>
                  )}
                </View>
              </Card>
            );
          })}
        </View>

        {/* Navigasi ke Riwayat Kehadiran */}
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

      {/* SRS-STU-003: Feedback Modal Sukses / Validasi Presensi */}
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
                {/* Status Icon */}
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
                    size={46}
                    color={
                      feedbackModal.success
                        ? APP_COLORS.opened
                        : APP_COLORS.error
                    }
                  />
                </View>

                {/* Modal Title */}
                <Text style={styles.feedbackTitle}>
                  {feedbackModal.success
                    ? 'Presensi Berhasil!'
                    : 'Pemberitahuan Presensi'}
                </Text>

                {/* Feedback Description & Timestamp Banner */}
                {feedbackModal.success ? (
                  <View style={styles.successContent}>
                    <View style={styles.timestampHighlightBox}>
                      <Ionicons
                        name="time"
                        size={16}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.timestampHighlightText}>
                        Waktu Kehadiran: {feedbackModal.timestamp}
                      </Text>
                    </View>

                    {/* Receipt Details Card */}
                    <View style={styles.receiptCard}>
                      <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Praktikan</Text>
                        <Text style={styles.receiptValue}>{activeUser.name}</Text>
                      </View>
                      <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>NIM</Text>
                        <Text style={styles.receiptValue}>
                          {activeUser.nim || '-'}
                        </Text>
                      </View>
                      <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Praktikum</Text>
                        <Text style={styles.receiptValue}>
                          {currentSchedule?.courseName} — {currentSchedule?.className}
                        </Text>
                      </View>
                      <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Ruangan</Text>
                        <Text style={styles.receiptValue}>
                          {currentSchedule?.room}
                        </Text>
                      </View>
                      <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Status</Text>
                        <Text style={[styles.receiptValue, styles.receiptHadir]}>
                          ✓ Hadir
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.feedbackMessage}>
                    {feedbackModal.message}
                  </Text>
                )}

                {/* Modal Action Buttons */}
                <View style={styles.feedbackBtnGroup}>
                  {feedbackModal.success && (
                    <CustomButton
                      title="Lihat Catatan Kehadiran"
                      variant="secondary"
                      size="md"
                      onPress={() => {
                        setFeedbackModal({
                          visible: false,
                          success: false,
                          message: '',
                        });
                        navigation.navigate('StudentHistory');
                      }}
                    />
                  )}
                  <CustomButton
                    title={feedbackModal.success ? 'Selesai' : 'Oke, Mengerti'}
                    variant={feedbackModal.success ? 'primary' : 'outline'}
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
    lineHeight: 20,
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
    color: APP_COLORS.neutral700,
    fontWeight: '500',
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
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#BBF7D0',
    borderWidth: 1,
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
  liveBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: APP_SPACING.md,
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
  assistantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 6,
    borderRadius: APP_RADIUS.md,
    gap: 6,
    marginBottom: APP_SPACING.lg,
  },
  assistantText: {
    fontSize: 12,
    color: APP_COLORS.neutral700,
  },
  assistantName: {
    fontWeight: '600',
    color: APP_COLORS.neutral950,
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
    marginBottom: APP_SPACING.sm,
  },
  timestampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 4,
    borderRadius: APP_RADIUS.pill,
    gap: 6,
    marginBottom: APP_SPACING.md,
  },
  timestampBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  attendedBtn: {
    backgroundColor: APP_COLORS.white,
    borderColor: '#86EFAC',
  },
  attendedHint: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    textAlign: 'center',
    marginTop: 8,
  },
  disabledStateView: {
    backgroundColor: APP_COLORS.neutral100,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.md,
  },
  disabledIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.md,
  },
  iconCircleWarning: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.notOpenedSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleFinished: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.finishedSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledTextGroup: {
    flex: 1,
  },
  disabledStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  disabledStateSubtitle: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
    lineHeight: 16,
  },
  scheduleListSection: {
    marginBottom: APP_SPACING.lg,
  },
  scheduleListTitle: {
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
  itemCourseName: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  itemClassSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.primary,
    marginTop: 2,
  },
  itemTimeText: {
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
  },
  itemAttendedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
  },
  itemAttendedText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  itemReadyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
  },
  itemReadyText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  itemStatusDesc: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  selectedScheduleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.primary,
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
    maxWidth: 380,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xxl,
    alignItems: 'center',
  },
  feedbackIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.lg,
  },
  feedbackSuccessCircle: {
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#86EFAC',
    borderWidth: 2,
  },
  feedbackErrorCircle: {
    backgroundColor: APP_COLORS.errorSoft,
    borderColor: '#FECACA',
    borderWidth: 2,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    textAlign: 'center',
    marginBottom: APP_SPACING.xs,
  },
  successContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: APP_SPACING.xl,
  },
  timestampHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 6,
    borderRadius: APP_RADIUS.pill,
    gap: 6,
    marginVertical: APP_SPACING.sm,
  },
  timestampHighlightText: {
    fontSize: 13,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: APP_COLORS.neutral50,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.md,
    marginTop: APP_SPACING.sm,
    gap: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  receiptHadir: {
    color: APP_COLORS.opened,
    fontWeight: '700',
  },
  feedbackMessage: {
    fontSize: 14,
    color: APP_COLORS.neutral700,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: APP_SPACING.xl,
  },
  feedbackBtnGroup: {
    width: '100%',
    gap: APP_SPACING.sm,
  },
});

export default StudentHomeScreen;
