import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';

export default function SessionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    activeUser,
    schedules,
    openSession,
    closeSession,
    submitAttendance,
    getStudentAttendanceForSchedule,
    getAttendanceForSchedule,
  } = useApp();

  const session = schedules.find((item) => item.id === id);

  const [confirmAttendanceVisible, setConfirmAttendanceVisible] =
    useState(false);
  const [confirmOpenVisible, setConfirmOpenVisible] = useState(false);
  const [confirmCloseVisible, setConfirmCloseVisible] = useState(false);

  if (!session) {
    return (
      <ResponsiveContainer>
        <View style={styles.errorContainer}>
          <EmptyState
            icon="alert-circle-outline"
            title="Sesi Tidak Ditemukan"
            description="ID sesi praktikum tidak valid atau telah dihapus."
          />
          <TouchableOpacity
            style={styles.backBtnFallback}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.backBtnFallbackText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>
    );
  }

  const role = activeUser?.role ?? 'student';

  const attendanceRecord =
    activeUser && role === 'student'
      ? getStudentAttendanceForSchedule(session.id, activeUser.id)
      : undefined;

  const hasAttended = Boolean(attendanceRecord);
  const attendanceList = getAttendanceForSchedule(session.id);

  // Presensi praktikan
  const handleAttendanceSubmit = () => {
    if (!activeUser || role !== 'student') return;

    setConfirmAttendanceVisible(false);

    const result = submitAttendance(session.id, activeUser);

    Alert.alert(
      result.success ? 'Presensi Berhasil!' : 'Presensi Gagal',
      result.success
        ? `Presensi berhasil dicatat pada pukul ${
            result.record?.timestamp ?? result.timestamp ?? '-'
          }.`
        : result.message,
    );
  };

  // Membuka sesi
  const handleConfirmOpen = () => {
    setConfirmOpenVisible(false);
    openSession(session.id);

    Alert.alert(
      'Sesi Telah Dibuka',
      `Sesi ${session.courseName} berhasil dibuka.`,
    );
  };

  // Menutup sesi
  const handleConfirmClose = () => {
    setConfirmCloseVisible(false);
    closeSession(session.id);

    Alert.alert(
      'Sesi Telah Ditutup',
      `Sesi ${session.courseName} berhasil ditutup.`,
    );
  };

  return (
    <ResponsiveContainer>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={APP_COLORS.neutral950}
          />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Detail Sesi Praktikum</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Main Session Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.practicumName}>{session.courseName}</Text>
              <View style={styles.classBadge}>
                <Text style={styles.classText}>{session.className}</Text>
              </View>
            </View>
            <StatusBadge status={session.status} size="md" />
          </View>

          <View style={styles.divider} />

          <View style={styles.detailList}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons
                  name="calendar"
                  size={16}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Tanggal Pelaksanaan</Text>
                <Text style={styles.detailValue}>{session.date}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons
                  name="time"
                  size={16}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Waktu Praktikum</Text>
                <Text style={styles.detailValue}>
                  {session.time} WIB
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons
                  name="business"
                  size={16}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Ruangan Laboratorium</Text>
                <Text style={styles.detailValue}>{session.room}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons
                  name="person"
                  size={16}
                  color={APP_COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>
                  Asisten Penanggung Jawab
                </Text>
                <Text style={styles.detailValue}>
                  {session.assistantName}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ROLE A: PRAKTIKAN VIEW */}
        {role === 'student' && (
          <View style={styles.attendanceCard}>
            <Text style={styles.sectionHeaderTitle}>Status Presensi Saya</Text>

            {hasAttended ? (
              <View style={styles.attendedStatusBox}>
                <View style={styles.attendedIconCircle}>
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color={APP_COLORS.opened}
                  />
                </View>
                <Text style={styles.attendedTitle}>
                  Anda Sudah Melakukan Presensi
                </Text>
                <Text style={styles.attendedTimestamp}>
                  Tercatat hadir pada pukul {attendanceRecord?.timestamp}
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons
                    name="checkmark-done"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.actionButtonText}>
                    Presensi Sudah Tercatat
                  </Text>
                </TouchableOpacity>
              </View>
            ) : session.status === 'BELUM_DIBUKA' ? (
              <View style={styles.noticeBox}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={APP_COLORS.notOpened}
                />
                <Text style={styles.noticeTitle}>Sesi Belum Dibuka</Text>
                <Text style={styles.noticeDesc}>
                  Asisten belum membuka sesi praktikum ini. Tombol presensi
                  akan tersedia setelah sesi dibuka.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons
                    name="lock-closed"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.actionButtonText}>
                    Presensi Belum Tersedia
                  </Text>
                </TouchableOpacity>
              </View>
            ) : session.status === 'DIBUKA' ? (
              <View style={styles.openAttendanceBox}>
                <Ionicons
                  name="flash-outline"
                  size={28}
                  color={APP_COLORS.opened}
                />
                <Text style={styles.openAttendanceTitle}>
                  Sesi Sedang Berlangsung!
                </Text>
                <Text style={styles.openAttendanceDesc}>
                  Presensi kehadiran dibuka. Tekan tombol di bawah untuk
                  mencatat kehadiran Anda.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonPrimary]}
                  onPress={() => setConfirmAttendanceVisible(true)}
                  activeOpacity={0.8}>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    Presensi Sekarang
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noticeBox}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={APP_COLORS.neutral500}
                />
                <Text style={styles.noticeTitle}>Sesi Sudah Ditutup</Text>
                <Text style={styles.noticeDesc}>
                  Asisten telah menutup sesi praktikum ini. Presensi sudah
                  tidak dapat dilakukan.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons name="ban" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    Sesi Telah Ditutup
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ROLE B: ASISTEN VIEW */}
        {role === 'assistant' && (
          <View>
            {/* Assistant Session Controls */}
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>
                Kontrol Sesi Asisten
              </Text>

              {session.status === 'BELUM_DIBUKA' && (
                <View>
                  <Text style={styles.controlHint}>
                    Sesi berstatus Belum Dibuka. Klik tombol di bawah untuk
                    membuka sesi dan mengizinkan praktikan melakukan presensi.
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buttonOpen]}
                    onPress={() => setConfirmOpenVisible(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="play" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      Buka Sesi Sekarang
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {session.status === 'DIBUKA' && (
                <View>
                  <Text style={styles.controlHint}>
                    Sesi sedang Berlangsung. Praktikan dapat melakukan
                    presensi. Klik Tutup Sesi untuk mengakhiri presensi.
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buttonClose]}
                    onPress={() => setConfirmCloseVisible(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="stop" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      Tutup Sesi Praktikum
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {session.status === 'SELESAI' && (
                <View style={styles.closedNoticeBox}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={APP_COLORS.neutral500}
                  />
                  <Text style={styles.closedNoticeText}>
                    Sesi praktikum telah ditutup secara resmi. Tidak ada
                    perubahan status lebih lanjut.
                  </Text>
                </View>
              )}
            </View>

            {/* Assistant Attendance Recap for this session */}
            <View style={styles.card}>
              <View style={styles.recapHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>
                  Rekap Presensi Sesi
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {attendanceList.length} Hadir
                  </Text>
                </View>
              </View>

              {attendanceList.length === 0 ? (
                <EmptyState
                  icon="people-outline"
                  title="Belum Ada Presensi"
                  description="Praktikan yang telah melakukan presensi pada sesi ini akan ditampilkan di sini."
                />
              ) : (
                <View style={styles.recapList}>
                  {attendanceList.map((record, index) => (
                    <View key={record.id} style={styles.recapItem}>
                      <View style={styles.recapIndexCircle}>
                        <Text style={styles.recapIndexText}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recapStudentName}>
                          {record.studentName}
                        </Text>
                        <Text style={styles.recapStudentNim}>
                          NIM: {record.nim} • {record.timestamp}
                        </Text>
                      </View>
                      <View style={styles.hadirPill}>
                        <Text style={styles.hadirPillText}>Hadir</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Konfirmasi presensi */}
      <ConfirmModal
        visible={confirmAttendanceVisible}
        title="Konfirmasi Presensi"
        subtitle={`Apakah Anda yakin ingin melakukan presensi untuk sesi ${session.courseName}?`}
        confirmText="Ya, Presensi"
        cancelText="Batal"
        confirmVariant="primary"
        onConfirm={handleAttendanceSubmit}
        onCancel={() => setConfirmAttendanceVisible(false)}
      />

      {/* Konfirmasi buka sesi */}
      <ConfirmModal
        visible={confirmOpenVisible}
        title="Buka Sesi Praktikum"
        subtitle={`Buka sesi ${session.courseName} (${session.className}) agar mahasiswa dapat melakukan presensi?`}
        confirmText="Ya, Buka Sesi"
        cancelText="Batal"
        confirmVariant="primary"
        onConfirm={handleConfirmOpen}
        onCancel={() => setConfirmOpenVisible(false)}
      />

      {/* Konfirmasi tutup sesi */}
      <ConfirmModal
        visible={confirmCloseVisible}
        title="Tutup Sesi Praktikum"
        subtitle={`Yakin ingin menutup sesi ${session.courseName}? Presensi tidak dapat dilakukan lagi setelah sesi ditutup.`}
        confirmText="Ya, Tutup Sesi"
        cancelText="Batal"
        confirmVariant="danger"
        onConfirm={handleConfirmClose}
        onCancel={() => setConfirmCloseVisible(false)}
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.neutral200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  scrollContent: {
    padding: APP_SPACING.lg,
    paddingBottom: APP_SPACING.xxxl,
  },
  card: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.lg,
    padding: APP_SPACING.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    marginBottom: APP_SPACING.lg,
    shadowColor: APP_COLORS.neutral950,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  practicumName: {
    fontSize: 18,
    fontWeight: '800',
    color: APP_COLORS.neutral950,
    marginBottom: 4,
  },
  classBadge: {
    backgroundColor: APP_COLORS.primary100,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral100,
    marginVertical: APP_SPACING.lg,
  },
  detailList: {
    gap: APP_SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.primary100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  attendanceCard: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.lg,
    padding: APP_SPACING.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    marginBottom: APP_SPACING.lg,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.md,
  },
  attendedStatusBox: {
    alignItems: 'center',
    paddingVertical: APP_SPACING.md,
  },
  attendedIconCircle: {
    marginBottom: APP_SPACING.sm,
  },
  attendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.opened,
    marginBottom: 4,
  },
  attendedTimestamp: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginBottom: APP_SPACING.lg,
  },
  noticeBox: {
    alignItems: 'center',
    paddingVertical: APP_SPACING.md,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginTop: APP_SPACING.sm,
    marginBottom: 4,
  },
  noticeDesc: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: APP_SPACING.lg,
  },
  openAttendanceBox: {
    alignItems: 'center',
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.openedSoft,
    borderRadius: APP_RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: APP_SPACING.lg,
  },
  openAttendanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.opened,
    marginTop: APP_SPACING.xs,
    marginBottom: 4,
  },
  openAttendanceDesc: {
    fontSize: 13,
    color: APP_COLORS.neutral950,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: APP_SPACING.lg,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
    paddingVertical: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
  },
  buttonPrimary: {
    backgroundColor: APP_COLORS.primary,
  },
  buttonOpen: {
    backgroundColor: APP_COLORS.opened,
  },
  buttonClose: {
    backgroundColor: APP_COLORS.danger,
  },
  buttonDisabled: {
    backgroundColor: APP_COLORS.neutral500,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlHint: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    lineHeight: 18,
    marginBottom: APP_SPACING.md,
  },
  closedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    backgroundColor: APP_COLORS.neutral100,
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
  },
  closedNoticeText: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    flex: 1,
  },
  recapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  countBadge: {
    backgroundColor: APP_COLORS.primary100,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 3,
    borderRadius: APP_RADIUS.pill,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  recapList: {
    gap: APP_SPACING.sm,
  },
  recapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.neutral100,
  },
  recapIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: APP_COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.neutral500,
  },
  recapStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  recapStudentNim: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    marginTop: 1,
  },
  hadirPill: {
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.sm,
  },
  hadirPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  errorContainer: {
    flex: 1,
    padding: APP_SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: APP_SPACING.xl,
    paddingVertical: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    marginTop: APP_SPACING.lg,
  },
  backBtnFallbackText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
