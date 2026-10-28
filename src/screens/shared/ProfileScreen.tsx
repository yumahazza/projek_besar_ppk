import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HeaderRolePicker } from '@/components/HeaderRolePicker';
import { CustomButton } from '@/components/CustomButton';
import { NavigationProp } from '@/navigation/navigationTypes';
import {
  APP_COLORS,
  APP_RADIUS,
  APP_SPACING,
} from '@/constants/theme';

interface ProfileScreenProps {
  navigation: NavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { activeUser, activeRole, resetDemoData } = useApp();

  const [activeModal, setActiveModal] = useState<
    'info' | 'settings' | 'help' | null
  >(null);

  const initial = (activeUser.name || 'U').charAt(0).toUpperCase();

  const handleResetData = () => {
    Alert.alert(
      'Reset Data Demo',
      'Apakah Anda yakin ingin mengembalikan semua jadwal dan status presensi ke data awal?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Reset',
          style: 'destructive',
          onPress: () => {
            resetDemoData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Academic Blue Header */}
      <AppHeader
        title="Profil"
        onBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.userNameText}>{activeUser.name}</Text>
          <Text style={styles.userRoleText}>
            {activeRole === 'assistant'
              ? 'Asisten Praktikum'
              : `NIM ${activeUser.nim || '-'}`}
          </Text>
          {activeUser.department ? (
            <Text style={styles.departmentText}>{activeUser.department}</Text>
          ) : null}
        </Card>

        {/* Menu Items List */}
        <View style={styles.menuList}>
          {/* Informasi Akun */}
          <Pressable
            onPress={() => setActiveModal('info')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="person-outline" size={20} color={APP_COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Informasi Akun</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={APP_COLORS.neutral400} />
          </Pressable>

          {/* Pengaturan */}
          <Pressable
            onPress={() => setActiveModal('settings')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="settings-outline" size={20} color={APP_COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Pengaturan</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={APP_COLORS.neutral400} />
          </Pressable>

          {/* Bantuan */}
          <Pressable
            onPress={() => setActiveModal('help')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="help-circle-outline" size={20} color={APP_COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Bantuan</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={APP_COLORS.neutral400} />
          </Pressable>

          {/* Ganti Akun / Role */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <Ionicons name="swap-horizontal" size={20} color={APP_COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>Ganti Akun / Peran</Text>
            </View>
            <HeaderRolePicker compact />
          </View>

          {/* Reset Demo Data */}
          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [
              styles.menuItem,
              styles.resetItem,
              pressed && styles.pressed,
            ]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, styles.resetIconBox]}>
                <Ionicons name="refresh-outline" size={20} color={APP_COLORS.danger} />
              </View>
              <Text style={[styles.menuLabel, styles.resetLabel]}>
                Reset Data Demo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={APP_COLORS.danger} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        visible={activeModal === 'info'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informasi Akun</Text>
            <View style={styles.infoModalList}>
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Nama Lengkap</Text>
                <Text style={styles.infoModalVal}>{activeUser.name}</Text>
              </View>
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Peran</Text>
                <Text style={styles.infoModalVal}>
                  {activeRole === 'assistant' ? 'Asisten Praktikum' : 'Praktikan'}
                </Text>
              </View>
              {activeUser.nim && (
                <View style={styles.infoModalRow}>
                  <Text style={styles.infoModalLabel}>NIM</Text>
                  <Text style={styles.infoModalVal}>{activeUser.nim}</Text>
                </View>
              )}
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Email</Text>
                <Text style={styles.infoModalVal}>{activeUser.email || '-'}</Text>
              </View>
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Departemen</Text>
                <Text style={styles.infoModalVal}>{activeUser.department || '-'}</Text>
              </View>
            </View>
            <CustomButton
              title="Tutup"
              variant="primary"
              size="md"
              onPress={() => setActiveModal(null)}
            />
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={activeModal === 'settings'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pengaturan Aplikasi</Text>
            <Text style={styles.modalSub}>
              Aplikasi berjalan dalam mode offline/demo akademik lokal.
            </Text>
            <View style={styles.infoModalList}>
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Versi Aplikasi</Text>
                <Text style={styles.infoModalVal}>v1.0.0 (Sprint 1)</Text>
              </View>
              <View style={styles.infoModalRow}>
                <Text style={styles.infoModalLabel}>Lingkungan</Text>
                <Text style={styles.infoModalVal}>Expo SDK 58 / React Native</Text>
              </View>
            </View>
            <CustomButton
              title="Selesai"
              variant="primary"
              size="md"
              onPress={() => setActiveModal(null)}
            />
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={activeModal === 'help'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Panduan Aplikasi PPK</Text>
            <Text style={styles.helpParagraph}>
              1. Asisten dapat membuka sesi praktikum untuk mengaktifkan presensi praktikan.
            </Text>
            <Text style={styles.helpParagraph}>
              2. Praktikan mencatatkan kehadiran dengan menekan {'"Presensi Sekarang"'}.
            </Text>
            <Text style={styles.helpParagraph}>
              3. Gunakan pemilih peran untuk beralih antara akun asisten dan praktikan.
            </Text>
            <CustomButton
              title="Mengerti"
              variant="primary"
              size="md"
              style={{ marginTop: APP_SPACING.md }}
              onPress={() => setActiveModal(null)}
            />
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation
        role={activeRole}
        activeTab="Profile"
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
  profileCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.xxl,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginBottom: APP_SPACING.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 4,
  },
  userRoleText: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginBottom: 2,
  },
  departmentText: {
    fontSize: 12,
    color: APP_COLORS.textMuted,
  },
  menuList: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.card,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_COLORS.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  resetItem: {
    borderBottomWidth: 0,
  },
  resetIconBox: {
    backgroundColor: '#FEF2F2',
  },
  resetLabel: {
    color: APP_COLORS.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.modal,
    padding: APP_SPACING.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    marginBottom: APP_SPACING.md,
  },
  infoModalList: {
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.lg,
  },
  infoModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoModalLabel: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
  },
  infoModalVal: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_COLORS.navyHeading,
  },
  helpParagraph: {
    fontSize: 13,
    color: APP_COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  pressed: {
    backgroundColor: '#F8FAFC',
  },
});

export default ProfileScreen;
