import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePracticum } from '@/context/PracticumContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SuccessModal } from '@/components/SuccessModal';
import { EmptyState } from '@/components/EmptyState';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function SessionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentUser,
    getSessionById,
    openSession,
    closeSession,
    submitAttendance,
    hasStudentAttended,
    getSessionAttendance,
  } = usePracticum();

  const session = getSessionById(id || '');

  // Modals state
  const [confirmAttendanceVisible, setConfirmAttendanceVisible] = useState(false);
  const [confirmOpenVisible, setConfirmOpenVisible] = useState(false);
  const [confirmCloseVisible, setConfirmCloseVisible] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

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
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={styles.backBtnFallbackText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>
    );
  }

  const role = currentUser?.role || 'praktikan';
  const attendanceRecord =
    currentUser && role === 'praktikan'
      ? hasStudentAttended(session.id, currentUser.id)
      : undefined;

  const hasAttended = !!attendanceRecord;
  const attendanceList = getSessionAttendance(session.id);

  // Student Attendance Handler
  const handleAttendanceSubmit = () => {
    if (!currentUser || role !== 'praktikan') return;
    setConfirmAttendanceVisible(false);

    const res = submitAttendance(session.id, currentUser.id);
    if (res.success && res.record) {
      setSuccessInfo({
        visible: true,
        title: 'Presensi Berhasil!',
        message: `Anda berhasil melakukan presensi pada pukul ${res.record.timestamp}.`,
      });
    } else {
      setSuccessInfo({
        visible: true,
        title: 'Presensi Gagal',
        message: res.message,
      });
    }
  };

  // Assistant Open Session Handler
  const handleConfirmOpen = () => {
    setConfirmOpenVisible(false);
    const res = openSession(session.id);
    if (res.success) {
      setSuccessInfo({
        visible: true,
        title: 'Sesi Telah Dibuka',
        message: res.message,
      });
    }
  };

  // Assistant Close Session Handler
  const handleConfirmClose = () => {
    setConfirmCloseVisible(false);
    const res = closeSession(session.id);
    if (res.success) {
      setSuccessInfo({
        visible: true,
        title: 'Sesi Telah Ditutup',
        message: res.message,
      });
    }
  };

  return (
    <ResponsiveContainer>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
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
              <Text style={styles.practicumName}>{session.name}</Text>
              <View style={styles.classBadge}>
                <Text style={styles.classText}>{session.classId}</Text>
              </View>
            </View>
            <StatusBadge status={session.status} size="md" />
          </View>

          <View style={styles.divider} />

          <View style={styles.detailList}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons name="calendar" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Tanggal Pelaksanaan</Text>
                <Text style={styles.detailValue}>{session.date}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons name="time" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Waktu Praktikum</Text>
                <Text style={styles.detailValue}>
                  {session.startTime} – {session.endTime} WIB
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons name="business" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Ruangan Laboratorium</Text>
                <Text style={styles.detailValue}>{session.room}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Ionicons name="person" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Asisten Penanggung Jawab</Text>
                <Text style={styles.detailValue}>{session.assistantName}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ROLE A: PRAKTIKAN VIEW */}
        {role === 'praktikan' && (
          <View style={styles.attendanceCard}>
            <Text style={styles.sectionHeaderTitle}>Status Presensi Saya</Text>

            {hasAttended ? (
              <View style={styles.attendedStatusBox}>
                <View style={styles.attendedIconCircle}>
                  <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
                </View>
                <Text style={styles.attendedTitle}>Anda Sudah Melakukan Presensi</Text>
                <Text style={styles.attendedTimestamp}>
                  Tercatat hadir pada pukul {attendanceRecord?.timestamp}
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Presensi Sudah Tercatat</Text>
                </TouchableOpacity>
              </View>
            ) : session.status === 'scheduled' ? (
              <View style={styles.noticeBox}>
                <Ionicons name="time-outline" size={24} color={Colors.status.scheduled.text} />
                <Text style={styles.noticeTitle}>Sesi Belum Dibuka</Text>
                <Text style={styles.noticeDesc}>
                  Asisten belum membuka sesi praktikum ini. Tombol presensi akan tersedia setelah sesi dibuka.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Presensi Belum Tersedia</Text>
                </TouchableOpacity>
              </View>
            ) : session.status === 'open' ? (
              <View style={styles.openAttendanceBox}>
                <Ionicons name="flash-outline" size={28} color={Colors.status.open.text} />
                <Text style={styles.openAttendanceTitle}>Sesi Sedang Berlangsung!</Text>
                <Text style={styles.openAttendanceDesc}>
                  Presensi kehadiran dibuka. Tekan tombol di bawah untuk mencatat kehadiran Anda.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonPrimary]}
                  onPress={() => setConfirmAttendanceVisible(true)}
                  activeOpacity={0.8}>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Presensi Sekarang</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noticeBox}>
                <Ionicons name="close-circle-outline" size={24} color={Colors.textMuted} />
                <Text style={styles.noticeTitle}>Sesi Sudah Ditutup</Text>
                <Text style={styles.noticeDesc}>
                  Asisten telah menutup sesi praktikum ini. Presensi sudah tidak dapat dilakukan.
                </Text>

                <TouchableOpacity
                  style={[styles.actionButton, styles.buttonDisabled]}
                  disabled={true}>
                  <Ionicons name="ban" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Sesi Telah Ditutup</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ROLE B: ASISTEN VIEW */}
        {role === 'asisten' && (
          <View>
            {/* Assistant Session Controls */}
            <View style={styles.card}>
              <Text style={styles.sectionHeaderTitle}>Kontrol Sesi Asisten</Text>

              {session.status === 'scheduled' && (
                <View>
                  <Text style={styles.controlHint}>
                    Sesi berstatus Belum Dibuka. Klik tombol di bawah untuk membuka sesi dan mengizinkan praktikan melakukan presensi.
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buttonOpen]}
                    onPress={() => setConfirmOpenVisible(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="play" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Buka Sesi Sekarang</Text>
                  </TouchableOpacity>
                </View>
              )}

              {session.status === 'open' && (
                <View>
                  <Text style={styles.controlHint}>
                    Sesi sedang Berlangsung. Praktikan dapat melakukan presensi. Klik Tutup Sesi untuk mengakhiri presensi.
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buttonClose]}
                    onPress={() => setConfirmCloseVisible(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="stop" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Tutup Sesi Praktikum</Text>
                  </TouchableOpacity>
                </View>
              )}

              {session.status === 'closed' && (
                <View style={styles.closedNoticeBox}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={Colors.textSecondary} />
                  <Text style={styles.closedNoticeText}>
                    Sesi praktikum telah ditutup secara resmi. Tidak ada perubahan status lebih lanjut.
                  </Text>
                </View>
              )}
            </View>

            {/* Assistant Attendance Recap for this session */}
            <View style={styles.card}>
              <View style={styles.recapHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>Rekap Presensi Sesi</Text>
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
                        <Text style={styles.recapIndexText}>{index + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recapStudentName}>
                          {record.studentName}
                        </Text>
                        <Text style={styles.recapStudentNim}>
                          NIM: {record.studentNim} • {record.timestamp}
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

      {/* Confirmation Modal: Presensi Praktikan */}
      <ConfirmationModal
        visible={confirmAttendanceVisible}
        title="Konfirmasi Presensi"
        message={`Apakah Anda yakin ingin melakukan presensi untuk sesi ${session.name}?`}
        confirmText="Ya, Presensi"
        cancelText="Batal"
        confirmVariant="primary"
        icon="finger-print-outline"
        onConfirm={handleAttendanceSubmit}
        onCancel={() => setConfirmAttendanceVisible(false)}
      />

      {/* Confirmation Modal: Buka Sesi Asisten */}
      <ConfirmationModal
        visible={confirmOpenVisible}
        title="Buka Sesi Praktikum"
        message={`Apakah Anda yakin ingin membuka sesi ${session.name} (${session.classId})? Mahasiswa dapat segera melakukan presensi.`}
        confirmText="Ya, Buka Sesi"
        cancelText="Batal"
        confirmVariant="primary"
        icon="play-circle-outline"
        onConfirm={handleConfirmOpen}
        onCancel={() => setConfirmOpenVisible(false)}
      />

      {/* Confirmation Modal: Tutup Sesi Asisten */}
      <ConfirmationModal
        visible={confirmCloseVisible}
        title="Tutup Sesi Praktikum"
        message={`Apakah Anda yakin ingin menutup sesi praktikum ${session.name}? Presensi tidak lagi diterima setelah ditutup.`}
        confirmText="Ya, Tutup Sesi"
        cancelText="Batal"
        confirmVariant="danger"
        icon="alert-circle-outline"
        onConfirm={handleConfirmClose}
        onCancel={() => setConfirmCloseVisible(false)}
      />

      {/* Success Feedback Modal */}
      <SuccessModal
        visible={successInfo.visible}
        title={successInfo.title}
        message={successInfo.message}
        onClose={() => setSuccessInfo({ visible: false, title: '', message: '' })}
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: Colors.cardShadow,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  classBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.lg,
  },
  detailList: {
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  attendanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  attendedStatusBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  attendedIconCircle: {
    marginBottom: Spacing.sm,
  },
  attendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 4,
  },
  attendedTimestamp: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  noticeBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  noticeDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  openAttendanceBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: Spacing.lg,
  },
  openAttendanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.status.open.text,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  openAttendanceDesc: {
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonOpen: {
    backgroundColor: Colors.success,
  },
  buttonClose: {
    backgroundColor: Colors.error,
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  closedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.borderLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  closedNoticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  recapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  countBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  recapList: {
    gap: Spacing.sm,
  },
  recapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  recapIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  recapStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recapStudentNim: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  hadirPill: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  hadirPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  errorContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  backBtnFallbackText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
