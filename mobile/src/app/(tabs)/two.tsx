import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TrendingUp, TrendingDown, X, Crown, ChevronDown } from 'lucide-react-native';
import { SP500_STOCKS, type SP500Stock, formatPercent, formatBillions } from '@/lib/stock-data';
import { TreemapHeatmap } from '@/components/Heatmap';
import { cn } from '@/lib/cn';

type HeatmapIndex = 'sp500' | 'nasdaq' | 'dow' | 'watchlist' | 'portfolio';
type TimePeriod = 'today' | '1week' | '1month' | 'ytd' | '1year';

export default function HeatmapScreen() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<HeatmapIndex>('sp500');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('today');
  const [selectedStock, setSelectedStock] = useState<SP500Stock | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock data for different indices
  const getStocksForIndex = (): SP500Stock[] => {
    // In a real app, these would be different data sources
    return SP500_STOCKS;
  };

  const stocks = useMemo(() => getStocksForIndex(), [selectedIndex]);

  const handleStockPress = (stock: SP500Stock) => {
    setSelectedStock(stock);
  };

  const periodLabels: Record<TimePeriod, string> = {
    today: 'Today',
    '1week': '1 Week',
    '1month': '1 Month',
    ytd: 'YTD',
    '1year': '1 Year',
  };

  const indexTabs = [
    { value: 'sp500' as const, label: 'S&P 500' },
    { value: 'nasdaq' as const, label: 'NASDAQ 100' },
    { value: 'dow' as const, label: 'DOW' },
    { value: 'watchlist' as const, label: 'Watchlist' },
    { value: 'portfolio' as const, label: 'Portfolio' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-3 border-b border-zinc-800">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-zinc-400 text-sm">Market Overview</Text>
            <Pressable
              onPress={() => router.push('/subscription')}
              className="bg-amber-500/20 px-3 py-2 rounded-xl flex-row items-center active:opacity-70"
            >
              <Crown size={14} color="#F59E0B" />
              <Text className="text-amber-500 font-semibold ml-1 text-xs">
                PRO
              </Text>
            </Pressable>
          </View>

          {/* Index Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
          >
            <View className="flex-row gap-2">
              {indexTabs.map((tab) => (
                <Pressable
                  key={tab.value}
                  onPress={() => setSelectedIndex(tab.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg border',
                    selectedIndex === tab.value
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-zinc-900 border-zinc-800'
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold',
                      selectedIndex === tab.value
                        ? 'text-white'
                        : 'text-zinc-400'
                    )}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Time Period Dropdown and Market Status */}
          <View className="flex-row items-center gap-2">
            {/* Market Status */}
            <View className="flex-1 bg-zinc-900 rounded-lg p-2.5 border border-zinc-800 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-zinc-400 text-xs">Market Open</Text>
            </View>

            {/* Time Period Dropdown */}
            <View className="relative flex-1">
              <Pressable
                onPress={() => setShowDropdown(!showDropdown)}
                className="flex-row items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5"
              >
                <Text className="text-white text-xs font-medium">
                  {periodLabels[timePeriod]}
                </Text>
                <ChevronDown
                  size={14}
                  color="#71717A"
                  style={{
                    transform: [{ rotate: showDropdown ? '180deg' : '0deg' }],
                  }}
                />
              </Pressable>

              {showDropdown && (
                <View className="absolute top-full mt-1 right-0 w-32 bg-zinc-800 border border-zinc-700 rounded-lg z-10 overflow-hidden">
                  {(Object.entries(periodLabels) as [TimePeriod, string][]).map(
                    ([period, label]) => (
                      <Pressable
                        key={period}
                        onPress={() => {
                          setTimePeriod(period);
                          setShowDropdown(false);
                        }}
                        className="px-3 py-2.5 border-b border-zinc-700 last:border-b-0"
                      >
                        <Text
                          className={cn(
                            'text-xs font-medium',
                            timePeriod === period
                              ? 'text-blue-400'
                              : 'text-zinc-300'
                          )}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Heatmap */}
        <View className="px-4 mt-4">
          <TreemapHeatmap stocks={stocks} onStockPress={handleStockPress} />
        </View>
      </ScrollView>

      {/* Stock Detail Modal */}
      <Modal
        visible={selectedStock !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedStock(null)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="flex-1"
            onPress={() => setSelectedStock(null)}
          />
          <View className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800">
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-zinc-700 rounded-full" />
            </View>

            {selectedStock && (
              <View className="px-6 pb-10">
                {/* Header */}
                <View className="flex-row items-start justify-between mb-4">
                  <View>
                    <Text className="text-white text-xl font-bold">
                      {selectedStock.symbol}
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1">
                      {selectedStock.name}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setSelectedStock(null)}
                    className="bg-zinc-800 p-2 rounded-full"
                  >
                    <X size={18} color="#71717a" />
                  </Pressable>
                </View>

                {/* Stats */}
                <View className="flex-row gap-2 mb-4">
                  <View className="flex-1 bg-zinc-800 rounded-lg p-3">
                    <Text className="text-zinc-500 text-xs mb-1">Return</Text>
                    <View className="flex-row items-center">
                      {selectedStock.return >= 0 ? (
                        <TrendingUp size={14} color="#10B981" />
                      ) : (
                        <TrendingDown size={14} color="#EF4444" />
                      )}
                      <Text
                        className={`text-sm font-bold ml-1 ${
                          selectedStock.return >= 0
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {formatPercent(selectedStock.return)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1 bg-zinc-800 rounded-lg p-3">
                    <Text className="text-zinc-500 text-xs mb-1">Market Cap</Text>
                    <Text className="text-white text-sm font-bold">
                      {formatBillions(selectedStock.marketCap)}
                    </Text>
                  </View>
                </View>

                {/* Sector */}
                <View className="bg-zinc-800 rounded-lg p-3 mb-4">
                  <Text className="text-zinc-500 text-xs mb-1">Sector</Text>
                  <Text className="text-white font-semibold text-sm">
                    {selectedStock.sector}
                  </Text>
                </View>

                {/* View Analysis Button */}
                <Pressable
                  onPress={() => {
                    setSelectedStock(null);
                  }}
                  className="bg-blue-600 py-3 rounded-lg active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center text-sm">
                    View Detailed Analysis
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
