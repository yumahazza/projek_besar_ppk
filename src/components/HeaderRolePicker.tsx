/**
 * Pemilih akun global untuk mengganti identitas praktikan/asisten.
 * Komponen fondasi: hanya memilih akun, tidak mengelola sesi atau presensi.
 */
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import type { User } from '@/data/users';
import { APP_COLORS, APP_RADIUS, APP_SPACING, APP_SHADOWS } from '@/constants/theme';

export interface HeaderRolePickerProps {
  compact?: boolean;
  showGreeting?: boolean;
}

export const HeaderRolePicker: React.FC<HeaderRolePickerProps> = ({
  compact = false,
  showGreeting = true,
}) => {
  const { activeUser, users, switchUser } = useApp();
  const [pickerOpen, setPickerOpen] = useState(false);
  const assistant = activeUser.role === 'assistant';

  const selectUser = (user: User) => {
    switchUser(user.id);
    setPickerOpen(false);
  };

  const triggerButton = (
    <Pressable
      onPress={() => setPickerOpen(true)}
      accessibilityRole="button"
      accessibilityLabel={`Ganti akun, saat ini ${activeUser.name}`}
      accessibilityHint="Buka daftar akun asisten dan praktikan"
      style={({ pressed }) => [
        styles.accountTrigger,
        assistant ? styles.accountAssistant : styles.accountStudent,
        pressed && styles.pressed,
      ]}>
      <Ionicons
        name={assistant ? 'shield-checkmark-outline' : 'school-outline'}
        size={16}
        color={assistant ? APP_COLORS.primary : APP_COLORS.opened}
      />
      <Text style={[styles.triggerText, assistant ? styles.textAssistant : styles.textStudent]}>
        {assistant ? 'Asisten' : 'Praktikan'}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={assistant ? APP_COLORS.primary : APP_COLORS.opened}
      />
    </Pressable>
  );

  return (
    <>
      {compact ? (
        triggerButton
      ) : showGreeting ? (
        <View style={styles.header}>
          <View style={styles.introduction}>
            <Text style={styles.greeting} numberOfLines={1}>
              Halo, {activeUser.name.split(' ')[0]}
            </Text>
            <Text style={styles.identity} numberOfLines={1}>
              {assistant ? 'Asisten Praktikum' : `Praktikan · ${activeUser.nim || '-'}`}
            </Text>
          </View>
          {triggerButton}
        </View>
      ) : (
        triggerButton
      )}

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
        statusBarTranslucent>
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickerOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Tutup pilihan akun"
          />
          <View style={[styles.sheet, APP_SHADOWS.modal]} accessibilityViewIsModal>
            <View style={styles.sheetHeading}>
              <View style={styles.sheetHeadingText}>
                <Text style={styles.sheetTitle}>Pilih akun</Text>
                <Text style={styles.sheetSubtitle}>
                  Gunakan akun asisten atau praktikan untuk melanjutkan.
                </Text>
              </View>
              <Pressable
                onPress={() => setPickerOpen(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Tutup">
                <Ionicons name="close" size={21} color={APP_COLORS.neutral700} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.accountList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {users.map((user) => {
                const selected = user.id === activeUser.id;
                const isAssistant = user.role === 'assistant';
                return (
                  <Pressable
                    key={user.id}
                    onPress={() => selectUser(user)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${user.name}, ${isAssistant ? 'Asisten Praktikum' : 'Praktikan'}${user.nim ? `, NIM ${user.nim}` : ''}`}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.avatar, isAssistant ? styles.avatarAssistant : styles.avatarStudent]}>
                      <Ionicons
                        name={isAssistant ? 'shield-checkmark-outline' : 'school-outline'}
                        size={20}
                        color={isAssistant ? APP_COLORS.primary : APP_COLORS.opened}
                      />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionName} numberOfLines={1}>{user.name}</Text>
                      <Text style={styles.optionDescription} numberOfLines={2}>
                        {isAssistant ? 'Asisten Praktikum' : `Praktikan${user.nim ? ` · ${user.nim}` : ''}`}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={selected ? APP_COLORS.primary : APP_COLORS.neutral300}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.xl,
    paddingVertical: APP_SPACING.md,
    gap: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.neutral200,
  },
  introduction: { flex: 1, minWidth: 0 },
  greeting: { fontSize: 17, lineHeight: 23, fontWeight: '700', color: APP_COLORS.neutral950 },
  identity: { fontSize: 12, lineHeight: 17, color: APP_COLORS.neutral500, marginTop: 2 },
  accountTrigger: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: APP_SPACING.md,
    borderWidth: 1,
    borderRadius: APP_RADIUS.pill,
  },
  accountAssistant: { backgroundColor: APP_COLORS.primary50, borderColor: APP_COLORS.primary100 },
  accountStudent: { backgroundColor: APP_COLORS.openedSoft, borderColor: '#BBF7D0' },
  triggerText: { fontSize: 13, fontWeight: '700' },
  textAssistant: { color: APP_COLORS.primary },
  textStudent: { color: APP_COLORS.opened },
  pressed: { opacity: 0.78 },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: APP_SPACING.xl,
  },
  sheet: {
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xl,
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
  },
  sheetHeading: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: APP_SPACING.lg },
  sheetHeadingText: { flex: 1, minWidth: 0, paddingTop: 3, paddingRight: APP_SPACING.sm },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: APP_COLORS.neutral950 },
  sheetSubtitle: { fontSize: 13, lineHeight: 19, color: APP_COLORS.neutral500, marginTop: 6 },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  accountList: { flexGrow: 0 },
  option: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.md,
    marginBottom: APP_SPACING.sm,
    backgroundColor: APP_COLORS.white,
  },
  optionSelected: { borderColor: APP_COLORS.primary500, backgroundColor: APP_COLORS.primary50 },
  avatar: { width: 40, height: 40, borderRadius: APP_RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
  avatarAssistant: { backgroundColor: APP_COLORS.primary100 },
  avatarStudent: { backgroundColor: APP_COLORS.openedSoft },
  optionContent: { flex: 1, minWidth: 0 },
  optionName: { fontSize: 15, lineHeight: 21, fontWeight: '600', color: APP_COLORS.neutral950 },
  optionDescription: { fontSize: 12, lineHeight: 18, color: APP_COLORS.neutral500, marginTop: 2 },
});

export default HeaderRolePicker;
