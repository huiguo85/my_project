import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown } from 'lucide-react-native';
import { FEATURED_STOCKS } from '@/lib/stock-data';
import { DualSearchBox, CompanyInfoBox } from '@/components/AnalysisSearch';
import { FinancialTabs } from '@/components/AdvancedFinancialChart';
import { TechnicalIndicators } from '@/components/TechnicalIndicators';
import { FinancialRatios } from '@/components/FinancialRatios';
import { cn } from '@/lib/cn';

type AnalysisView = 'fundamental' | 'technical' | 'ratios';

export default function AnalysisScreen() {
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState<string>(FEATURED_STOCKS[0].symbol);
  const [comparisonStock, setComparisonStock] = useState<string | null>(null);
  const [analysisView, setAnalysisView] = useState<AnalysisView>('fundamental');

  const handleExitComparison = () => {
    setComparisonStock(null);
  };

  const currentStock = FEATURED_STOCKS.find((s) => s.symbol === selectedStock) || FEATURED_STOCKS[0];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* PRO Button Header */}
        <View className="px-4 pt-3 pb-4 flex-row justify-end">
          <Pressable
            onPress={() => router.push('/subscription')}
            className="bg-amber-500/20 px-3 py-2 rounded-xl flex-row items-center active:opacity-70"
          >
            <Crown size={16} color="#F59E0B" />
            <Text className="text-amber-500 font-semibold ml-1.5 text-sm">
              PRO
            </Text>
          </Pressable>
        </View>

        {/* Dual Search Box */}
        <View className="px-4 mb-4">
          <DualSearchBox
            onPrimarySelect={(ticker) => {
              setSelectedStock(ticker);
              setComparisonStock(null);
            }}
            onComparisonSelect={setComparisonStock}
            primaryTicker={selectedStock}
            comparisonTicker={comparisonStock}
          />
        </View>

        {/* Company Info Box */}
        <View className="px-4 mb-4">
          <CompanyInfoBox ticker={selectedStock} />
        </View>

        {/* Analysis View Selector */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setAnalysisView('fundamental')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border',
                analysisView === 'fundamental'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-zinc-900 border-zinc-800'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  analysisView === 'fundamental' ? 'text-white' : 'text-zinc-400'
                )}
              >
                Fundamental
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setAnalysisView('technical')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border',
                analysisView === 'technical'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-zinc-900 border-zinc-800'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  analysisView === 'technical' ? 'text-white' : 'text-zinc-400'
                )}
              >
                Technical
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setAnalysisView('ratios')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border',
                analysisView === 'ratios'
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-zinc-900 border-zinc-800'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  analysisView === 'ratios' ? 'text-white' : 'text-zinc-400'
                )}
              >
                Ratios
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content based on selected view */}
        {analysisView === 'fundamental' && (
          <View className="px-4">
            <FinancialTabs
              symbol={selectedStock}
              incomeStatement={currentStock.incomeStatement}
              balanceSheet={currentStock.balanceSheet}
              cashFlow={currentStock.cashFlow}
              comparisonStock={
                comparisonStock
                  ? FEATURED_STOCKS.find((s) => s.symbol === comparisonStock) || null
                  : null
              }
              onExitComparison={handleExitComparison}
            />
          </View>
        )}

        {analysisView === 'technical' && (
          <View className="px-4">
            <TechnicalIndicators stock={currentStock} />
          </View>
        )}

        {analysisView === 'ratios' && (
          <View className="px-4">
            <FinancialRatios stock={currentStock} />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
