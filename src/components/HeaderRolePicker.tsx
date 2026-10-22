/**
 * HeaderRolePicker Component
 * SRS-UI-001: Header Switcher at the top of the app to switch active roles & dummy profiles
 * Follows DSG.md Section 11 (Header & Role Switcher)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { User } from '@/data/users';
import { APP_COLORS, APP_RADIUS, APP_SPACING, APP_SHADOWS } from '@/constants/theme';

export const HeaderRolePicker: React.FC = () => {
  const { activeUser, users, switchUser, resetDemoData } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const isAssistant = activeUser.role === 'assistant';

  const handleSelectUser = (user: User) => {
    switchUser(user.id);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        {/* User Info Left Side */}
        <View style={styles.userGreeting}>
          <Text style={styles.greetingTitle} numberOfLines={1}>
            Halo, {activeUser.name.split(' ')[0]} 👋
          </Text>
          <Text style={styles.roleSubtitle}>
            {isAssistant
              ? 'Asisten Praktikum'
              : `Praktikan • ${activeUser.nim || 'NIM'}`}
          </Text>
        </View>

        {/* Role Switcher Pill Right Side */}
        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`Ganti role aktif, saat ini ${
            isAssistant ? 'Asisten' : 'Praktikan'
          }`}
          style={({ pressed }) => [
            styles.switcherPill,
            isAssistant ? styles.assistantPill : styles.studentPill,
            pressed && styles.pressed,
          ]}>
          <Ionicons
            name={isAssistant ? 'shield-checkmark' : 'school'}
            size={16}
            color={isAssistant ? APP_COLORS.primary : APP_COLORS.opened}
          />
          <Text
            style={[
              styles.switcherText,
              { color: isAssistant ? APP_COLORS.primary : APP_COLORS.opened },
            ]}>
            {isAssistant ? 'Asisten' : 'Praktikan'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={isAssistant ? APP_COLORS.primary : APP_COLORS.opened}
          />
        </Pressable>
      </View>

      {/* Switcher Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalSheet, APP_SHADOWS.modal]}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Pilih Akun Simulasi</Text>
                    <Text style={styles.modalSubtitle}>
                      Beralih peran untuk mencoba alur Asisten / Praktikan
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={APP_COLORS.neutral500} />
                  </Pressable>
                </View>

                <ScrollView style={styles.usersList}>
                  {users.map((user) => {
                    const isSelected = user.id === activeUser.id;
                    const isAst = user.role === 'assistant';

                    return (
                      <Pressable
                        key={user.id}
                        onPress={() => handleSelectUser(user)}
                        style={({ pressed }) => [
                          styles.userOptionCard,
                          isSelected && styles.userOptionCardSelected,
                          pressed && styles.pressed,
                        ]}>
                        <View
                          style={[
                            styles.avatarCircle,
                            isAst ? styles.avatarAssistant : styles.avatarStudent,
                          ]}>
                          <Ionicons
                            name={isAst ? 'shield-checkmark' : 'school'}
                            size={20}
                            color={isAst ? APP_COLORS.primary : APP_COLORS.opened}
                          />
                        </View>

                        <View style={styles.optionDetails}>
                          <View style={styles.nameRow}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <View
                              style={[
                                styles.roleTag,
                                isAst ? styles.roleTagAst : styles.roleTagStu,
                              ]}>
                              <Text
                                style={[
                                  styles.roleTagText,
                                  { color: isAst ? APP_COLORS.primary : APP_COLORS.opened },
                                ]}>
                                {isAst ? 'Asisten' : 'Praktikan'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.userMeta}>
                            {user.nim ? `NIM: ${user.nim} • ` : ''}
                            {user.department || user.email}
                          </Text>
                        </View>

                        {isSelected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color={APP_COLORS.primary}
                          />
                        ) : (
                          <View style={styles.unselectedRadio} />
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Reset demo data action */}
                <View style={styles.resetContainer}>
                  <Pressable
                    onPress={() => {
                      resetDemoData();
                      setModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.resetButton,
                      pressed && styles.pressed,
                    ]}>
                    <Ionicons
                      name="refresh-circle-outline"
                      size={18}
                      color={APP_COLORS.neutral500}
                    />
                    <Text style={styles.resetButtonText}>Reset Data Demo Sesi</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.xl,
    paddingVertical: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.neutral200,
  },
  userGreeting: {
    flex: 1,
    marginRight: APP_SPACING.md,
  },
  greetingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  roleSubtitle: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  switcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: APP_SPACING.md,
    borderRadius: APP_RADIUS.pill,
    borderWidth: 1,
    gap: 6,
  },
  assistantPill: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
  },
  studentPill: {
    backgroundColor: APP_COLORS.openedSoft,
    borderColor: '#BBF7D0',
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xl,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: APP_SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
  },
  modalSubtitle: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  usersList: {
    marginBottom: APP_SPACING.md,
  },
  userOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: APP_SPACING.md,
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    backgroundColor: APP_COLORS.white,
    marginBottom: APP_SPACING.sm,
  },
  userOptionCardSelected: {
    borderColor: APP_COLORS.primary500,
    backgroundColor: APP_COLORS.primary50,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: APP_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: APP_SPACING.md,
  },
  avatarAssistant: {
    backgroundColor: APP_COLORS.primary100,
  },
  avatarStudent: {
    backgroundColor: APP_COLORS.openedSoft,
  },
  optionDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: APP_RADIUS.pill,
  },
  roleTagAst: {
    backgroundColor: APP_COLORS.primary100,
  },
  roleTagStu: {
    backgroundColor: APP_COLORS.openedSoft,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userMeta: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  unselectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: APP_COLORS.neutral300,
  },
  resetContainer: {
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.neutral200,
    paddingTop: APP_SPACING.md,
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: APP_SPACING.md,
  },
  resetButtonText: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    fontWeight: '500',
  },
});

export default HeaderRolePicker;

