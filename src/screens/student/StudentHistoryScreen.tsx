/**
 * StudentHistoryScreen Component
 * Programmer: Birela (Riwayat Praktikan, Empty State & Polish UI)
 * SRS-STU-004: Halaman riwayat presensi diri sendiri (chronological, detail, proof)
 * SRS-UI-003 / SRS-UI-004: Contextual Empty State jika belum ada catatan kehadiran
 * SRS-UI-005: Responsive Flexbox Layout & Polished UI
 * Follows DSG.md Section 10, 19, 21, 25, 26, 30
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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { CustomButton } from '@/components/CustomButton';
import { AttendanceRecord, Schedule } from '@/data/schedules';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
  APP_SHADOWS,
} from '@/constants/theme';

interface StudentHistoryScreenProps {
  navigation: NavigationProp;
}

type EnrichedAttendanceLog = AttendanceRecord & { schedule?: Schedule };

export const StudentHistoryScreen: React.FC<StudentHistoryScreenProps> = ({
  navigation,
}) => {
  const { activeUser, getStudentHistory } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedDetailRecord, setSelectedDetailRecord] =
    useState<EnrichedAttendanceLog | null>(null);

  // Ambil riwayat presensi mahasiswa aktif
  const rawHistoryLogs = getStudentHistory(activeUser.id);

  // SRS-STU-004: Urutan kronologis terbaru -> terlama
  const sortedLogs = useMemo(() => {
    return [...rawHistoryLogs].reverse();
  }, [rawHistoryLogs]);

  // Ekstrak daftar unik matakuliah untuk filter chip
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    sortedLogs.forEach((log) => {
      if (log.schedule?.courseName) {
        set.add(log.schedule.courseName);
      }
    });
    return Array.from(set);
  }, [sortedLogs]);

  // Filter pencarian dan chip filter
  const filteredLogs = useMemo(() => {
    return sortedLogs.filter((log) => {
      const courseName = (log.schedule?.courseName || '').toLowerCase();
      const dateText = (log.date || '').toLowerCase();
      const timeText = (log.timestamp || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        courseName.includes(query) ||
        dateText.includes(query) ||
        timeText.includes(query);

      const matchesCourse =
        selectedCourseFilter === 'ALL' ||
        log.schedule?.courseName === selectedCourseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [sortedLogs, searchQuery, selectedCourseFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar dengan Tombol Kembali */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Beranda Praktikan">
          <Ionicons name="arrow-back" size={22} color={APP_COLORS.neutral950} />
        </Pressable>
        <View style={styles.navTitleGroup}>
          <Text style={styles.navTitle}>Catatan Kehadiran Saya</Text>
          <Text style={styles.navSubtitle}>
            {activeUser.name} • {sortedLogs.length} Kehadiran
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* SRS-UI-005: Student Profile & Attendance Overview Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="school" size={24} color={APP_COLORS.opened} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{activeUser.name}</Text>
              <Text style={styles.profileMeta}>
                NIM: {activeUser.nim || '-'} • {activeUser.department || 'Teknik Informatika'}
              </Text>
              <Text style={styles.profileEmail}>
                {activeUser.email || `${activeUser.name.toLowerCase().replace(/\s+/g, '')}@univ.ac.id`}
              </Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsGrid}>
            <View style={[styles.metricBox, styles.metricBoxHighlight]}>
              <Text style={styles.metricNumber}>{sortedLogs.length}</Text>
              <Text style={styles.metricLabel}>Total Hadir</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricNumber}>100%</Text>
              <Text style={styles.metricLabel}>Kehadiran</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricNumber}>Aktif</Text>
              <Text style={styles.metricLabel}>Status Mahasiswa</Text>
            </View>
          </View>
        </Card>

        {/* Search & Filter Section (hanya jika ada riwayat) */}
        {sortedLogs.length > 0 && (
          <View style={styles.filterSection}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                color={APP_COLORS.neutral500}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari matakuliah, tanggal, atau jam..."
                placeholderTextColor={APP_COLORS.neutral500}
                style={styles.searchInput}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={APP_COLORS.neutral500}
                  />
                </Pressable>
              )}
            </View>

            {/* Filter Chips */}
            {uniqueCourses.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}>
                <Pressable
                  onPress={() => setSelectedCourseFilter('ALL')}
                  style={[
                    styles.chip,
                    selectedCourseFilter === 'ALL' && styles.chipActive,
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      selectedCourseFilter === 'ALL' && styles.chipTextActive,
                    ]}>
                    Semua ({sortedLogs.length})
                  </Text>
                </Pressable>
                {uniqueCourses.map((course) => {
                  const isActive = selectedCourseFilter === course;
                  const count = sortedLogs.filter(
                    (l) => l.schedule?.courseName === course
                  ).length;
                  return (
                    <Pressable
                      key={course}
                      onPress={() => setSelectedCourseFilter(course)}
                      style={[styles.chip, isActive && styles.chipActive]}>
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}>
                        {course} ({count})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Riwayat Praktikum</Text>
          {sortedLogs.length > 0 && (
            <Text style={styles.sectionSubtitleBadge}>
              {filteredLogs.length} Catatan
            </Text>
          )}
        </View>

        {/* SRS-UI-004: Empty State jika belum ada riwayat kehadiran */}
        {sortedLogs.length === 0 ? (
          <Card style={styles.emptyCardContainer}>
            <EmptyState
              iconName="calendar-outline"
              iconColor={APP_COLORS.primary}
              iconBgColor={APP_COLORS.primary50}
              badge="Belum Ada Presensi"
              title="Belum Ada Catatan Kehadiran"
              description="Anda belum memiliki catatan presensi pada sesi praktikum manapun. Hadiri praktikum dan lakukan presensi untuk melihat riwayat kehadiran Anda di sini."
              hint="Presensi akan tercatat secara instan setelah Anda menekan tombol 'Presensi Sekarang' pada sesi yang dibuka."
              actionTitle="Kembali ke Beranda Presensi"
              onActionPress={() => navigation.goBack()}
            />
          </Card>
        ) : filteredLogs.length === 0 ? (
          /* Empty Search Result */
          <Card style={styles.emptyCardContainer}>
            <EmptyState
              iconName="search-outline"
              iconColor={APP_COLORS.neutral500}
              iconBgColor={APP_COLORS.neutral100}
              title="Tidak Ditemukan"
              description={`Tidak ditemukan catatan kehadiran yang cocok dengan kata kunci "${searchQuery}".`}
              actionTitle="Reset Pencarian"
              onActionPress={() => {
                setSearchQuery('');
                setSelectedCourseFilter('ALL');
              }}
            />
          </Card>
        ) : (
          /* SRS-STU-004: Daftar Kartu Riwayat Kehadiran (Kronologis) */
          filteredLogs.map((log, index) => {
            return (
              <Card
                key={log.id}
                onPress={() => setSelectedDetailRecord(log)}
                style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.courseTitleGroup}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.courseNameWrapper}>
                      <Text style={styles.courseName}>
                        {log.schedule?.courseName || 'Praktikum'}
                      </Text>
                      <Text style={styles.classInfo}>
                        {log.schedule?.className || 'Reguler'} •{' '}
                        {log.schedule?.room || 'Laboratorium'}
                      </Text>
                    </View>
                  </View>
                  <StatusBadge status="HADIR" size="sm" />
                </View>

                <View style={styles.cardDivider} />

                {/* Footer: Tanggal, Waktu & Tanda Terima */}
                <View style={styles.cardFooter}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={APP_COLORS.neutral500}
                      />
                      <Text style={styles.metaText}>{log.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={APP_COLORS.opened}
                      />
                      <Text style={[styles.metaText, styles.metaHighlight]}>
                        {log.timestamp}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailLink}>
                    <Text style={styles.detailLinkText}>Lihat Bukti</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={APP_COLORS.primary}
                    />
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Modal Tanda Bukti Presensi Digital */}
      <Modal
        visible={!!selectedDetailRecord}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDetailRecord(null)}>
        <TouchableWithoutFeedback onPress={() => setSelectedDetailRecord(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalBox, APP_SHADOWS.modal]}>
                {/* Modal Header */}
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalIconCircle}>
                    <Ionicons
                      name="receipt-outline"
                      size={24}
                      color={APP_COLORS.primary}
                    />
                  </View>
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalTitle}>Bukti Presensi Digital</Text>
                    <Text style={styles.modalSubtitle}>
                      Tersimpan secara valid di sistem praktikum
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                {/* Receipt Details */}
                {selectedDetailRecord && (
                  <View style={styles.receiptContainer}>
                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Nama Praktikan</Text>
                      <Text style={styles.receiptVal}>{activeUser.name}</Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>NIM</Text>
                      <Text style={styles.receiptVal}>{activeUser.nim || '-'}</Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Mata Praktikum</Text>
                      <Text style={styles.receiptVal}>
                        {selectedDetailRecord.schedule?.courseName} —{' '}
                        {selectedDetailRecord.schedule?.className}
                      </Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Ruangan</Text>
                      <Text style={styles.receiptVal}>
                        {selectedDetailRecord.schedule?.room}
                      </Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Tanggal Presensi</Text>
                      <Text style={styles.receiptVal}>
                        {selectedDetailRecord.date}
                      </Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Waktu Kehadiran</Text>
                      <Text style={[styles.receiptVal, styles.receiptValHighlight]}>
                        {selectedDetailRecord.timestamp}
                      </Text>
                    </View>

                    <View style={styles.receiptItem}>
                      <Text style={styles.receiptKey}>Status Verifikasi</Text>
                      <View style={styles.verifiedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={APP_COLORS.opened}
                        />
                        <Text style={styles.verifiedText}>Terverifikasi Hadir</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Modal Action Button */}
                <View style={styles.modalActionWrapper}>
                  <CustomButton
                    title="Tutup"
                    variant="primary"
                    size="md"
                    onPress={() => setSelectedDetailRecord(null)}
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
  placeholder: {
    width: 34,
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
    padding: APP_SPACING.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  profileMeta: {
    fontSize: 13,
    color: APP_COLORS.neutral700,
    marginTop: 2,
    fontWeight: '500',
  },
  profileEmail: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    marginTop: APP_SPACING.lg,
    paddingTop: APP_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
  },
  metricBox: {
    flex: 1,
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.md,
    paddingVertical: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xs,
    alignItems: 'center',
  },
  metricBoxHighlight: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: APP_SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    paddingHorizontal: APP_SPACING.md,
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
  clearSearchBtn: {
    padding: 4,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: APP_SPACING.xs,
    paddingTop: APP_SPACING.sm,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: APP_SPACING.md,
    borderRadius: APP_RADIUS.pill,
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.neutral200,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary500,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_COLORS.neutral700,
  },
  chipTextActive: {
    color: APP_COLORS.primary,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
    marginTop: APP_SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  sectionSubtitleBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral700,
    backgroundColor: APP_COLORS.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
  },
  emptyCardContainer: {
    padding: 0,
  },
  historyCard: {
    marginBottom: APP_SPACING.md,
    padding: APP_SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitleGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  cardIndexBadge: {
    backgroundColor: APP_COLORS.neutral100,
    borderRadius: APP_RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: APP_SPACING.sm,
    marginTop: 2,
  },
  cardIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.neutral700,
  },
  courseNameWrapper: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  classInfo: {
    fontSize: 13,
    color: APP_COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    gap: APP_SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: APP_COLORS.neutral700,
  },
  metaHighlight: {
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xl,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xl,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
  },
  modalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  modalSubtitle: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: APP_COLORS.neutral200,
    marginVertical: APP_SPACING.md,
  },
  receiptContainer: {
    backgroundColor: APP_COLORS.neutral50,
    borderRadius: APP_RADIUS.md,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    padding: APP_SPACING.md,
    gap: 8,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptKey: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  receiptValHighlight: {
    color: APP_COLORS.opened,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: APP_RADIUS.pill,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
  modalActionWrapper: {
    marginTop: APP_SPACING.lg,
  },
});

export default StudentHistoryScreen;
