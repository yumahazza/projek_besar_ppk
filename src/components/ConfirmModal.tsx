/**
 * ConfirmModal Component
 * SRS-UI-002: Reusable confirmation modal dialog
 * Follows DSG.md Section 17 (Confirmation Modal)
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { APP_COLORS, APP_RADIUS, APP_SPACING, APP_SHADOWS } from '@/constants/theme';
import { CustomButton, ButtonVariant } from '@/components/CustomButton';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  details?: {
    courseName?: string;
    className?: string;
    time?: string;
    room?: string;
  };
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  subtitle,
  details,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, APP_SHADOWS.modal]}>
              {/* Header */}
              <Text style={styles.title}>{title}</Text>

              {/* Course Info Card (if provided) */}
              {details && (
                <View style={styles.detailsCard}>
                  {details.courseName && (
                    <Text style={styles.detailsTitle}>
                      {details.courseName}
                      {details.className ? ` — ${details.className}` : ''}
                    </Text>
                  )}
                  {details.time && (
                    <Text style={styles.detailsSub}>{details.time}</Text>
                  )}
                  {details.room && (
                    <Text style={styles.detailsSub}>{details.room}</Text>
                  )}
                </View>
              )}

              {/* Subtitle / Consequences */}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

              {/* Actions */}
              <View style={styles.actionsRow}>
                <View style={styles.actionBtnWrapper}>
                  <CustomButton
                    title={cancelText}
                    variant="outline"
                    onPress={onCancel}
                    disabled={loading}
                    size="md"
                  />
                </View>
                <View style={styles.actionBtnWrapper}>
                  <CustomButton
                    title={confirmText}
                    variant={confirmVariant}
                    onPress={onConfirm}
                    loading={loading}
                    size="md"
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: APP_SPACING.xxl,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: APP_COLORS.white,
    borderRadius: APP_RADIUS.xl,
    padding: APP_SPACING.xxl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: APP_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: APP_COLORS.neutral700,
    lineHeight: 20,
    marginBottom: APP_SPACING.xl,
  },
  detailsCard: {
    backgroundColor: APP_COLORS.primary50,
    borderColor: APP_COLORS.primary100,
    borderWidth: 1,
    borderRadius: APP_RADIUS.md,
    padding: APP_SPACING.md,
    marginVertical: APP_SPACING.md,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.neutral950,
    marginBottom: 2,
  },
  detailsSub: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: APP_SPACING.md,
    marginTop: APP_SPACING.sm,
  },
  actionBtnWrapper: {
    flex: 1,
  },
});

export default ConfirmModal;

