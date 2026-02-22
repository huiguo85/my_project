import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import type { Stock } from '@/lib/stock-data';
import { formatBillions, formatPercent, formatCurrency } from '@/lib/stock-data';

interface StockCardProps {
  stock: Stock;
  isSelected: boolean;
  onPress: () => void;
}

export function StockCard({ stock, isSelected, onPress }: StockCardProps) {
  const isPositive = stock.priceChange >= 0;

  return (
    <Pressable
      onPress={onPress}
      className={`mr-3 p-4 rounded-2xl border-2 ${
        isSelected
          ? 'bg-blue-500/20 border-blue-500'
          : 'bg-zinc-900 border-zinc-800'
      }`}
      style={{ width: 140 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`text-lg font-bold ${isSelected ? 'text-blue-400' : 'text-white'}`}
        >
          {stock.symbol}
        </Text>
        {isPositive ? (
          <TrendingUp size={16} color="#10B981" />
        ) : (
          <TrendingDown size={16} color="#EF4444" />
        )}
      </View>

      <Text className="text-zinc-400 text-xs mb-3" numberOfLines={1}>
        {stock.name}
      </Text>

      <Text className="text-white font-semibold text-base">
        {formatCurrency(stock.currentPrice)}
      </Text>

      <View className="flex-row items-center mt-1">
        <Text
          className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {formatPercent(stock.priceChange)}
        </Text>
        <Text className="text-zinc-500 text-xs ml-2">
          {formatBillions(stock.marketCap)}
        </Text>
      </View>
    </Pressable>
  );
}

interface StockHeaderProps {
  stock: Stock;
}

export function StockHeader({ stock }: StockHeaderProps) {
  const isPositive = stock.priceChange >= 0;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white text-3xl font-bold">{stock.symbol}</Text>
          <Text className="text-zinc-400 text-sm mt-1">{stock.name}</Text>
        </View>
        <View className="items-end">
          <Text className="text-white text-2xl font-bold">
            {formatCurrency(stock.currentPrice)}
          </Text>
          <View
            className={`flex-row items-center mt-1 px-2 py-1 rounded-md ${
              isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}
          >
            {isPositive ? (
              <TrendingUp size={14} color="#10B981" />
            ) : (
              <TrendingDown size={14} color="#EF4444" />
            )}
            <Text
              className={`text-sm font-semibold ml-1 ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatPercent(stock.priceChange)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row mt-4 gap-4">
        <View className="flex-1 bg-zinc-900 rounded-xl p-3">
          <Text className="text-zinc-500 text-xs">Market Cap</Text>
          <Text className="text-white font-semibold mt-1">
            {formatBillions(stock.marketCap)}
          </Text>
        </View>
        <View className="flex-1 bg-zinc-900 rounded-xl p-3">
          <Text className="text-zinc-500 text-xs">Sector</Text>
          <Text className="text-white font-semibold mt-1">{stock.sector}</Text>
        </View>
      </View>
    </View>
  );
}
