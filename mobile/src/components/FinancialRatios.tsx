import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import type { Stock } from '@/lib/stock-data';
import { cn } from '@/lib/cn';

type RatioView = 'list' | 'chart';
type ChartPeriod = '1year' | '3year';

interface FinancialRatiosProps {
  stock: Stock;
}

interface RatioItemProps {
  label: string;
  currentValue: number;
  oneYearValue?: number;
  threeYearValue?: number;
  format?: 'decimal' | 'percent' | 'currency';
  benchmark?: number;
  goodAbove?: boolean;
}

const RatioItem: React.FC<RatioItemProps> = ({
  label,
  currentValue,
  oneYearValue,
  threeYearValue,
  format = 'decimal',
  benchmark,
  goodAbove = true
}) => {
  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `$${value.toFixed(2)}`;
      default:
        return value.toFixed(2);
    }
  };

  const getHealthStatus = () => {
    if (benchmark === undefined) return 'neutral';
    if (goodAbove) {
      return currentValue > benchmark ? 'good' : 'concern';
    } else {
      return currentValue < benchmark ? 'good' : 'concern';
    }
  };

  const status = getHealthStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'text-emerald-400';
      case 'concern':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'good':
        return 'bg-emerald-500/10';
      case 'concern':
        return 'bg-red-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  return (
    <View className={cn('rounded-lg p-3 border border-zinc-800', getStatusBg())}>
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-400 text-sm flex-1">{label}</Text>
        <View className="flex-row items-center gap-3 flex-1 justify-end">
          {oneYearValue !== undefined && (
            <View className="items-center min-w-[40px]">
              <Text className="text-zinc-300 text-xs font-medium text-center">{formatValue(oneYearValue)}</Text>
            </View>
          )}
          {threeYearValue !== undefined && (
            <View className="items-center min-w-[40px]">
              <Text className="text-zinc-300 text-xs font-medium text-center">{formatValue(threeYearValue)}</Text>
            </View>
          )}
          <View className="items-center min-w-[40px]">
            <Text className={cn('text-sm font-semibold text-center', getStatusColor())}>
              {formatValue(currentValue)}
            </Text>
          </View>
          {status === 'good' ? (
            <TrendingUp size={14} color="#10B981" />
          ) : status === 'concern' ? (
            <TrendingDown size={14} color="#EF4444" />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const SimpleLineChart: React.FC<{ data: number[]; title: string; height?: number }> = ({ data, title, height = 150 }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 50; // Leave small margins
  const chartHeight = height;
  const padding = 15;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const midVal = (minVal + maxVal) / 2;

  // Calculate points for polyline
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - ((value - minVal) / range) * (chartHeight - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  // Calculate x-axis labels (start, middle, end)
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
    <View className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 mb-3">
      <Text className="text-white font-semibold text-sm mb-2">{title}</Text>
      <View>
        {/* Y-axis labels - minimal space */}
        <View className="flex-row">
          <View className="w-8 justify-between" style={{ height: chartHeight }}>
            <Text className="text-zinc-500 text-[7px]">{maxVal.toFixed(1)}</Text>
            <Text className="text-zinc-500 text-[7px]">{midVal.toFixed(1)}</Text>
            <Text className="text-zinc-500 text-[7px]">{minVal.toFixed(1)}</Text>
          </View>

          {/* Chart SVG */}
          <View className="flex-1">
            <Svg width={chartWidth - 30} height={chartHeight}>
              <Polyline points={points} stroke="#3B82F6" strokeWidth="2" fill="none" />
            </Svg>
          </View>
        </View>

        {/* X-axis labels */}
        <View className="flex-row justify-between pl-8 pr-2 mt-1">
          <Text className="text-zinc-500 text-[7px]">{formatDate(startDate)}</Text>
          <Text className="text-zinc-500 text-[7px]">{formatDate(midDate)}</Text>
          <Text className="text-zinc-500 text-[7px]">{formatDate(endDate)}</Text>
        </View>
      </View>
    </View>
  );
};

// Helper function to calculate rolling average
const calculateRollingAverage = (data: number[], days: number): number => {
  if (data.length === 0) return 0;
  const recentData = data.slice(-days);
  return recentData.reduce((a, b) => a + b, 0) / recentData.length;
};

export const FinancialRatios: React.FC<FinancialRatiosProps> = ({ stock }) => {
  const [view, setView] = useState<RatioView>('list');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('1year');

  const ratios = stock.financialRatios;

  // Filter historical data based on period
  const filteredData = useMemo(() => {
    const days = chartPeriod === '1year' ? 365 : 1095;
    return stock.historicalRatios.slice(-days);
  }, [stock.historicalRatios, chartPeriod]);

  // Calculate rolling averages for list view
  const oneYearPEAvg = useMemo(() => calculateRollingAverage(filteredData.map(d => d.pe), 365), [filteredData]);
  const threeYearPEAvg = useMemo(() => calculateRollingAverage(stock.historicalRatios.map(d => d.pe), 1095), [stock.historicalRatios]);

  const oneYearPSAvg = useMemo(() => calculateRollingAverage(filteredData.map(d => d.ps), 365), [filteredData]);
  const threeYearPSAvg = useMemo(() => calculateRollingAverage(stock.historicalRatios.map(d => d.ps), 1095), [stock.historicalRatios]);

  const oneYearROEAvg = useMemo(() => calculateRollingAverage(filteredData.map(d => d.roe), 365), [filteredData]);
  const threeYearROEAvg = useMemo(() => calculateRollingAverage(stock.historicalRatios.map(d => d.roe), 1095), [stock.historicalRatios]);

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-2">
      {/* View Toggle */}
      <View className="flex-row gap-2 mb-4">
        <Pressable
          onPress={() => setView('list')}
          className={cn(
            'flex-1 px-3 py-2 rounded-lg border',
            view === 'list'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-zinc-800 border-zinc-700'
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold text-center',
              view === 'list' ? 'text-white' : 'text-zinc-400'
            )}
          >
            List
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setView('chart')}
          className={cn(
            'flex-1 px-3 py-2 rounded-lg border',
            view === 'chart'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-zinc-800 border-zinc-700'
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold text-center',
              view === 'chart' ? 'text-white' : 'text-zinc-400'
            )}
          >
            Chart
          </Text>
        </Pressable>
      </View>

      {view === 'list' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Valuation Ratios */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-base">Valuation Ratios</Text>
              <View className="flex-row gap-3 items-center">
                <Text className="text-zinc-500 text-xs w-10 text-center">1Y</Text>
                <Text className="text-zinc-500 text-xs w-10 text-center">3Y</Text>
                <Text className="text-zinc-500 text-xs w-10 text-center">Curr</Text>
                <Text className="text-zinc-500 text-xs w-6 text-center">Trend</Text>
              </View>
            </View>
            <View className="gap-2">
              <RatioItem
                label="P/E Ratio"
                currentValue={ratios.pe}
                oneYearValue={oneYearPEAvg}
                threeYearValue={threeYearPEAvg}
                format="decimal"
                benchmark={20}
                goodAbove={false}
              />
              <RatioItem
                label="P/S Ratio"
                currentValue={ratios.ps}
                oneYearValue={oneYearPSAvg}
                threeYearValue={threeYearPSAvg}
                format="decimal"
                benchmark={3}
                goodAbove={false}
              />
              <RatioItem
                label="P/B Ratio"
                currentValue={ratios.pb}
                format="decimal"
                benchmark={2}
                goodAbove={false}
              />
              <RatioItem
                label="P/FCF Ratio"
                currentValue={ratios.pcf}
                format="decimal"
                benchmark={15}
                goodAbove={false}
              />
              <RatioItem
                label="PEG Ratio"
                currentValue={ratios.peg}
                format="decimal"
                benchmark={1}
                goodAbove={false}
              />
            </View>
          </View>

          {/* Profitability Ratios */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-base">Profitability Ratios</Text>
              <View className="flex-row gap-3 items-center">
                <Text className="text-zinc-500 text-xs w-10 text-center">1Y</Text>
                <Text className="text-zinc-500 text-xs w-10 text-center">3Y</Text>
                <Text className="text-zinc-500 text-xs w-10 text-center">Curr</Text>
                <Text className="text-zinc-500 text-xs w-6 text-center">Trend</Text>
              </View>
            </View>
            <View className="gap-2">
              <RatioItem
                label="ROE (Return on Equity)"
                currentValue={ratios.roe}
                oneYearValue={oneYearROEAvg}
                threeYearValue={threeYearROEAvg}
                format="percent"
                benchmark={15}
                goodAbove={true}
              />
              <RatioItem
                label="ROA (Return on Assets)"
                currentValue={ratios.roa}
                format="percent"
                benchmark={8}
                goodAbove={true}
              />
            </View>
          </View>

          {/* Leverage Ratios */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-base">Leverage Ratios</Text>
              <View className="flex-row gap-3 items-center">
                <Text className="text-zinc-500 text-xs w-10 text-center">Curr</Text>
                <Text className="text-zinc-500 text-xs w-6 text-center">Trend</Text>
              </View>
            </View>
            <View className="gap-2">
              <RatioItem
                label="Debt-to-Equity"
                currentValue={ratios.debtToEquity}
                format="decimal"
                benchmark={1}
                goodAbove={false}
              />
            </View>
          </View>

          {/* Liquidity Ratios */}
          <View className="mb-2">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-base">Liquidity Ratios</Text>
              <View className="flex-row gap-3 items-center">
                <Text className="text-zinc-500 text-xs w-10 text-center">Curr</Text>
                <Text className="text-zinc-500 text-xs w-6 text-center">Trend</Text>
              </View>
            </View>
            <View className="gap-2">
              <RatioItem
                label="Current Ratio"
                currentValue={ratios.currentRatio}
                format="decimal"
                benchmark={1.5}
                goodAbove={true}
              />
              <RatioItem
                label="Quick Ratio"
                currentValue={ratios.quickRatio}
                format="decimal"
                benchmark={1}
                goodAbove={true}
              />
            </View>
          </View>

          {/* Legend */}
          <View className="mt-4 pt-4 border-t border-zinc-800">
            <Text className="text-zinc-500 text-xs mb-2 font-medium">Interpretation Guide</Text>
            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-emerald-500" />
                <Text className="text-zinc-400 text-xs">Healthy / Good value</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-red-500" />
                <Text className="text-zinc-400 text-xs">Below benchmark / Concern</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View>
          {/* Chart Period Toggle */}
          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={() => setChartPeriod('1year')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border',
                chartPeriod === '1year'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-zinc-800 border-zinc-700'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  chartPeriod === '1year' ? 'text-white' : 'text-zinc-400'
                )}
              >
                1 Year
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setChartPeriod('3year')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border',
                chartPeriod === '3year'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-zinc-800 border-zinc-700'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  chartPeriod === '3year' ? 'text-white' : 'text-zinc-400'
                )}
              >
                3 Years
              </Text>
            </Pressable>
          </View>

          {/* Charts */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <SimpleLineChart
              data={filteredData.map((d) => d.pe)}
              title="P/E Ratio Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.ps)}
              title="P/S Ratio Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.pb)}
              title="P/B Ratio Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.roe)}
              title="ROE Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.debtToEquity)}
              title="Debt-to-Equity Trend"
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FinancialRatios;
