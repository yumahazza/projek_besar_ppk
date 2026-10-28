import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_COLORS, APP_RADIUS, APP_SPACING } from '@/constants/theme';

export interface SummaryMetricsProps {
  hadir: number;
  izin?: number;
  alfa?: number;
  total: number;
}

export const SummaryTile: React.FC<SummaryMetricsProps> = ({
  hadir,
  izin = 0,
  alfa = 0,
  total,
}) => {
  return (
    <View style={styles.grid}>
      {/* Tile Hadir */}
      <View style={[styles.tile, styles.tileHadir]}>
        <Text style={[styles.label, { color: APP_COLORS.success }]}>Hadir</Text>
        <Text style={[styles.value, { color: APP_COLORS.success }]}>{hadir}</Text>
      </View>

      {/* Tile Izin */}
      <View style={[styles.tile, styles.tileIzin]}>
        <Text style={[styles.label, { color: APP_COLORS.warning }]}>Izin</Text>
        <Text style={[styles.value, { color: APP_COLORS.warning }]}>{izin}</Text>
      </View>

      {/* Tile Alfa */}
      <View style={[styles.tile, styles.tileAlfa]}>
        <Text style={[styles.label, { color: APP_COLORS.danger }]}>Alfa</Text>
        <Text style={[styles.value, { color: APP_COLORS.danger }]}>{alfa}</Text>
      </View>

      {/* Tile Total */}
      <View style={[styles.tile, styles.tileTotal]}>
        <Text style={[styles.label, { color: APP_COLORS.textSecondary }]}>Total</Text>
        <Text style={[styles.value, { color: APP_COLORS.navyHeading }]}>{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    width: '100%',
    marginVertical: APP_SPACING.sm,
  },
  tile: {
    flex: 1,
    paddingVertical: APP_SPACING.md,
    paddingHorizontal: APP_SPACING.xs,
    borderRadius: APP_RADIUS.card,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileHadir: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  tileIzin: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  tileAlfa: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  tileTotal: {
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default SummaryTile;
