import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePracticum } from '@/context/PracticumContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { EmptyState } from '@/components/EmptyState';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function PraktikanRiwayatScreen() {
  const { currentUser, getStudentAttendance, getSessionById } = usePracticum();

  // Tampilkan presensi terbaru di bagian paling atas.
  const studentAttendance = currentUser
    ? [...getStudentAttendance(currentUser.id)].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  return (
    <ResponsiveContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Kehadiran</Text>
        <Text style={styles.subtitle}>
          Catatan presensi pribadi untuk {currentUser?.name || 'Praktikan'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {studentAttendance.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Belum Ada Riwayat Kehadiran"
            description="Presensi yang berhasil dilakukan akan muncul di sini."
          />
        ) : (
          <View style={styles.listContainer}>
            {studentAttendance.map((record) => {
              const session = getSessionById(record.sessionId);

              return (
                <View key={record.id} style={styles.recordCard}>
                  <View style={styles.recordLeft}>
                    <View style={styles.checkCircle}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={Colors.success}
                      />
                    </View>
                    <View style={styles.recordInfo}>
                      <Text style={styles.sessionName} numberOfLines={2}>
                        {session?.name || 'Sesi Praktikum'}
                      </Text>
                      <Text style={styles.classText} numberOfLines={1}>
                        {session?.classId || 'Kelas'} • {session?.room || 'Lab'}
                      </Text>
                      <View style={styles.metaRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.metaText}>
                          {session?.date || 'Hari ini'}
                        </Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.metaText}>{record.timestamp}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Hadir</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 1,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  classText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  metaDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusBadge: {
    alignSelf: 'center',
    flexShrink: 0,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
});
