import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { EmptyState } from '@/components/EmptyState';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Agu: 7,
  Sep: 8,
  Okt: 9,
  Nov: 10,
  Des: 11,
};

// Mengubah tanggal dan waktu presensi menjadi angka untuk pengurutan.
function getAttendanceDateTime(date: string, timestamp: string): number {
  const [dayText, monthText, yearText] = date.split(' ');
  const day = Number(dayText);
  const month = MONTHS[monthText];
  const year = Number(yearText);

  const [timeText] = timestamp.split(' WIB');
  const [hoursText, minutesText, secondsText] = timeText.split(':');

  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);

  if (
    !Number.isInteger(day) ||
    month === undefined ||
    !Number.isInteger(year) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds)
  ) {
    return 0;
  }

  return new Date(
    year,
    month,
    day,
    hours,
    minutes,
    seconds
  ).getTime();
}

export default function PraktikanRiwayatScreen() {
  const { activeUser, getStudentHistory } = useApp();

  // kamus lokal
  // Ambil riwayat praktikan yang sedang aktif.
  const studentAttendance = activeUser
    ? [...getStudentHistory(activeUser.id)].sort(
        (a, b) =>
          getAttendanceDateTime(b.date, b.timestamp) -
          getAttendanceDateTime(a.date, a.timestamp)
      )
    : [];

  return (
    <ResponsiveContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Kehadiran</Text>
        <Text style={styles.subtitle}>
          Catatan presensi pribadi untuk {activeUser?.name || 'Praktikan'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {studentAttendance.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Belum Ada Riwayat Kehadiran"
            description="Presensi yang berhasil dilakukan akan muncul di sini."
          />
        ) : (
          <View style={styles.listContainer}>
            {studentAttendance.map((record) => {
              const session = record.schedule;

              return (
                <View key={record.id} style={styles.recordCard}>
                  <View style={styles.recordLeft}>
                    <View style={styles.checkCircle}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={APP_COLORS.opened}
                      />
                    </View>

                    <View style={styles.recordInfo}>
                      <Text style={styles.sessionName} numberOfLines={2}>
                        {session?.courseName || 'Sesi Praktikum'}
                      </Text>

                      <Text style={styles.classText} numberOfLines={1}>
                        {session?.className || 'Kelas'} | {session?.room || 'Lab'}
                      </Text>

                      <View style={styles.metaRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color={APP_COLORS.neutral500}
                        />
                        <Text style={styles.metaText}>
                          {record.date || 'Tanggal tidak tersedia'}
                        </Text>

                        <Text style={styles.metaDot}>|</Text>

                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={APP_COLORS.neutral500}
                        />
                        <Text style={styles.metaText}>
                          {record.timestamp}
                        </Text>
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
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.lg,
    paddingBottom: APP_SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.neutral950,
  },
  subtitle: {
    fontSize: 13,
    color: APP_COLORS.neutral500,
    marginTop: 2,
  },
  scrollContent: {
    padding: APP_SPACING.lg,
    paddingBottom: APP_SPACING.xxl,
  },
  listContainer: {
    gap: APP_SPACING.sm,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.sm,
    backgroundColor: APP_COLORS.white,
    padding: APP_SPACING.lg,
    borderRadius: APP_RADIUS.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.neutral200,
    shadowColor: APP_COLORS.neutral950,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 1,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.md,
    flex: 1,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.openedSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.neutral950,
    marginBottom: 2,
  },
  classText: {
    fontSize: 12,
    color: APP_COLORS.neutral500,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
  },
  metaDot: {
    fontSize: 11,
    color: APP_COLORS.neutral500,
  },
  statusBadge: {
    alignSelf: 'center',
    flexShrink: 0,
    backgroundColor: APP_COLORS.openedSoft,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: 4,
    borderRadius: APP_RADIUS.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: APP_COLORS.opened,
  },
});