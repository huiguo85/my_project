import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { QuarterlyFinancial } from '@/lib/stock-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = 32; // 16px on each side
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;

interface FinancialChartProps {
  data: QuarterlyFinancial[];
  metric: 'revenue' | 'expenses' | 'ebitda' | 'netIncome';
  title: string;
  gradientStart: string;
  gradientEnd: string;
}

export function FinancialChart({
  data,
  metric,
  title,
  gradientStart,
  gradientEnd,
}: FinancialChartProps) {
  const chartData = data.map((item) => ({
    value: item[metric],
    quarter: item.quarter.split(' ')[0], // "Q1", "Q2", etc.
    year: item.quarter.split(' ')[1], // "2023", "2024", etc.
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const latestValue = chartData[chartData.length - 1]?.value ?? 0;
  const previousValue = chartData[chartData.length - 2]?.value ?? latestValue;
  const changePercent = ((latestValue - previousValue) / previousValue) * 100;
  const isPositive = changePercent >= 0;

  // Calculate YoY change (compare to same quarter last year)
  const yoyValue = chartData.length >= 5 ? chartData[chartData.length - 5]?.value : null;
  const yoyChange = yoyValue ? ((latestValue - yoyValue) / yoyValue) * 100 : null;

  // Calculate bar width to fit all bars on screen
  const barCount = chartData.length;
  const totalGap = (barCount - 1) * 2; // 2px gap between bars
  const barWidth = Math.floor((CHART_WIDTH - totalGap - 16) / barCount); // 16px for internal padding

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-4">
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-zinc-400 text-xs uppercase tracking-wider">
            {title}
          </Text>
          <Text className="text-white text-xl font-bold mt-1">
            ${latestValue.toFixed(1)}B
          </Text>
        </View>
        <View className="items-end">
          <View
            className={`px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}
          >
            <Text
              className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {isPositive ? '+' : ''}
              {changePercent.toFixed(1)}% QoQ
            </Text>
          </View>
          {yoyChange !== null && (
            <View
              className={`px-2 py-0.5 rounded-md mt-1 ${yoyChange >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}
            >
              <Text
                className={`text-xs font-semibold ${yoyChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}
              >
                {yoyChange >= 0 ? '+' : ''}
                {yoyChange.toFixed(1)}% YoY
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bar Chart - fits on screen */}
      <View className="flex-row items-end justify-between" style={{ height: 100 }}>
        {chartData.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * 80, 4);
          const isLatest = index === chartData.length - 1;
          const showYear = index === 0 || chartData[index - 1]?.year !== item.year;

          return (
            <Animated.View
              key={index}
              entering={FadeIn.delay(index * 30).duration(200)}
              className="items-center"
              style={{ width: barWidth }}
            >
              <View
                className={`rounded-t overflow-hidden ${isLatest ? 'border border-white/40' : ''}`}
                style={{
                  height: barHeight,
                  width: Math.max(barWidth - 2, 8),
                }}
              >
                <LinearGradient
                  colors={[gradientStart, gradientEnd]}
                  style={{ flex: 1 }}
                />
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Quarter labels */}
      <View className="flex-row justify-between mt-1">
        {chartData.map((item, index) => {
          const showYear = index === 0 || chartData[index - 1]?.year !== item.year;
          return (
            <View key={index} className="items-center" style={{ width: barWidth }}>
              <Text className="text-zinc-500 text-[9px]">
                {item.quarter}
              </Text>
              {showYear && (
                <Text className="text-zinc-400 text-[8px] font-medium">
                  {item.year}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface QuarterlyChartsProps {
  data: QuarterlyFinancial[];
}

export function QuarterlyCharts({ data }: QuarterlyChartsProps) {
  return (
    <View>
      <FinancialChart
        data={data}
        metric="revenue"
        title="Revenue"
        gradientStart="#3B82F6"
        gradientEnd="#1E40AF"
      />
      <FinancialChart
        data={data}
        metric="expenses"
        title="Operating Expenses"
        gradientStart="#F59E0B"
        gradientEnd="#B45309"
      />
      <FinancialChart
        data={data}
        metric="ebitda"
        title="EBITDA"
        gradientStart="#8B5CF6"
        gradientEnd="#5B21B6"
      />
      <FinancialChart
        data={data}
        metric="netIncome"
        title="Net Income"
        gradientStart="#10B981"
        gradientEnd="#047857"
      />
    </View>
  );
}
