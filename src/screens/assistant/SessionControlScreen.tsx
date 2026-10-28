import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomButton } from '@/components/CustomButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface SessionControlScreenProps {
  navigation: NavigationProp;
}

export const SessionControlScreen: React.FC<SessionControlScreenProps> = ({
  navigation,
}) => {
  const {
    activeSchedule,
    schedules,
    openSession,
    closeSession,
    activeRole,
  } = useApp();

  const targetScheduleId = navigation.params?.scheduleId || activeSchedule?.id;
  const currentSchedule =
    schedules.find((s) => s.id === targetScheduleId) ||
    activeSchedule ||
    schedules[0];

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    action: 'open' | 'close';
  }>({
    visible: false,
    action: 'open',
  });

  const handleOpenModal = () => {
    setConfirmModal({ visible: true, action: 'open' });
  };

  const handleCloseModal = () => {
    setConfirmModal({ visible: true, action: 'close' });
  };

  const handleConfirmAction = () => {
    if (!currentSchedule) return;
    if (confirmModal.action === 'open') {
      openSession(currentSchedule.id);
    } else {
      closeSession(currentSchedule.id);
    }
    setConfirmModal({ visible: false, action: 'open' });
  };

  const isOpened = currentSchedule?.status === 'DIBUKA';
  const isFinished = currentSchedule?.status === 'SELESAI';
  const isNotOpened = currentSchedule?.status === 'BELUM_DIBUKA';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Kontrol Sesi"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Session Info Card */}
        {currentSchedule && (
          <Card style={styles.sessionCard}>
            <View style={styles.sessionRow}>
              <View style={styles.sessionIconBox}>
                <Ionicons name="lock-closed" size={18} color={APP_COLORS.primary} />
              </View>
              <View style={styles.sessionTextCol}>
                <Text style={styles.courseName}>{currentSchedule.courseName}</Text>
                <Text style={styles.sessionMeta}>
                  {currentSchedule.time} | {currentSchedule.room}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Status Sesi Card */}
        {currentSchedule && (
          <Card style={styles.statusCard}>
            <Text style={styles.statusCardTitle}>Status Sesi</Text>
            <View style={styles.statusBadgeRow}>
              <StatusBadge status={currentSchedule.status} size="md" />
            </View>
            <Text style={styles.statusDescText}>
              {isOpened
                ? 'Sesi sedang berlangsung'
                : isNotOpened
                ? 'Sesi belum dimulai'
                : 'Sesi telah ditutup & selesai'}
            </Text>
          </Card>
        )}

        {/* Action Buttons Section */}
        <View style={styles.actionButtonsContainer}>
          {isNotOpened && (
            <CustomButton
              title="Buka Sesi"
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="play" size={18} color={APP_COLORS.white} />}
              onPress={handleOpenModal}
            />
          )}

          {isOpened && (
            <>
              <CustomButton
                title="Tutup Sesi"
                variant="primary"
                size="lg"
                leftIcon={
                  <Ionicons name="power-outline" size={18} color={APP_COLORS.white} />
                }
                onPress={handleCloseModal}
              />
              <CustomButton
                title="Selesaikan Sesi"
                variant="outline"
                size="lg"
                style={styles.secondaryActionBtn}
                leftIcon={
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={APP_COLORS.navyHeading}
                  />
                }
                onPress={handleCloseModal}
              />
            </>
          )}

          {isFinished && (
            <CustomButton
              title="Sesi Telah Selesai"
              variant="outline"
              disabled
              size="lg"
              leftIcon={
                <Ionicons
                  name="checkmark-done"
                  size={18}
                  color={APP_COLORS.neutral500}
                />
              }
              onPress={() => {}}
            />
          )}
        </View>

        {/* Blue Info Callout Box */}
        <View style={styles.infoCallout}>
          <Ionicons
            name="information-circle"
            size={20}
            color={APP_COLORS.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoCalloutText}>
            Setelah sesi ditutup, presensi tidak dapat dilakukan lagi.
          </Text>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.action === 'open' ? 'Buka Sesi?' : 'Tutup Sesi?'}
        subtitle={
          confirmModal.action === 'open'
            ? 'Praktikan akan dapat melakukan presensi kehadiran setelah sesi dibuka.'
            : 'Setelah sesi ditutup, praktikan tidak dapat melakukan presensi lagi.'
        }
        details={{
          courseName: currentSchedule?.courseName,
          className: currentSchedule?.className,
          time: currentSchedule?.time,
          room: currentSchedule?.room,
        }}
        confirmText={confirmModal.action === 'open' ? 'Ya, Buka' : 'Tutup Sesi'}
        cancelText="Batal"
        confirmVariant={confirmModal.action === 'open' ? 'primary' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ visible: false, action: 'open' })}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
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
  sessionCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.md,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  sessionTextCol: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
  },
  statusCard: {
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.lg,
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: APP_SPACING.sm,
  },
  statusBadgeRow: {
    marginVertical: 4,
  },
  statusDescText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginTop: 6,
  },
  actionButtonsContainer: {
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.lg,
  },
  secondaryActionBtn: {
    marginTop: 2,
  },
  infoCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.softBlue,
    borderWidth: 1,
    borderColor: APP_COLORS.lightBlue,
    borderRadius: 10,
    padding: APP_SPACING.md,
  },
  infoIcon: {
    marginRight: APP_SPACING.sm,
  },
  infoCalloutText: {
    flex: 1,
    fontSize: 12,
    color: APP_COLORS.textPrimary,
    lineHeight: 18,
  },
});

export default SessionControlScreen;
