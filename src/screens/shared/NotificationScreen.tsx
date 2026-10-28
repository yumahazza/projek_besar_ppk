import React from 'react';
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
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface NotificationScreenProps {
  navigation: NavigationProp;
}

interface NotificationItem {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  message: string;
  timeAgo: string;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const { activeRole, activeSchedule, attendanceLogs } = useApp();

  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      iconName: 'notifications',
      iconBgColor: '#FEE2E2',
      iconColor: '#DC2626',
      title: 'Sesi baru dibuka',
      message: `${activeSchedule?.courseName || 'Pemrograman Mobile'} - Sesi telah dibuka oleh asisten`,
      timeAgo: '2 menit yang lalu',
    },
    {
      id: 'notif-2',
      iconName: 'shield-checkmark',
      iconBgColor: '#DCFCE7',
      iconColor: '#16A34A',
      title: 'Presensi mahasiswa',
      message: attendanceLogs[0]
        ? `${attendanceLogs[0].studentName} sudah melakukan presensi`
        : 'Presensi mahasiswa tercatat di sistem',
      timeAgo: '5 menit yang lalu',
    },
    {
      id: 'notif-3',
      iconName: 'calendar',
      iconBgColor: APP_COLORS.softBlue,
      iconColor: APP_COLORS.primary,
      title: 'Jadwal praktikum',
      message: 'Jadwal sesi praktikum semester ini telah diperbarui',
      timeAgo: '1 jam yang lalu',
    },
    {
      id: 'notif-4',
      iconName: 'alert-circle',
      iconBgColor: '#FEF3C7',
      iconColor: '#D97706',
      title: 'Peringatan',
      message: 'Jangan lupa melakukan presensi sebelum sesi berakhir',
      timeAgo: '3 jam yang lalu',
    },
    {
      id: 'notif-5',
      iconName: 'information-circle',
      iconBgColor: APP_COLORS.softBlue,
      iconColor: APP_COLORS.primary,
      title: 'Informasi',
      message: 'Pembaruan data kehadiran tersimpan secara realtime',
      timeAgo: 'Kemarin',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Notifikasi"
        onBack={() => navigation.goBack()}
        hasUnreadNotifications={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {notifications.map((item) => (
            <Card key={item.id} style={styles.notifCard}>
              <View style={styles.notifRow}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: item.iconBgColor },
                  ]}>
                  <Ionicons
                    name={item.iconName}
                    size={20}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.notifTime}>{item.timeAgo}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={APP_COLORS.neutral400}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
        activeTab={activeRole === 'assistant' ? 'AssistantHome' : 'StudentHome'}
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
  listContainer: {
    gap: APP_SPACING.sm,
  },
  notifCard: {
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  textContent: {
    flex: 1,
    paddingRight: APP_SPACING.sm,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: 12,
    color: APP_COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: APP_COLORS.textMuted,
  },
});

export default NotificationScreen;
