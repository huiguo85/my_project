import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native';
import { X, TrendingUp, TrendingDown } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import {
  FEATURED_STOCKS,
  SP500_STOCKS,
  formatBillions,
  formatPercent,
} from '@/lib/stock-data';
import usePortfolioStore, {
  PortfolioItem,
  WatchlistItem,
} from '@/lib/state/portfolio-store';

interface PortfolioTableProps {
  mode: 'portfolio' | 'watchlist';
  onRemove: (ticker: string) => void;
  onUpdateQuantity?: (ticker: string, quantity: number) => void;
}

interface TableRowData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  quantity?: number;
  totalValue?: number;
  costBasis?: number;
}

function getStockData(ticker: string) {
  const featured = FEATURED_STOCKS.find(
    (s) => s.symbol.toUpperCase() === ticker.toUpperCase()
  );
  if (featured) {
    return {
      name: featured.name,
      price: featured.currentPrice,
      change: featured.priceChange,
      marketCap: featured.marketCap,
    };
  }

  const sp500 = SP500_STOCKS.find(
    (s) => s.symbol.toUpperCase() === ticker.toUpperCase()
  );
  if (sp500) {
    return {
      name: sp500.name,
      price: Math.round(sp500.marketCap * 0.15 * 100) / 100,
      change: sp500.return,
      marketCap: sp500.marketCap,
    };
  }

  return null;
}

function isPortfolioItem(item: PortfolioItem | WatchlistItem): item is PortfolioItem {
  return 'quantity' in item;
}

