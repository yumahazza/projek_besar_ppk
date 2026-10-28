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

        {/* Greeting Section with Role Switcher Pill */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextGroup}>
            <Text style={styles.greetingName}>
              Halo, {activeUser.name.split(' ')[0]} 👋
            </Text>
            <Text style={styles.greetingRole}>Asisten Praktikum</Text>
          </View>
          <HeaderRolePicker compact />
        </View>

        {/* Sesi Aktif Hero Card */}
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
                {currentSchedule.time} | {currentSchedule.room}
              </Text>
            </View>
            <View style={styles.chevronWrapper}>
              <Ionicons name="chevron-forward" size={18} color={APP_COLORS.neutral500} />
            </View>
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
