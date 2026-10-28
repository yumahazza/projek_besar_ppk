import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SummaryTile } from '@/components/SummaryTile';
import { HeaderRolePicker } from '@/components/HeaderRolePicker';
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

  const targetScheduleForModal =
    schedules.find((s) => s.id === confirmModal.scheduleId) || currentSchedule;

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
    const { action, scheduleId } = confirmModal;
    const target = schedules.find((s) => s.id === scheduleId) || currentSchedule;

    if (action === 'open') {
      openSession(scheduleId);
      showNotification(
        `Sesi "${target?.courseName} - ${target?.className}" berhasil DIBUKA.`,
        'success'
      );
    } else {
      closeSession(scheduleId);
      showNotification(
        `Sesi "${target?.courseName} - ${target?.className}" telah DITUTUP.`,
        'info'
      );
    }
    setConfirmModal({ visible: false, action: 'open', scheduleId: '' });
  };

  const attendancePercent = currentSchedule && currentSchedule.totalStudents > 0
    ? Math.round((attendanceList.length / currentSchedule.totalStudents) * 100)
    : 0;
  const totalAttendance = schedules.reduce(
    (total, schedule) => total + getAttendanceForSchedule(schedule.id).length,
    0
  );
  const openSessions = schedules.filter((schedule) => schedule.status === 'DIBUKA').length;
  const totalRegistered = currentSchedule?.totalStudents || 20;
  const hadirCount = attendanceList.length;
  const izinCount = 0;
  const alfaCount = Math.max(0, totalRegistered - hadirCount);

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
              size={18}
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

        {/* User Greeting & Header Role Picker */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextGroup}>
            <Text style={styles.greetingName}>
              Halo, {activeUser.name.split(' ')[0]} 👋
            </Text>
            <Text style={styles.greetingRole}>
              Asisten Praktikum
            </Text>
          </View>
          <HeaderRolePicker compact />
        </View>

        {/* Assistant dashboard heading */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionEyebrowRow}>
            <View style={styles.eyebrowIcon}>
              <Ionicons name="grid-outline" size={14} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.sectionEyebrow}>RUANG KERJA ASISTEN</Text>
          </View>
          <Text style={styles.sectionTitle}>Kelola sesi praktikum</Text>
          <Text style={styles.sectionSubtitle}>
            Pantau sesi, buka presensi, dan tinjau kehadiran praktikan dari satu tempat.
          </Text>
        </View>

        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, styles.overviewCardPrimary]}>
            <View style={styles.overviewIcon}>
              <Ionicons name="calendar-outline" size={18} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.overviewValue}>{schedules.length}</Text>
            <Text style={styles.overviewLabel}>Total kelas</Text>
          </View>
          <View style={[styles.overviewCard, styles.overviewCardGreen]}>
            <View style={styles.overviewIcon}>
              <Ionicons name="radio-outline" size={18} color={APP_COLORS.opened} />
            </View>
            <Text style={styles.overviewValue}>{openSessions}</Text>
            <Text style={styles.overviewLabel}>Sesi aktif</Text>
          </View>
          <View style={[styles.overviewCard, styles.overviewCardPurple]}>
            <View style={styles.overviewIcon}>
              <Ionicons name="people-outline" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.overviewValue}>{totalAttendance}</Text>
            <Text style={styles.overviewLabel}>Total hadir</Text>
          </View>
        </View>

        <View style={styles.todaySectionHeader}>
          <View>
            <Text style={styles.todayTitle}>Jadwal hari ini</Text>
            <Text style={styles.todaySubtitle}>Pilih kelas untuk mengelola sesi</Text>
          </View>
          <View style={styles.todayBadge}>
            <Ionicons name="time-outline" size={14} color={APP_COLORS.primary} />
            <Text style={styles.todayBadgeText}>Live view</Text>
          </View>
        </View>

        {/* SRS-AST-001: Active Schedule Hero Card */}
        {currentSchedule && (
          <Card
            onPress={() => {
              setActiveScheduleId(currentSchedule.id);
              navigation.navigate('SessionDetail', { scheduleId: currentSchedule.id });
            }}
            style={[
              styles.activeCard,
              currentSchedule.status === 'DIBUKA' && styles.activeCardOpen,
            ]}>
            <View style={styles.activeCardTop}>
              <View style={styles.activeCardTitleRow}>
                <Text style={styles.activeCardBadgeLabel}>Sesi Aktif</Text>
                <StatusBadge status={currentSchedule.status} size="sm" />
              </View>
              <Text style={styles.activeCourseName}>
                {currentSchedule.courseName}
              </Text>
              <Text style={styles.activeCourseMeta}>
                {currentSchedule.time} | {currentSchedule.room} • {attendancePercent}% Hadir
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (currentSchedule.status === 'DIBUKA') {
                  handleCloseSessionModal(currentSchedule.id);
                } else {
                  handleOpenSessionModal(currentSchedule.id);
                }
              }}
              style={({ pressed }) => [
                styles.quickToggleBtn,
                currentSchedule.status === 'DIBUKA'
                  ? styles.quickToggleClose
                  : styles.quickToggleOpen,
                pressed && styles.pressed,
              ]}>
              <Ionicons
                name={currentSchedule.status === 'DIBUKA' ? 'pause' : 'play'}
                size={14}
                color={
                  currentSchedule.status === 'DIBUKA'
                    ? APP_COLORS.danger
                    : APP_COLORS.primary
                }
              />
              <Text
                style={[
                  styles.quickToggleText,
                  currentSchedule.status === 'DIBUKA'
                    ? styles.quickToggleTextDanger
                    : styles.quickToggleTextPrimary,
                ]}>
                {currentSchedule.status === 'DIBUKA' ? 'Tutup' : 'Buka'}
              </Text>
            </Pressable>
          </Card>
        )}

        {/* 4 Quick Action Shortcuts Grid */}
        <View style={styles.quickActionsGrid}>
          {/* Rekap */}
          <Pressable
            onPress={() =>
              navigation.navigate('SessionRecap', { scheduleId: currentSchedule.id })
            }
            style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]}>
            <View style={styles.actionIconBox}>
              <Ionicons name="stats-chart" size={20} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.actionTileLabel}>Rekap</Text>
          </Pressable>

          {/* Jadwal */}
          <Pressable
            onPress={() => navigation.navigate('ScheduleList')}
            style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]}>
            <View style={styles.actionIconBox}>
              <Ionicons name="calendar" size={20} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.actionTileLabel}>Jadwal</Text>
          </Pressable>

          {/* Presensi / Kontrol Sesi */}
          <Pressable
            onPress={() =>
              navigation.navigate('SessionControl', { scheduleId: currentSchedule.id })
            }
            style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]}>
            <View style={styles.actionIconBox}>
              <Ionicons name="shield-checkmark" size={20} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.actionTileLabel}>Presensi</Text>
          </Pressable>

          {/* Mahasiswa */}
          <Pressable
            onPress={() =>
              navigation.navigate('StudentList', { scheduleId: currentSchedule.id })
            }
            style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]}>
            <View style={styles.actionIconBox}>
              <Ionicons name="people" size={20} color={APP_COLORS.primary} />
            </View>
            <Text style={styles.actionTileLabel}>Mahasiswa</Text>
          </Pressable>
        </View>

        {/* Summary Metrics (4 compact tiles) */}
        <SummaryTile
          hadir={hadirCount}
          izin={izinCount}
          alfa={alfaCount}
          total={totalRegistered}
        />

        {/* Section Jadwal Hari Ini */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.scheduleSectionTitle}>Jadwal Hari Ini</Text>
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

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.action === 'open' ? 'Buka Sesi?' : 'Tutup Sesi?'}
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
        confirmText={confirmModal.action === 'open' ? 'Ya, Buka' : 'Tutup Sesi'}
        cancelText="Batal"
        confirmVariant={confirmModal.action === 'open' ? 'primary' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmModal({ visible: false, action: 'open', scheduleId: '' })
        }
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        role="assistant"
        activeTab="AssistantHome"
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
  sectionHeader: {
    marginBottom: APP_SPACING.lg,
  },
  sectionEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
  },
  eyebrowIcon: {
    width: 26,
    height: 26,
    borderRadius: APP_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.primary100,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: APP_COLORS.primary,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: APP_COLORS.neutral500,
    marginTop: 6,
    lineHeight: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.xxl,
  },
  overviewCard: {
    flex: 1,
    minHeight: 104,
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
  },
  overviewCardPrimary: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
  },
  overviewCardGreen: {
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#BBF7D0',
  },
  overviewCardPurple: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  overviewIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.white,
  },
  overviewValue: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginTop: APP_SPACING.sm,
  },
  overviewLabel: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
    marginTop: 1,
  },
  todaySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: APP_SPACING.md,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  todaySubtitle: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 3,
  },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 6,
    borderRadius: APP_RADIUS.pill,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  activeCardOpen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  activeCardTop: {
    flex: 1,
  },
  activeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingRight: APP_SPACING.sm,
  },
  activeCardBadgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeCourseName: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 4,
  },
  activeCourseMeta: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  chevronWrapper: {
    paddingLeft: APP_SPACING.xs,
  },
  quickToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 8,
    borderRadius: APP_RADIUS.pill,
    borderWidth: 1,
  },
  quickToggleOpen: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
  },
  quickToggleClose: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  quickToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quickToggleTextPrimary: {
    color: APP_COLORS.primary,
  },
  quickToggleTextDanger: {
    color: APP_COLORS.danger,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    marginVertical: APP_SPACING.sm,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionTileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: APP_SPACING.lg,
    marginBottom: APP_SPACING.sm,
  },
  scheduleSectionTitle: {
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
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    marginBottom: APP_SPACING.md,
  },
  bannerSuccess: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  bannerInfo: {
    backgroundColor: APP_COLORS.softBlue,
    borderWidth: 1,
    borderColor: APP_COLORS.lightBlue,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: APP_COLORS.navyHeading,
    marginLeft: APP_SPACING.sm,
  },
  closeNotification: {
    padding: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default AssistantHomeScreen;
