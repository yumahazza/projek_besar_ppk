/**
 * SessionRecapScreen Component
 * Programmer: Fritz & Birela (Flow Asisten, Empty State & Polish UI)
 * SRS-AST-003: Tutup sesi praktikum saat sesi DIBUKA
 * SRS-AST-004: Modal konfirmasi sebelum tutup sesi
 * SRS-AST-005: Rekap daftar praktikan yang sudah presensi + timestamp kehadiran
 * SRS-UI-003: Empty State khusus pada rekap presensi jika belum ada yang hadir
 * SRS-UI-005: Layouting Flexbox responsif dan styling terpoles
 * Follows DSG.md Section 17, 20, 21, 23, 25
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInput,
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
  const {
    activeSchedule,
    schedules,
    getAttendanceForSchedule,
    closeSession,
  } = useApp();

  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [closedBannerVisible, setClosedBannerVisible] = useState(false);

  // Jika navigasi membawa target scheduleId tertentu, prioritaskan schedule tersebut
  const targetScheduleId = navigation.params?.scheduleId || activeSchedule?.id;
  const currentSchedule =
    schedules.find((s) => s.id === targetScheduleId) ||
    activeSchedule ||
    schedules[0];

  // SRS-AST-005: Daftar kehadiran untuk jadwal ini
  const allAttendanceLogs = useMemo(() => {
    return currentSchedule ? getAttendanceForSchedule(currentSchedule.id) : [];
  }, [currentSchedule, getAttendanceForSchedule]);

  // Filter pencarian berdasarkan nama mahasiswa atau NIM
  const filteredAttendanceLogs = useMemo(() => {
    if (!searchQuery.trim()) return allAttendanceLogs;
    const q = searchQuery.toLowerCase().trim();
    return allAttendanceLogs.filter(
      (log) =>
        log.studentName.toLowerCase().includes(q) ||
        (log.nim && log.nim.toLowerCase().includes(q))
    );
  }, [allAttendanceLogs, searchQuery]);

  // SRS-AST-003: Tutup sesi setelah konfirmasi
  const handleConfirmCloseSession = () => {
    if (currentSchedule) {
      closeSession(currentSchedule.id);
      setClosedBannerVisible(true);
      setTimeout(() => setClosedBannerVisible(false), 4000);
    }
    setCloseModalVisible(false);
  };

  const totalRegistered = currentSchedule?.totalStudents || 20;
  const totalAttended = allAttendanceLogs.length;
  const totalAbsent = Math.max(0, totalRegistered - totalAttended);
  const attendancePercent = totalRegistered > 0
    ? Math.round((totalAttended / totalRegistered) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar with Back Button */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Dashboard Asisten">
          <Ionicons name="arrow-back" size={22} color={APP_COLORS.neutral950} />
        </Pressable>
        <View style={styles.navTitleGroup}>
          <Text style={styles.navTitle}>Rekap Presensi</Text>
          <Text style={styles.navSubtitle} numberOfLines={1}>
            {currentSchedule?.courseName} • {currentSchedule?.className}
          </Text>
        </View>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Banner Notifikasi Sesi Ditutup */}
        {closedBannerVisible && (
          <View style={styles.closedBanner}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={APP_COLORS.finished}
            />
            <Text style={styles.closedBannerText}>
              Sesi praktikum telah berhasil DITUTUP. Presensi sudah diakhiri.
            </Text>
          </View>
        )}

        {/* Schedule Summary & Stats Card */}
        {currentSchedule && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryTextGroup}>
                <Text style={styles.courseTitle}>
                  {currentSchedule.courseName}
                </Text>
                <Text style={styles.classSubtitle}>
                  {currentSchedule.className} • {currentSchedule.room}
                </Text>
                <View style={styles.scheduleInfoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={APP_COLORS.neutral500}
                  />
                  <Text style={styles.scheduleInfoText}>
                    {currentSchedule.date} • {currentSchedule.time}
                  </Text>
                </View>
              </View>
              <StatusBadge status={currentSchedule.status} size="md" />
            </View>

            {/* SRS-AST-005: Metrics Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, styles.statBoxPrimary]}>
                <Text style={styles.statBoxNumber}>{totalAttended}</Text>
                <Text style={styles.statBoxLabel}>Hadir</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statBoxNumber}>{totalAbsent}</Text>
                <Text style={styles.statBoxLabel}>Belum Hadir</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statBoxNumber}>{totalRegistered}</Text>
                <Text style={styles.statBoxLabel}>Total Praktikan</Text>
              </View>
            </View>

            {/* Progress Bar Track */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Persentase Kehadiran</Text>
                <Text style={styles.progressPercentage}>
                  {attendancePercent}%
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

            {/* SRS-AST-003: Tutup Sesi CTA Button from Recap Screen */}
            {currentSchedule.status === 'DIBUKA' && (
              <View style={styles.closeActionContainer}>
                <CustomButton
                  title="Tutup Sesi Praktikum Sekarang"
                  variant="danger"
                  size="md"
                  leftIcon={
                    <Ionicons
                      name="stop-circle"
                      size={18}
                      color={APP_COLORS.white}
                    />
                  }
                  onPress={() => setCloseModalVisible(true)}
                />
              </View>
            )}

            {currentSchedule.status === 'SELESAI' && (
              <View style={styles.finishedNoticeBox}>
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color={APP_COLORS.finished}
                />
                <Text style={styles.finishedNoticeText}>
                  Sesi ini telah ditutup. Laporan rekapitulasi kehadiran bersifat final.
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* SRS-AST-005 & SRS-UI-003: Attendance List Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listSectionTitle}>Daftar Presensi Mahasiswa</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {allAttendanceLogs.length} Terdata
              </Text>
            </View>
          </View>

          {/* Search Box */}
          {allAttendanceLogs.length > 0 && (
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={18}
                color={APP_COLORS.neutral500}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari nama mahasiswa atau NIM..."
                placeholderTextColor={APP_COLORS.neutral500}
                style={styles.searchInput}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.searchClearBtn}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={APP_COLORS.neutral500}
                  />
                </Pressable>
              )}
            </View>
          )}

          {/* SRS-UI-003: Empty State Khusus Rekap Presensi Kosong */}
          {allAttendanceLogs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <EmptyState
                iconName="people-outline"
                iconColor={APP_COLORS.primary500}
                iconBgColor={APP_COLORS.primary50}
                badge="Rekap Masih Kosong"
                title="Belum Ada Praktikan Presensi"
                description="Belum ada mahasiswa yang mencatatkan kehadiran pada sesi praktikum ini. Data presensi akan muncul secara otomatis dan realtime begitu mahasiswa menekan tombol presensi."
                hint={
                  currentSchedule?.status === 'DIBUKA'
                    ? 'Sesi sedang aktif dibuka. Mahasiswa dapat presensi sekarang.'
                    : 'Sesi saat ini belum dibuka. Buka sesi terlebih dahulu agar mahasiswa dapat presensi.'
                }
              />
            </Card>
          ) : filteredAttendanceLogs.length === 0 ? (
            /* State 2: Pencarian tidak menemukan hasil */
            <Card style={styles.emptySearchCard}>
              <EmptyState
                iconName="search-outline"
                iconColor={APP_COLORS.neutral500}
                iconBgColor={APP_COLORS.neutral100}
                title="Mahasiswa Tidak Ditemukan"
                description={`Tidak ada data kehadiran yang cocok dengan kata kunci "${searchQuery}".`}
                actionTitle="Hapus Pencarian"
                onActionPress={() => setSearchQuery('')}
              />
            </Card>
          ) : (
            /* State 3: Render daftar praktikan hadir dengan timestamp */
            filteredAttendanceLogs.map((item, index) => (
              <Card key={item.id} style={styles.attendeeCard}>
                <View style={styles.attendeeRow}>
                  {/* Nomor Urut */}
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexNumber}>#{index + 1}</Text>
                  </View>

                  {/* Detail Nama & NIM */}
                  <View style={styles.attendeeDetails}>
                    <Text style={styles.attendeeName}>{item.studentName}</Text>
                    <View style={styles.nimRow}>
                      <Ionicons
                        name="id-card-outline"
                        size={12}
                        color={APP_COLORS.neutral500}
                      />
                      <Text style={styles.attendeeNim}>NIM: {item.nim}</Text>
                    </View>
                  </View>

                  {/* Status & Timestamp */}
                  <View style={styles.attendeeTimeCol}>
                    <View style={styles.statusPill}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={APP_COLORS.opened}
                      />
                      <Text style={styles.statusPillText}>Hadir</Text>
                    </View>
                    <View style={styles.timestampRow}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={APP_COLORS.neutral500}
                      />
                      <Text style={styles.timestampText}>{item.timestamp}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* SRS-AST-004: Modal Konfirmasi Tutup Sesi */}
      <ConfirmModal
        visible={closeModalVisible}
        title="Tutup Sesi Praktikum?"
        subtitle="Setelah sesi ditutup, status akan berubah menjadi SELESAI dan praktikan tidak dapat melakukan presensi lagi."
        details={{
          courseName: currentSchedule?.courseName,
          className: currentSchedule?.className,
          time: currentSchedule?.time,
          room: currentSchedule?.room,
        }}
        confirmText="Tutup Sesi"
        cancelText="Batal"
        confirmVariant="danger"
        onConfirm={handleConfirmCloseSession}
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
  navTitleGroup: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: APP_SPACING.sm,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  navSubtitle: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 1,
  },
  navPlaceholder: {
    width: 34,
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    padding: APP_SPACING.xl,
    paddingBottom: APP_SPACING.xxxl * 2,
  },
  closedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.finishedSoft,
    borderColor: APP_COLORS.neutral300,
    borderWidth: 1,
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.md,
    marginBottom: APP_SPACING.lg,
    gap: 8,
  },
  closedBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: APP_COLORS.neutral950,
  },
  summaryCard: {
    marginBottom: APP_SPACING.xl,
    padding: APP_SPACING.xl,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryTextGroup: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.primary,
    marginTop: 2,
  },
  scheduleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  scheduleInfoText: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    marginTop: APP_SPACING.lg,
    marginBottom: APP_SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.md,
    paddingVertical: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xs,
    alignItems: 'center',
  },
  statBoxPrimary: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
  },
  statBoxNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  statBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.neutral500,
    marginTop: 2,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: APP_SPACING.sm,
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
  progressPercentage: {
    fontSize: 13,
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
  finishedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.sm,
    marginTop: APP_SPACING.md,
    gap: 6,
  },
  finishedNoticeText: {
    flex: 1,
    fontSize: 12,
    color: APP_COLORS.neutral500,
    lineHeight: 16,
  },
  listSection: {
    marginTop: APP_SPACING.xs,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  listSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  countBadge: {
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: APP_RADIUS.pill,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral700,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    paddingHorizontal: APP_SPACING.md,
    marginBottom: APP_SPACING.md,
    height: 42,
  },
  searchIcon: {
    marginRight: APP_SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: APP_COLORS.neutral950,
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  emptyCard: {
    padding: 0,
  },
  emptySearchCard: {
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  indexNumber: {
    fontSize: 11,
    fontWeight: '700',
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
  nimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  attendeeNim: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  attendeeTimeCol: {
    alignItems: 'flex-end',
    gap: 4,
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
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timestampText: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
  },
});

export default SessionRecapScreen;