function formatCurrencyRounded(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

export function PortfolioTable({ mode, onRemove, onUpdateQuantity }: PortfolioTableProps) {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const watchlist = usePortfolioStore((s) => s.watchlist);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  const items = mode === 'portfolio' ? portfolio : watchlist;

  const tableData: TableRowData[] = items
    .map((item): TableRowData | null => {
      const stockData = getStockData(item.ticker);
      if (!stockData) return null;

      const quantity = isPortfolioItem(item) ? item.quantity : undefined;
      const totalValue = quantity !== undefined ? stockData.price * quantity : undefined;

      return {
        ticker: item.ticker,
        name: stockData.name,
        price: stockData.price,
        change: stockData.change,
        marketCap: stockData.marketCap,
        quantity,
        totalValue,
      };
    })
    .filter((item): item is TableRowData => item !== null);

  const handleRowPress = (ticker: string, quantity?: number) => {
    if (mode === 'portfolio') {
      setSelectedTicker(ticker);
      setNewQuantity(quantity?.toString() || '');
      setEditModalVisible(true);
    }
  };

  const handleUpdateQuantity = () => {
    if (!selectedTicker || !newQuantity) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }

    if (onUpdateQuantity) {
      onUpdateQuantity(selectedTicker, qty);
    }

    setEditModalVisible(false);
    setSelectedTicker(null);
    setNewQuantity('');
  };

  const handleRemoveFromModal = () => {
    if (selectedTicker) {
      onRemove(selectedTicker);
      setEditModalVisible(false);
      setSelectedTicker(null);
      setNewQuantity('');
    }
  };

  if (tableData.length === 0) {
    return (
      <View className="bg-zinc-900 rounded-xl p-6 items-center justify-center">
        <Text className="text-zinc-500 text-center">
          {mode === 'portfolio'
            ? 'Your portfolio is empty. Add stocks to get started.'
            : 'Your watchlist is empty. Add stocks to track.'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="bg-zinc-900 rounded-xl overflow-hidden">
        {/* Table Header */}
        <View className="flex-row px-3 py-2 bg-zinc-800 border-b border-zinc-700">
          <Text className="text-zinc-400 text-xs font-medium flex-1" style={{ minWidth: 60 }}>
            Symbol
          </Text>
          <Text className="text-zinc-400 text-xs font-medium text-right" style={{ width: 50 }}>
            Price
          </Text>
          <Text className="text-zinc-400 text-xs font-medium text-right" style={{ width: 40 }}>
            Chg %
          </Text>
          {mode === 'portfolio' && (
            <>
              <Text className="text-zinc-400 text-xs font-medium text-right" style={{ width: 35 }}>
                Qty
              </Text>
              <Text className="text-zinc-400 text-xs font-medium text-right" style={{ width: 50 }}>
                Value
              </Text>
              <Text className="text-zinc-400 text-xs font-medium text-right" style={{ width: 40 }}>
                P/L
              </Text>
            </>
          )}
          {mode === 'watchlist' && (
            <View style={{ width: 32 }} />
          )}
        </View>

        {/* Table Rows */}
        <View>
          {tableData.map((row, index) => {
            const isPositive = row.change >= 0;
            const isAlternate = index % 2 === 1;
            const gainLoss = row.totalValue ? Math.round(row.totalValue * (row.change / 100)) : 0;
            const gainLossPositive = gainLoss >= 0;

            return (
              <Pressable
                key={row.ticker}
                onPress={() => handleRowPress(row.ticker, row.quantity)}
                className={cn(
                  'flex-row items-center px-3 py-2 border-b border-zinc-800',
                  isAlternate && 'bg-zinc-800/50'
                )}
              >
                {/* Symbol & Name */}
                <View className="flex-1" style={{ minWidth: 60 }}>
                  <Text className="text-white font-semibold text-sm">{row.ticker}</Text>
                  <Text className="text-zinc-500 text-xs" numberOfLines={1}>
                    {row.name}
                  </Text>
                </View>

                {/* Price */}
                <Text
                  className="text-white font-medium text-xs text-right"
                  style={{ width: 50 }}
                >
                  {formatCurrencyRounded(row.price)}
                </Text>

                {/* Change */}
                <View
                  className="flex-row items-center justify-end"
                  style={{ width: 40 }}
                >
                  {isPositive ? (
                    <TrendingUp size={8} color="#10B981" style={{ marginRight: 2 }} />
                  ) : (
                    <TrendingDown size={8} color="#EF4444" style={{ marginRight: 2 }} />
                  )}
                  <Text
                    className={cn(
                      'text-xs font-medium',
                      isPositive ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {formatPercent(row.change)}
                  </Text>
                </View>

                {/* Portfolio specific: Quantity, Value & P/L */}
                {mode === 'portfolio' && (
                  <>
                    <Text
                      className="text-zinc-300 text-xs text-right font-medium"
                      style={{ width: 35 }}
                    >
                      {row.quantity}
                    </Text>
                    <Text
                      className="text-white font-medium text-xs text-right"
                      style={{ width: 50 }}
                    >
                      {row.totalValue ? formatCurrencyRounded(row.totalValue) : '-'}
                    </Text>
                    <Text
                      className={cn(
                        'text-xs text-right font-medium',
                        gainLossPositive ? 'text-emerald-400' : 'text-red-400'
                      )}
                      style={{ width: 40 }}
                    >
                      {gainLossPositive ? '+' : ''}{formatCurrencyRounded(gainLoss)}
                    </Text>
                  </>
                )}

                {/* Watchlist specific: Remove Button */}
                {mode === 'watchlist' && (
                  <Pressable
                    onPress={() => onRemove(row.ticker)}
                    className="p-1 rounded-full active:bg-zinc-700"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={12} color="#71717A" />
                  </Pressable>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Footer Summary */}
        {mode === 'portfolio' && (
          <View className="flex-row justify-between items-center px-3 py-2 bg-zinc-800 border-t border-zinc-700">
            <Text className="text-zinc-400 text-xs font-medium">Total</Text>
            <Text className="text-white font-bold text-sm">
              {formatCurrencyRounded(
                tableData.reduce((sum, row) => sum + (row.totalValue ?? 0), 0)
              )}
            </Text>
          </View>
        )}
      </View>

      {/* Edit/Remove Modal for Portfolio */}
      {mode === 'portfolio' && (
        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <Pressable
            className="flex-1 bg-black/50"
            onPress={() => setEditModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center px-4">
              <Pressable
                className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border border-zinc-800"
                onPress={(e) => e.stopPropagation()}
              >
                <Text className="text-white font-bold text-lg mb-2">
                  {selectedTicker}
                </Text>
                <Text className="text-zinc-400 text-sm mb-4">
                  Update quantity or remove position
                </Text>

                {/* Quantity Input */}
                <View className="mb-4">
                  <Text className="text-zinc-400 text-xs mb-2">New Quantity</Text>
                  <TextInput
                    value={newQuantity}
                    onChangeText={setNewQuantity}
                    placeholder="Enter quantity"
                    placeholderTextColor="#71717A"
                    keyboardType="number-pad"
                    className="bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700"
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setEditModalVisible(false)}
                    className="flex-1 bg-zinc-800 rounded-lg py-3"
                  >
                    <Text className="text-zinc-400 text-center font-medium text-sm">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUpdateQuantity}
                    className="flex-1 bg-blue-600 rounded-lg py-3"
                  >
                    <Text className="text-white text-center font-medium text-sm">
                      Update
                    </Text>
                  </Pressable>
                </View>

                {/* Remove Button */}
                <Pressable
                  onPress={handleRemoveFromModal}
                  className="mt-3 bg-red-500/20 border border-red-500/50 rounded-lg py-3"
                >
                  <Text className="text-red-500 text-center font-medium text-sm">
                    Remove Position
                  </Text>
                </Pressable>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}
