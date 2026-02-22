import React, { useState } from 'react';
import { View, Text, Dimensions, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, TrendingUp, BarChart2, LineChart as LineChartIcon, Maximize2 } from 'lucide-react-native';
import type {
  IncomeStatementData,
  BalanceSheetData,
  CashFlowData,
  FinancialStatement,
  Stock,
} from '@/lib/stock-data';
import { FullscreenChartModal, FullscreenBarChart } from './FullscreenChartModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

export type AggregationType = 'quarterly' | 'ttm' | 'annual';

// Simple chart component without aggregation toggle
interface SimpleChartProps {
  data: Array<{ value: number; label: string; year: string }>;
  title: string;
  gradientStart: string;
  gradientEnd: string;
  comparisonData?: Array<{ value: number; label: string; year: string }>;
  comparisonSymbol?: string;
  primarySymbol?: string;
  showYoYOverlay?: boolean;
}

export function SimpleChart({
  data,
  title,
  gradientStart,
  gradientEnd,
  comparisonData,
  comparisonSymbol,
  primarySymbol,
  showYoYOverlay,
}: SimpleChartProps) {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate YoY growth percentages for line chart
  const yoyGrowth = data.map((item, index) => {
    if (index < 4) return null;
    const prevYearValue = data[index - 4].value;
    return prevYearValue !== 0 ? ((item.value - prevYearValue) / prevYearValue) * 100 : 0;
  });

  const compYoYGrowth = comparisonData ? comparisonData.map((item, index) => {
    if (index < 4) return null;
    const prevYearValue = comparisonData[index - 4].value;
    return prevYearValue !== 0 ? ((item.value - prevYearValue) / prevYearValue) * 100 : 0;
  }) : undefined;

  const maxValue = Math.max(
    ...data.map((d) => d.value),
    ...(comparisonData?.map((d) => d.value) ?? [])
  );

  const maxYoY = Math.max(
    ...yoyGrowth.filter((v) => v !== null).map((v) => Math.abs(v ?? 0)),
    ...(compYoYGrowth?.filter((v) => v !== null).map((v) => Math.abs(v ?? 0)) ?? []),
    1 // Avoid division by zero
  );

  const latestValue = data[data.length - 1]?.value ?? 0;
  const previousValue = data[data.length - 2]?.value ?? latestValue;
  const changePercent = previousValue !== 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = changePercent >= 0;

  const yoyIndex = Math.max(0, data.length - 5);
  const yoyValue = yoyIndex >= 0 && yoyIndex < data.length ? data[yoyIndex]?.value : null;
  const yoyChange = yoyValue ? ((latestValue - yoyValue) / yoyValue) * 100 : null;

  // Comparison metrics
  const compLatestValue = comparisonData?.[comparisonData.length - 1]?.value ?? 0;
  const compPreviousValue = comparisonData?.[comparisonData.length - 2]?.value ?? compLatestValue;
  const compChangePercent = compPreviousValue && compPreviousValue !== 0
    ? ((compLatestValue - compPreviousValue) / compPreviousValue) * 100
    : 0;
  const compYoYValue = comparisonData?.[yoyIndex]?.value;
  const compYoYChange = compYoYValue ? ((compLatestValue - compYoYValue) / compYoYValue) * 100 : null;

  const isComparison = comparisonData && comparisonData.length > 0;

  // Calculate bar width to fit all data perfectly on screen with small gaps for visual appeal
  const barSpacing = 1; // Small gap for visual separation
  const barWidth = (CHART_WIDTH - 24 - (data.length - 1) * barSpacing) / data.length; // Account for gaps between bars

  return (
    <View className="bg-zinc-900 rounded-2xl p-3 mb-2">
      {/* Header with metrics */}
      <View className="mb-2">
        {/* Title row with expand button */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-zinc-400 text-xs uppercase tracking-wider font-semibold flex-1">{title}</Text>
          <Pressable
            onPress={() => setIsExpanded(true)}
            className="p-1 rounded active:bg-zinc-800"
          >
            <Maximize2 size={14} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Dollar amounts and metrics */}
        <View className="flex-row justify-between items-start">
          <View>
            {/* Primary stock value */}
            <View className="mb-1">
              <Text className="text-white text-sm font-bold">
                ${latestValue.toFixed(1)}B
              </Text>
            </View>
            {/* Comparison stock value */}
            {isComparison && (
              <Text className="text-amber-400 text-sm font-bold">
                ${compLatestValue.toFixed(1)}B
              </Text>
            )}
          </View>

          {/* QoQ and YoY metrics */}
          <View className="items-end">
            {/* Non-comparison mode: just show QoQ and YoY without ticker */}
            {!isComparison && (
              <Text className="text-[10px] text-zinc-300 leading-tight">
                <Text className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  QoQ {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
                </Text>
                {yoyChange !== null && (
                  <Text className={`ml-1 font-semibold ${yoyChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    YoY {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                  </Text>
                )}
              </Text>
            )}

            {/* Comparison mode: show ticker with spacing */}
            {isComparison && (
              <>
                <Text className="text-[10px] text-zinc-300 leading-tight">
                  <Text className="text-white font-semibold">{primarySymbol}</Text>
                  <Text className={`ml-2 font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    QoQ {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
                  </Text>
                  {yoyChange !== null && (
                    <Text className={`ml-1 font-semibold ${yoyChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      YoY {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                    </Text>
                  )}
                </Text>

                <Text className="text-[10px] text-zinc-300 leading-tight mt-1">
                  <Text className="text-amber-400 font-semibold">{comparisonSymbol}</Text>
                  <Text className={`ml-2 font-semibold ${compChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    QoQ {compChangePercent >= 0 ? '+' : ''}{compChangePercent.toFixed(1)}%
                  </Text>
                  {compYoYChange !== null && (
                    <Text className={`ml-1 font-semibold ${compYoYChange >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      YoY {compYoYChange >= 0 ? '+' : ''}{compYoYChange.toFixed(1)}%
                    </Text>
                  )}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Bar chart with optional YoY line overlay */}
      <View className="relative" style={{ height: 160 }}>
        {/* SVG-like overlay for line chart using absolute positioned elements */}
        {showYoYOverlay && (
          <View className="absolute inset-0 pointer-events-none">
            {/* Draw lines connecting YoY points */}
            {yoyGrowth.map((value, index) => {
              if (index === 0 || value === null || yoyGrowth[index - 1] === null) return null;

              const yMin = -maxYoY;
              const yMax = maxYoY;
              const yRange = yMax - yMin;

              const x1 = (barWidth * index);
              const x2 = (barWidth * (index + 1));

              const y1Val = yoyGrowth[index - 1]!;
              const y2Val = value;

              // Map values to pixel positions
              const y1 = 120 - ((y1Val - yMin) / yRange) * 80;
              const y2 = 120 - ((y2Val - yMin) / yRange) * 80;

              return (
                <View
                  key={`line-${index}`}
                  style={{
                    position: 'absolute',
                    left: x1,
                    top: y1,
                    width: x2 - x1,
                    height: Math.max(Math.abs(y2 - y1), 1),
                    borderTopWidth: 2,
                    borderTopColor: '#06B6D4',
                    opacity: 0.9,
                    transform: [{ rotate: `${Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)}deg` }],
                  }}
                />
              );
            })}
          </View>
        )}

        {/* Bars container - small gaps for visual appeal */}
        <View className="flex-row items-end" style={{ height: '100%', gap: 1 }}>
          {data.map((item, index) => {
            const barHeight = Math.max((item.value / maxValue) * 100, 4);
            const compHeight = comparisonData?.[index]
              ? Math.max((comparisonData[index].value / maxValue) * 100, 4)
              : 0;
            const isSelected = selectedBarIndex === index;
            const showYear = index === 0 || data[index - 1]?.year !== item.year;

            // YoY marker position
            const yoyVal = yoyGrowth[index];
            const yoyMarkerHeight = showYoYOverlay && yoyVal !== null
              ? Math.max(60 + (yoyVal / maxYoY) * 50, 0)
              : 0;

            const compYoYVal = compYoYGrowth?.[index];
            const compYoYMarkerHeight = showYoYOverlay && compYoYVal !== null && compYoYVal !== undefined
              ? Math.max(60 + (compYoYVal / maxYoY) * 50, 0)
              : 0;

            return (
              <Pressable
                key={index}
                onPress={() => setSelectedBarIndex(isSelected ? null : index)}
                className="items-end relative"
                style={{ width: barWidth }}
              >
                {/* Selected value label - displayed just above bar with automatic sizing */}
                {isSelected && (
                  <Text
                    className="text-white font-bold text-center"
                    style={{ fontSize: 7.5, marginBottom: -2, lineHeight: 10 }}
                    allowFontScaling={false}
                    numberOfLines={1}
                  >
                    ${item.value.toFixed(1)}B
                  </Text>
                )}

                {/* YoY line markers when overlay enabled */}
                {showYoYOverlay && yoyVal !== null && (
                  <View
                    className="absolute w-1 bg-cyan-400 rounded-full"
                    style={{
                      height: 2,
                      bottom: yoyMarkerHeight,
                      opacity: 0.9,
                    }}
                  />
                )}
                {showYoYOverlay && compYoYVal !== null && (
                  <View
                    className="absolute w-1 bg-orange-400 rounded-full"
                    style={{
                      height: 2,
                      bottom: compYoYMarkerHeight,
                      opacity: 0.7,
                    }}
                  />
                )}

                {/* Bars - with visual appeal and proper sizing */}
                <View className="flex-row items-end gap-1 relative justify-center" style={{ width: '100%', height: 140 }}>
                  {/* Primary bar - nicely rounded */}
                  <View
                    className={`rounded-t overflow-hidden ${isSelected ? 'border border-white/50' : ''}`}
                    style={{
                      height: barHeight,
                      width: comparisonData ? barWidth / 2 - 0.5 : barWidth,
                      position: 'relative',
                    }}
                  >
                    <LinearGradient colors={[gradientStart, gradientEnd]} style={{ flex: 1 }} />
                  </View>

                  {/* Comparison bar - nicely rounded */}
                  {isComparison && comparisonData?.[index] && (
                    <View
                      className="rounded-t overflow-hidden relative"
                      style={{ height: compHeight, width: barWidth / 2 - 0.5 }}
                    >
                      <LinearGradient colors={['#F59E0B', '#B45309']} style={{ flex: 1 }} />
                    </View>
                  )}
                </View>

                {/* Quarter label */}
                <View className="items-center mt-1" style={{ width: '100%' }}>
                  <Text className="text-zinc-500 text-[7px]">{item.label}</Text>
                </View>

                {/* Year label in x-axis */}
                {showYear && (
                  <View className="absolute -bottom-3" style={{ width: '100%', alignItems: 'center' }}>
                    <Text className="text-zinc-400 text-[6px] font-medium">{item.year}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* X-axis spacing for year labels */}
        <View style={{ height: 8 }} />
      </View>

      {/* Fullscreen modal */}
      <FullscreenChartModal
        visible={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={title}
      >
        <FullscreenBarChart
          data={data}
          title={title}
          gradientColors={[gradientStart, gradientEnd]}
          comparisonData={comparisonData}
          comparisonSymbol={comparisonSymbol}
          primarySymbol={primarySymbol}
        />
      </FullscreenChartModal>
    </View>
  );
}

// Aggregation toggle component
interface AggregationToggleProps {
  aggregation: AggregationType;
  onAggregationChange: (agg: AggregationType) => void;
  showYoYOverlay?: boolean;
  onToggleYoY?: (show: boolean) => void;
}

export function AggregationToggle({
  aggregation,
  onAggregationChange,
  showYoYOverlay,
  onToggleYoY
}: AggregationToggleProps) {
  const options: Array<{ id: AggregationType; label: string; icon: React.ReactNode }> = [
    { id: 'quarterly', label: 'Q', icon: <Calendar size={11} color={aggregation === 'quarterly' ? '#fff' : '#71717a'} /> },
    { id: 'ttm', label: 'TTM', icon: <TrendingUp size={11} color={aggregation === 'ttm' ? '#fff' : '#71717a'} /> },
    { id: 'annual', label: 'Y', icon: <BarChart2 size={11} color={aggregation === 'annual' ? '#fff' : '#71717a'} /> },
  ];

  return (
    <View className="flex-row bg-zinc-800 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <Pressable
          key={opt.id}
          onPress={() => onAggregationChange(opt.id)}
          className={`flex-row items-center gap-0.5 px-2 py-1.5 rounded-md ${
            aggregation === opt.id ? 'bg-blue-500' : ''
          }`}
        >
          {opt.icon}
          <Text
            className={`text-[9px] font-medium ${
              aggregation === opt.id ? 'text-white' : 'text-zinc-400'
            }`}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}

      {/* YoY overlay toggle button */}
      <Pressable
        onPress={() => onToggleYoY?.(!showYoYOverlay)}
        className={`flex-row items-center gap-0.5 px-2 py-1.5 rounded-md ml-1 ${
          showYoYOverlay ? 'bg-cyan-500' : 'bg-zinc-700'
        }`}
      >
        <LineChartIcon size={11} color={showYoYOverlay ? '#fff' : '#71717a'} />
        <Text
          className={`text-[9px] font-medium ${
            showYoYOverlay ? 'text-white' : 'text-zinc-400'
          }`}
        >
          YoY
        </Text>
      </Pressable>
    </View>
  );
}

// Helper functions for data aggregation
function calculateTTM<T extends { quarter: string }>(
  data: T[],
  getMetricValue: (item: T) => number,
  metricKey: string
): T[] {
  const ttmData: T[] = [];
  for (let i = 3; i < data.length; i++) {
    const ttmSum = data.slice(i - 3, i + 1).reduce((sum, item) => sum + getMetricValue(item), 0);
    ttmData.push({
      ...data[i],
      [metricKey]: ttmSum,
    });
  }
  return ttmData;
}

function calculateAnnual<T extends { quarter: string }>(
  data: T[],
  getMetricValue: (item: T) => number,
  metricKey: string
): T[] {
  const annualMap: Record<string, { quarter: string; [key: string]: number | string }> = {};

  data.forEach((item) => {
    const year = item.quarter.split(' ')[1];
    if (!annualMap[year]) {
      annualMap[year] = { quarter: `FY ${year}`, [metricKey]: 0 };
    }
    (annualMap[year][metricKey] as number) += getMetricValue(item);
  });

  const currentYear = new Date().getFullYear();
  const currentYearQuarters = data.filter((d) => d.quarter.includes(currentYear.toString()));
  const hasFourthQuarter = currentYearQuarters.some((d) => d.quarter.includes('Q4'));

  return Object.values(annualMap)
    .filter((item) => {
      const year = parseInt(item.quarter.split(' ')[1]);
      return year < currentYear || (year === currentYear && hasFourthQuarter);
    })
    .sort((a, b) => parseInt(a.quarter.split(' ')[1]) - parseInt(b.quarter.split(' ')[1])) as T[];
}

// Process data based on aggregation
function processData<T extends { quarter: string }>(
  data: T[],
  aggregation: AggregationType,
  getMetricValue: (item: T) => number,
  metricKey: string
): Array<{ value: number; label: string; year: string }> {
  let processedData = data;

  if (aggregation === 'ttm') {
    processedData = calculateTTM(data, getMetricValue, metricKey);
  } else if (aggregation === 'annual') {
    processedData = calculateAnnual(data, getMetricValue, metricKey);
  }

  return processedData.map((item) => ({
    value: getMetricValue(item),
    label: item.quarter.split(' ')[0],
    year: item.quarter.split(' ')[1],
  }));
}

// Tabs component for switching between financial statements
interface FinancialTabsProps {
  symbol: string;
  incomeStatement: IncomeStatementData[];
  balanceSheet: BalanceSheetData[];
  cashFlow: CashFlowData[];
  comparisonStock?: Stock | null;
  onExitComparison?: () => void;
}

export function FinancialTabs({
  symbol,
  incomeStatement,
  balanceSheet,
  cashFlow,
  comparisonStock,
  onExitComparison,
}: FinancialTabsProps) {
  const [activeTab, setActiveTab] = useState<FinancialStatement>('income');
  const [aggregation, setAggregation] = useState<AggregationType>('quarterly');
  const [showYoYOverlay, setShowYoYOverlay] = useState(false);

  const tabs: Array<{ id: FinancialStatement; label: string }> = [
    { id: 'income', label: 'Income' },
    { id: 'balance', label: 'Balance' },
    { id: 'cashflow', label: 'Cash Flow' },
  ];

  const isComparison = comparisonStock !== null && comparisonStock !== undefined;

  // Income statement metrics
  const revenueData = processData(incomeStatement, aggregation, (d) => d.revenue, 'revenue');
  const netIncomeData = processData(incomeStatement, aggregation, (d) => d.netIncome, 'netIncome');
  const grossProfitData = processData(incomeStatement, aggregation, (d) => d.grossProfit, 'grossProfit');
  const operatingIncomeData = processData(incomeStatement, aggregation, (d) => d.operatingIncome, 'operatingIncome');

  // Balance sheet metrics
  const totalAssetsData = processData(balanceSheet, aggregation, (d) => d.totalAssets, 'totalAssets');
  const totalEquityData = processData(balanceSheet, aggregation, (d) => d.totalEquity, 'totalEquity');
  const totalLiabilitiesData = processData(balanceSheet, aggregation, (d) => d.totalLiabilities, 'totalLiabilities');
  const cashData = processData(balanceSheet, aggregation, (d) => d.cashAndEquivalents, 'cashAndEquivalents');

  // Cash flow metrics
  const operatingCFData = processData(cashFlow, aggregation, (d) => d.operatingCashFlow, 'operatingCashFlow');
  const freeCashFlowData = processData(cashFlow, aggregation, (d) => d.freeCashFlow, 'freeCashFlow');
  const capexData = processData(cashFlow, aggregation, (d) => d.capitalExpenditures, 'capitalExpenditures');

  // Comparison data
  const compRevenueData = isComparison
    ? processData(comparisonStock.incomeStatement, aggregation, (d) => d.revenue, 'revenue')
    : undefined;
  const compNetIncomeData = isComparison
    ? processData(comparisonStock.incomeStatement, aggregation, (d) => d.netIncome, 'netIncome')
    : undefined;
  const compGrossProfitData = isComparison
    ? processData(comparisonStock.incomeStatement, aggregation, (d) => d.grossProfit, 'grossProfit')
    : undefined;
  const compOperatingIncomeData = isComparison
    ? processData(comparisonStock.incomeStatement, aggregation, (d) => d.operatingIncome, 'operatingIncome')
    : undefined;

  const compTotalAssetsData = isComparison
    ? processData(comparisonStock.balanceSheet, aggregation, (d) => d.totalAssets, 'totalAssets')
    : undefined;
  const compTotalEquityData = isComparison
    ? processData(comparisonStock.balanceSheet, aggregation, (d) => d.totalEquity, 'totalEquity')
    : undefined;
  const compTotalLiabilitiesData = isComparison
    ? processData(comparisonStock.balanceSheet, aggregation, (d) => d.totalLiabilities, 'totalLiabilities')
    : undefined;
  const compCashData = isComparison
    ? processData(comparisonStock.balanceSheet, aggregation, (d) => d.cashAndEquivalents, 'cashAndEquivalents')
    : undefined;

  const compOperatingCFData = isComparison
    ? processData(comparisonStock.cashFlow, aggregation, (d) => d.operatingCashFlow, 'operatingCashFlow')
    : undefined;
  const compFreeCashFlowData = isComparison
    ? processData(comparisonStock.cashFlow, aggregation, (d) => d.freeCashFlow, 'freeCashFlow')
    : undefined;
  const compCapexData = isComparison
    ? processData(comparisonStock.cashFlow, aggregation, (d) => d.capitalExpenditures, 'capitalExpenditures')
    : undefined;

  return (
    <View>
      {/* Header with tabs and aggregation toggle */}
      <View className="flex-row items-center justify-between mb-2">
        {/* Tab buttons */}
        <View className="flex-row bg-zinc-800 rounded-lg p-0.5">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-md ${
                activeTab === tab.id ? 'bg-zinc-700' : ''
              }`}
            >
              <Text
                className={`text-[11px] font-medium ${
                  activeTab === tab.id ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Aggregation toggle with YoY button */}
        <AggregationToggle
          aggregation={aggregation}
          onAggregationChange={setAggregation}
          showYoYOverlay={showYoYOverlay}
          onToggleYoY={setShowYoYOverlay}
        />
      </View>

      {/* Comparison header */}
      {isComparison && (
        <View className="flex-row items-center justify-between bg-blue-500/10 rounded-lg px-3 py-1.5 mb-2">
          <Text className="text-blue-400 text-xs font-medium">
            {symbol} vs {comparisonStock.symbol}
          </Text>
          <Pressable onPress={onExitComparison} className="px-2 py-0.5 bg-zinc-800 rounded">
            <Text className="text-zinc-400 text-[9px] font-medium">Exit</Text>
          </Pressable>
        </View>
      )}

      {/* Tab content - Income Statement */}
      {activeTab === 'income' && (
        <View>
          <SimpleChart
            data={revenueData}
            title="Revenue"
            gradientStart="#3B82F6"
            gradientEnd="#1E40AF"
            comparisonData={compRevenueData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={grossProfitData}
            title="Gross Profit"
            gradientStart="#10B981"
            gradientEnd="#047857"
            comparisonData={compGrossProfitData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={operatingIncomeData}
            title="Operating Income"
            gradientStart="#8B5CF6"
            gradientEnd="#5B21B6"
            comparisonData={compOperatingIncomeData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={netIncomeData}
            title="Net Income"
            gradientStart="#06B6D4"
            gradientEnd="#0891B2"
            comparisonData={compNetIncomeData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
        </View>
      )}

      {/* Tab content - Balance Sheet */}
      {activeTab === 'balance' && (
        <View>
          <SimpleChart
            data={totalAssetsData}
            title="Total Assets"
            gradientStart="#8B5CF6"
            gradientEnd="#5B21B6"
            comparisonData={compTotalAssetsData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={totalLiabilitiesData}
            title="Total Liabilities"
            gradientStart="#EF4444"
            gradientEnd="#B91C1C"
            comparisonData={compTotalLiabilitiesData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={totalEquityData}
            title="Total Equity"
            gradientStart="#10B981"
            gradientEnd="#047857"
            comparisonData={compTotalEquityData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={cashData}
            title="Cash & Equivalents"
            gradientStart="#3B82F6"
            gradientEnd="#1E40AF"
            comparisonData={compCashData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
        </View>
      )}

      {/* Tab content - Cash Flow */}
      {activeTab === 'cashflow' && (
        <View>
          <SimpleChart
            data={operatingCFData}
            title="Operating Cash Flow"
            gradientStart="#EC4899"
            gradientEnd="#BE185D"
            comparisonData={compOperatingCFData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={freeCashFlowData}
            title="Free Cash Flow"
            gradientStart="#10B981"
            gradientEnd="#047857"
            comparisonData={compFreeCashFlowData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
          <SimpleChart
            data={capexData}
            title="Capital Expenditures"
            gradientStart="#F59E0B"
            gradientEnd="#B45309"
            comparisonData={compCapexData}
            comparisonSymbol={comparisonStock?.symbol}
            primarySymbol={symbol}
            showYoYOverlay={showYoYOverlay}
          />
        </View>
      )}
    </View>
  );
}
