import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import type { Stock } from '@/lib/stock-data';
import { cn } from '@/lib/cn';
import { FullscreenChartModal, FullscreenLineChart } from './FullscreenChartModal';

type TechnicalView = 'list' | 'chart';
type ChartPeriod = '1year' | '3year';

interface TechnicalIndicatorsProps {
  stock: Stock;
}

interface IndicatorCardProps {
  title: string;
  value: number;
  unit?: string;
  status?: 'bullish' | 'neutral' | 'bearish';
  showTrend?: boolean;
  label?: string;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ title, value, unit = '', status = 'neutral', showTrend = false, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'bullish':
        return 'text-emerald-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'bullish':
        return 'bg-emerald-500/10';
      case 'bearish':
        return 'bg-red-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  return (
    <View className={cn('rounded-lg p-3 border border-zinc-800', getStatusBg())}>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-zinc-400 text-xs">{title}</Text>
        {label && <Text className="text-zinc-500 text-[10px] font-medium">{label}</Text>}
      </View>
      <View className="flex-row items-center justify-between">
        <Text className={cn('text-white font-semibold text-lg', getStatusColor())}>
          {value.toFixed(2)}{unit}
        </Text>
        {showTrend && (
          <View className="flex-row items-center ml-2">
            {status === 'bullish' ? (
              <TrendingUp size={16} color="#10B981" />
            ) : status === 'bearish' ? (
              <TrendingDown size={16} color="#EF4444" />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

interface SimpleLineChartProps {
  data: number[];
  title: string;
  height?: number;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, title, height = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <>
      <View className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 mb-3">
        {/* Header with title and expand button */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-semibold text-sm">{title}</Text>
          <Pressable
            onPress={() => setIsExpanded(true)}
            className="p-1 rounded active:bg-zinc-800"
          >
            <Maximize2 size={16} color="#9CA3AF" />
          </Pressable>
        </View>

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

      {/* Fullscreen modal */}
      <FullscreenChartModal
        visible={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={title}
      >
        <FullscreenLineChart data={data} title={title} />
      </FullscreenChartModal>
    </>
  );
};

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ stock }) => {
  const [view, setView] = useState<TechnicalView>('list');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('1year');

  const tech = stock.technicalIndicators;
  const price = stock.currentPrice;

  // Filter historical data based on period
  const filteredData = useMemo(() => {
    const days = chartPeriod === '1year' ? 365 : 1095;
    return stock.historicalTechnical.slice(-days);
  }, [stock.historicalTechnical, chartPeriod]);

  // Determine RSI status
  const getRSIStatus = (rsi: number): 'bullish' | 'bearish' | 'neutral' => {
    if (rsi > 70) return 'bearish'; // Overbought
    if (rsi < 30) return 'bullish'; // Oversold
    return 'neutral';
  };

  // Determine MACD status
  const getMACDStatus = (macd: number): 'bullish' | 'bearish' | 'neutral' => {
    if (macd > 0.5) return 'bullish';
    if (macd < -0.5) return 'bearish';
    return 'neutral';
  };

  // Determine Bollinger Band status
  const getBollingerStatus = (price: number, lower: number, upper: number): 'bullish' | 'bearish' | 'neutral' => {
    if (price > upper * 0.95) return 'bearish'; // Near upper band
    if (price < lower * 1.05) return 'bullish'; // Near lower band
    return 'neutral';
  };

  // Determine SMA status
  const getSMAStatus = (price: number, sma: number): 'bullish' | 'bearish' => {
    return price > sma ? 'bullish' : 'bearish';
  };

  const rsiStatus = getRSIStatus(tech.rsi);
  const macdStatus = getMACDStatus(tech.macd);
  const bollingerStatus = getBollingerStatus(price, tech.bollingerLower, tech.bollingerUpper);

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
          {/* RSI Section */}
          <View className="mb-4">
            <Text className="text-white font-semibold text-base mb-2">Momentum Indicators</Text>
            <View className="gap-2">
              <IndicatorCard
                title="RSI (14)"
                value={tech.rsi}
                unit=""
                status={rsiStatus}
                showTrend={true}
                label="Current"
              />
              <View className="flex-row gap-1 px-3">
                <View className="flex-1 bg-zinc-800 rounded px-2 py-1">
                  <Text className="text-zinc-500 text-[10px]">Overbought {'>'} 70</Text>
                </View>
                <View className="flex-1 bg-zinc-800 rounded px-2 py-1">
                  <Text className="text-zinc-500 text-[10px]">Oversold {'<'} 30</Text>
                </View>
              </View>
            </View>
          </View>

          {/* MACD Section */}
          <View className="mb-4">
            <Text className="text-white font-semibold text-base mb-2">MACD</Text>
            <View className="gap-2">
              <IndicatorCard
                title="MACD Line"
                value={tech.macd}
                unit=""
                status={macdStatus}
                showTrend={true}
                label="Current"
              />
              <IndicatorCard
                title="Signal Line"
                value={tech.macdSignal}
                unit=""
                status="neutral"
                label="Current"
              />
            </View>
          </View>

          {/* Bollinger Bands Section */}
          <View className="mb-4">
            <Text className="text-white font-semibold text-base mb-2">Bollinger Bands</Text>
            <View className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 mb-2">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-zinc-400 text-xs">Upper Band</Text>
                <Text className="text-white font-semibold text-sm">${tech.bollingerUpper.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-zinc-400 text-xs">Middle (SMA20)</Text>
                <Text className="text-blue-400 font-semibold text-sm">${tech.bollingerMiddle.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-zinc-400 text-xs">Lower Band</Text>
                <Text className="text-white font-semibold text-sm">${tech.bollingerLower.toFixed(2)}</Text>
              </View>
              <View className="border-t border-zinc-700 pt-2 mt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-zinc-400 text-xs">Current Price</Text>
                  <Text className={cn('font-semibold text-sm', bollingerStatus === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
                    ${price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Moving Averages Section */}
          <View className="mb-2">
            <Text className="text-white font-semibold text-base mb-2">Moving Averages</Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <View>
                  <Text className="text-zinc-400 text-xs mb-0.5">SMA 20</Text>
                  <Text className="text-white font-semibold">${tech.sma20.toFixed(2)}</Text>
                </View>
                <View className="items-end">
                  <Text className={cn('text-xs font-semibold', getSMAStatus(price, tech.sma20) === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
                    {getSMAStatus(price, tech.sma20) === 'bullish' ? '↑ Above' : '↓ Below'}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <View>
                  <Text className="text-zinc-400 text-xs mb-0.5">SMA 50</Text>
                  <Text className="text-white font-semibold">${tech.sma50.toFixed(2)}</Text>
                </View>
                <View className="items-end">
                  <Text className={cn('text-xs font-semibold', getSMAStatus(price, tech.sma50) === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
                    {getSMAStatus(price, tech.sma50) === 'bullish' ? '↑ Above' : '↓ Below'}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <View>
                  <Text className="text-zinc-400 text-xs mb-0.5">SMA 200</Text>
                  <Text className="text-white font-semibold">${tech.sma200.toFixed(2)}</Text>
                </View>
                <View className="items-end">
                  <Text className={cn('text-xs font-semibold', getSMAStatus(price, tech.sma200) === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
                    {getSMAStatus(price, tech.sma200) === 'bullish' ? '↑ Above' : '↓ Below'}
                  </Text>
                </View>
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
              data={filteredData.map((d) => d.rsi)}
              title="RSI Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.macd)}
              title="MACD Trend"
            />
            <SimpleLineChart
              data={filteredData.map((d) => d.bollingerMiddle)}
              title="Bollinger Middle Band Trend"
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default TechnicalIndicators;
