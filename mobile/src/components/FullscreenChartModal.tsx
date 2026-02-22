import React from 'react';
import { View, Text, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline } from 'react-native-svg';

interface FullscreenChartModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function FullscreenChartModal({ visible, onClose, title, children }: FullscreenChartModalProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  // After rotation, the content dimensions are swapped
  const landscapeWidth = SCREEN_HEIGHT;
  const landscapeHeight = SCREEN_WIDTH;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View className="flex-1 bg-zinc-950">
        {/* Rotate entire content 90 degrees */}
        <View
          style={{
            width: landscapeWidth,
            height: landscapeHeight,
            transform: [{ rotate: '90deg' }],
            position: 'absolute',
            left: (SCREEN_WIDTH - landscapeWidth) / 2,
            top: (SCREEN_HEIGHT - landscapeHeight) / 2,
          }}
        >
          {/* Header in landscape */}
          <View
            className="flex-row items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950"
            style={{ width: landscapeWidth }}
          >
            <Text className="text-white font-bold text-base flex-1">{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-2 rounded-lg active:bg-zinc-800"
            >
              <X size={20} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Content - scrollable */}
          <ScrollView
            style={{ flex: 1, width: landscapeWidth }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View className="p-3">{children}</View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface FullscreenLineChartProps {
  data: number[];
  title: string;
}

export function FullscreenLineChart({ data, title }: FullscreenLineChartProps) {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const chartWidth = SCREEN_HEIGHT - 100;
  const chartHeight = 300;
  const padding = 30;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - ((value - minVal) / range) * (chartHeight - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - data.length);
  const midDate = new Date(startDate);
  midDate.setDate(midDate.getDate() + Math.floor(data.length / 2));
  const endDate = new Date();

  const formatDate = (d: Date) => {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <View className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
      {/* Y-axis labels */}
      <View className="flex-row">
        <View className="w-10 justify-between" style={{ height: chartHeight }}>
          <Text className="text-zinc-400 text-xs">{maxVal.toFixed(1)}</Text>
          <Text className="text-zinc-400 text-xs">{((minVal + maxVal) / 2).toFixed(1)}</Text>
          <Text className="text-zinc-400 text-xs">{minVal.toFixed(1)}</Text>
        </View>

        {/* Chart SVG */}
        <View className="flex-1">
          <Svg width={chartWidth - 45} height={chartHeight}>
            <Polyline points={points} stroke="#3B82F6" strokeWidth="3" fill="none" />
          </Svg>
        </View>
      </View>

      {/* X-axis labels */}
      <View className="flex-row justify-between pl-10 pr-2 mt-2">
        <Text className="text-zinc-400 text-xs">{formatDate(startDate)}</Text>
        <Text className="text-zinc-400 text-xs">{formatDate(midDate)}</Text>
        <Text className="text-zinc-400 text-xs">{formatDate(endDate)}</Text>
      </View>
    </View>
  );
}

interface FullscreenBarChartProps {
  data: Array<{ value: number; label: string; year: string }>;
  title: string;
  gradientColors: [string, string];
  comparisonData?: Array<{ value: number; label: string; year: string }>;
  comparisonSymbol?: string;
  primarySymbol?: string;
}

export function FullscreenBarChart({
  data,
  title,
  gradientColors,
  comparisonData,
  comparisonSymbol,
  primarySymbol,
}: FullscreenBarChartProps) {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const isComparison = comparisonData && comparisonData.length > 0;

  // Use screen height as width for landscape
  const chartWidth = SCREEN_HEIGHT - 80;
  const barSpacing = isComparison ? 3 : 4;
  const barWidth = Math.max((chartWidth - (data.length - 1) * barSpacing) / data.length, isComparison ? 28 : 35);
  const maxValue = Math.max(
    ...data.map((d) => d.value),
    ...(comparisonData?.map((d) => d.value) ?? [])
  );

  // Calculate metrics
  const latestValue = data[data.length - 1]?.value ?? 0;
  const previousValue = data[data.length - 2]?.value ?? latestValue;
  const changePercent = previousValue !== 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = changePercent >= 0;

  const yoyIndex = Math.max(0, data.length - 5);
  const yoyValue = yoyIndex >= 0 && yoyIndex < data.length ? data[yoyIndex]?.value : null;
  const yoyChange = yoyValue ? ((latestValue - yoyValue) / yoyValue) * 100 : null;

  const compLatestValue = comparisonData?.[comparisonData.length - 1]?.value ?? 0;
  const compPreviousValue = comparisonData?.[comparisonData.length - 2]?.value ?? compLatestValue;
  const compChangePercent =
    compPreviousValue && compPreviousValue !== 0
      ? ((compLatestValue - compPreviousValue) / compPreviousValue) * 100
      : 0;
  const compYoYValue = comparisonData?.[yoyIndex]?.value;
  const compYoYChange = compYoYValue ? ((compLatestValue - compYoYValue) / compYoYValue) * 100 : null;

  return (
    <View className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
      {/* Metrics Header */}
      <View className="mb-3">
        <View className="flex-row justify-between items-start">
          <View>
            {/* Primary stock value */}
            <View className="mb-1.5">
              {isComparison && <Text className="text-zinc-500 text-[9px] mb-0.5">{primarySymbol}</Text>}
              <Text className="text-white text-xl font-bold">${latestValue.toFixed(1)}B</Text>
            </View>
            {/* Comparison stock value */}
            {isComparison && (
              <View>
                <Text className="text-zinc-500 text-[9px] mb-0.5">{comparisonSymbol}</Text>
                <Text className="text-amber-400 text-xl font-bold">${compLatestValue.toFixed(1)}B</Text>
              </View>
            )}
          </View>

          {/* QoQ and YoY metrics */}
          <View className="items-end">
            {!isComparison && (
              <Text className="text-[11px] text-zinc-300 leading-tight">
                <Text className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  QoQ {isPositive ? '+' : ''}
                  {changePercent.toFixed(1)}%
                </Text>
                {yoyChange !== null && (
                  <Text className={`ml-1 font-semibold ${yoyChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {' '}
                    YoY {yoyChange >= 0 ? '+' : ''}
                    {yoyChange.toFixed(1)}%
                  </Text>
                )}
              </Text>
            )}

            {isComparison && (
              <>
                <Text className="text-[10px] text-zinc-300 leading-tight">
                  <Text className="text-white font-semibold">{primarySymbol} </Text>
                  <Text className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    QoQ {isPositive ? '+' : ''}
                    {changePercent.toFixed(1)}%
                  </Text>
                  {yoyChange !== null && (
                    <Text className={`ml-1 font-semibold ${yoyChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      {' '}
                      YoY {yoyChange >= 0 ? '+' : ''}
                      {yoyChange.toFixed(1)}%
                    </Text>
                  )}
                </Text>

                <Text className="text-[10px] text-zinc-300 leading-tight mt-1">
                  <Text className="text-amber-400 font-semibold">{comparisonSymbol} </Text>
                  <Text
                    className={`font-semibold ${compChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    QoQ {compChangePercent >= 0 ? '+' : ''}
                    {compChangePercent.toFixed(1)}%
                  </Text>
                  {compYoYChange !== null && (
                    <Text
                      className={`ml-1 font-semibold ${compYoYChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}
                    >
                      {' '}
                      YoY {compYoYChange >= 0 ? '+' : ''}
                      {compYoYChange.toFixed(1)}%
                    </Text>
                  )}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Bars container */}
      <View className="bg-zinc-800 rounded-lg p-3">
        <View className="flex-row items-end" style={{ height: 240, gap: barSpacing }}>
          {data.map((item, index) => {
            const barHeight = Math.max((item.value / maxValue) * 200, 8);
            const compHeight = comparisonData?.[index]
              ? Math.max((comparisonData[index].value / maxValue) * 200, 8)
              : 0;
            const showYear = index === 0 || data[index - 1]?.year !== item.year;

            return (
              <View key={index} className="flex-1 items-center justify-end" style={{ height: 240 }}>
                {/* Bars */}
                <View className="flex-row items-end gap-1 w-full justify-center" style={{ height: 200 }}>
                  {/* Primary bar */}
                  <View
                    className="rounded-t"
                    style={{
                      height: barHeight,
                      width: isComparison ? (barWidth - 2) / 2 : barWidth - 6,
                    }}
                  >
                    <LinearGradient colors={gradientColors} style={{ flex: 1, borderRadius: 2 }} />
                  </View>

                  {/* Comparison bar */}
                  {isComparison && comparisonData?.[index] && (
                    <View
                      className="rounded-t"
                      style={{
                        height: compHeight,
                        width: (barWidth - 2) / 2,
                      }}
                    >
                      <LinearGradient colors={['#F59E0B', '#B45309']} style={{ flex: 1, borderRadius: 2 }} />
                    </View>
                  )}
                </View>

                {/* Quarter label */}
                <Text className="text-zinc-400 text-[8px] mt-1.5 text-center" numberOfLines={1}>
                  {item.label}
                </Text>

                {/* Year label */}
                {showYear && <Text className="text-zinc-500 text-[7px] font-medium mt-0.5">{item.year}</Text>}
              </View>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      {isComparison && (
        <View className="flex-row items-center justify-center gap-4 mt-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded" style={{ backgroundColor: gradientColors[0] }} />
            <Text className="text-white text-[10px] font-medium">{primarySymbol}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded bg-amber-500" />
            <Text className="text-amber-400 text-[10px] font-medium">{comparisonSymbol}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
