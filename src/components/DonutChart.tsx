import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_COLORS, APP_SPACING } from '@/constants/theme';

export interface DonutChartProps {
  percentage: number;
  hadir: number;
  izin: number;
  alfa: number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  hadir,
  izin,
  alfa,
  size = 130,
}) => {
  const strokeWidth = 14;
  const innerSize = size - strokeWidth * 2;

  // Semantic color for the ring based on percentage
  const ringColor =
    percentage >= 75
      ? APP_COLORS.success
      : percentage >= 50
      ? APP_COLORS.warning
      : APP_COLORS.danger;

  return (
    <View style={styles.container}>
      {/* Donut Visualizer */}
      <View
        style={[
          styles.donutOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: '#E2E8F0',
            borderTopColor: ringColor,
            borderRightColor: ringColor,
            borderBottomColor: percentage > 50 ? ringColor : '#E2E8F0',
          },
        ]}>
        <View
          style={[
            styles.donutInner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}>
          <Text style={styles.percentText}>{percentage}%</Text>
        </View>
      </View>

      {/* Legend List */}
      <View style={styles.legendContainer}>
        {/* Hadir */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: APP_COLORS.success }]} />
          <Text style={styles.legendLabel}>Hadir</Text>
          <Text style={styles.legendValue}>{hadir}</Text>
        </View>

        {/* Izin */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: APP_COLORS.warning }]} />
          <Text style={styles.legendLabel}>Izin</Text>
          <Text style={styles.legendValue}>{izin}</Text>
        </View>

        {/* Alfa */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: APP_COLORS.danger }]} />
          <Text style={styles.legendLabel}>Alfa</Text>
          <Text style={styles.legendValue}>{alfa}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: APP_SPACING.lg,
    paddingHorizontal: APP_SPACING.md,
    backgroundColor: APP_COLORS.white,
    borderRadius: 12,
  },
  donutOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  donutInner: {
    backgroundColor: APP_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  percentText: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.navyHeading,
  },
  legendContainer: {
    justifyContent: 'center',
    gap: APP_SPACING.md,
    minWidth: 110,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_COLORS.navyHeading,
    marginLeft: 12,
  },
});

export default DonutChart;
