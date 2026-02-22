import React, { useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { cn } from '@/lib/cn';
import {
  FEATURED_STOCKS,
  SP500_STOCKS,
  formatPercent,
  formatCurrency,
} from '@/lib/stock-data';
import usePortfolioStore, {
  PortfolioItem,
  WatchlistItem,
} from '@/lib/state/portfolio-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEATMAP_PADDING = 32;
const HEATMAP_WIDTH = SCREEN_WIDTH - HEATMAP_PADDING;
const HEATMAP_HEIGHT = 320;

interface PortfolioHeatmapProps {
  mode: 'portfolio' | 'watchlist';
}

interface HeatmapItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  value: number; // For sizing - either position value or uniform
  quantity?: number;
}

interface TreemapCell {
  item: HeatmapItem;
  x: number;
  y: number;
  width: number;
  height: number;
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
    };
  }

  return null;
}

function isPortfolioItem(item: PortfolioItem | WatchlistItem): item is PortfolioItem {
  return 'quantity' in item;
}

// Squarified treemap algorithm
function calculateTreemap(
  items: HeatmapItem[],
  width: number,
  height: number
): TreemapCell[] {
  if (items.length === 0) return [];

  // Sort by value descending for better layout
  const sortedItems = [...items].sort((a, b) => b.value - a.value);
  const totalValue = sortedItems.reduce((sum, item) => sum + item.value, 0);

  if (totalValue === 0) return [];

  const cells: TreemapCell[] = [];
  let currentX = 0;
  let currentY = 0;
  let remainingWidth = width;
  let remainingHeight = height;
  let isHorizontal = width >= height;

  let i = 0;
  while (i < sortedItems.length) {
    const rowItems: HeatmapItem[] = [];
    let rowValue = 0;
    const remainingValue = sortedItems.slice(i).reduce((sum, item) => sum + item.value, 0);

    let bestAspectRatio = Infinity;

    // Fill row until aspect ratio gets worse
    for (let j = i; j < sortedItems.length && j < i + 8; j++) {
      rowItems.push(sortedItems[j]);
      rowValue += sortedItems[j].value;

      const rowWeight = rowValue / remainingValue;
      const rowSize = isHorizontal
        ? remainingHeight * rowWeight
        : remainingWidth * rowWeight;

      // Calculate worst aspect ratio in this row
      let worstAspect = 0;
      for (const item of rowItems) {
        const cellWeight = item.value / rowValue;
        const cellSize = isHorizontal
          ? remainingWidth * cellWeight
          : remainingHeight * cellWeight;
        const aspect = Math.max(cellSize / rowSize, rowSize / cellSize);
        worstAspect = Math.max(worstAspect, aspect);
      }

      if (worstAspect <= bestAspectRatio) {
        bestAspectRatio = worstAspect;
      } else {
        rowItems.pop();
        rowValue -= sortedItems[j].value;
        break;
      }
    }

    // Layout this row
    const rowWeight = rowValue / remainingValue;
    const rowSize = isHorizontal
      ? remainingHeight * rowWeight
      : remainingWidth * rowWeight;

    let offset = 0;
    for (const item of rowItems) {
      const cellWeight = item.value / rowValue;
      const cellSize = isHorizontal
        ? remainingWidth * cellWeight
        : remainingHeight * cellWeight;

      cells.push({
        item,
        x: isHorizontal ? currentX + offset : currentX,
        y: isHorizontal ? currentY : currentY + offset,
        width: isHorizontal ? cellSize : rowSize,
        height: isHorizontal ? rowSize : cellSize,
      });

      offset += cellSize;
    }

    // Update remaining area
    if (isHorizontal) {
      currentY += rowSize;
      remainingHeight -= rowSize;
    } else {
      currentX += rowSize;
      remainingWidth -= rowSize;
    }

    isHorizontal = remainingWidth >= remainingHeight;
    i += rowItems.length;
  }

  return cells;
}

// Get color based on change percentage
function getChangeColor(change: number, intensity: number): string {
  if (change >= 0) {
    return `rgba(16, 185, 129, ${0.2 + intensity * 0.6})`;
  }
  return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`;
}

export function PortfolioHeatmap({ mode }: PortfolioHeatmapProps) {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const watchlist = usePortfolioStore((s) => s.watchlist);

  const items = mode === 'portfolio' ? portfolio : watchlist;

  const heatmapData = useMemo((): HeatmapItem[] => {
    const result: HeatmapItem[] = [];

    for (const item of items) {
      const stockData = getStockData(item.ticker);
      if (!stockData) continue;

      const quantity = isPortfolioItem(item) ? item.quantity : undefined;

      // For portfolio mode, size is based on position value
      // For watchlist mode, all tiles are uniform (equal value)
      const value =
        mode === 'portfolio' && quantity !== undefined
          ? stockData.price * quantity
          : 100; // Uniform size for watchlist

      result.push({
        ticker: item.ticker,
        name: stockData.name,
        price: stockData.price,
        change: stockData.change,
        value,
        quantity,
      });
    }

    return result;
  }, [items, mode]);

  const cells = useMemo(
    () => calculateTreemap(heatmapData, HEATMAP_WIDTH, HEATMAP_HEIGHT),
    [heatmapData]
  );

  // Calculate summary stats
  const totalValue = heatmapData.reduce((sum, item) => {
    if (mode === 'portfolio' && item.quantity !== undefined) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  const gainers = heatmapData.filter((item) => item.change > 0).length;
  const losers = heatmapData.filter((item) => item.change < 0).length;
  const avgChange =
    heatmapData.length > 0
      ? heatmapData.reduce((sum, item) => sum + item.change, 0) / heatmapData.length
      : 0;

  if (heatmapData.length === 0) {
    return (
      <View className="bg-zinc-900 rounded-xl p-6 items-center justify-center" style={{ height: HEATMAP_HEIGHT }}>
        <Text className="text-zinc-500 text-center">
          {mode === 'portfolio'
            ? 'Your portfolio is empty. Add stocks to see the heatmap.'
            : 'Your watchlist is empty. Add stocks to see the heatmap.'}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Summary Stats */}
      <View className="flex-row mb-4 gap-3">
        <View className="flex-1 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30">
          <Text className="text-emerald-400 text-xs">Gainers</Text>
          <Text className="text-emerald-400 text-xl font-bold">{gainers}</Text>
        </View>
        <View className="flex-1 bg-red-500/10 rounded-xl p-3 border border-red-500/30">
          <Text className="text-red-400 text-xs">Losers</Text>
          <Text className="text-red-400 text-xl font-bold">{losers}</Text>
        </View>
        <View className="flex-1 bg-zinc-800 rounded-xl p-3 border border-zinc-700">
          <Text className="text-zinc-400 text-xs">Avg Change</Text>
          <Text
            className={cn(
              'text-xl font-bold',
              avgChange >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {formatPercent(avgChange)}
          </Text>
        </View>
      </View>

      {/* Heatmap */}
      <View
        className="rounded-xl overflow-hidden bg-zinc-900"
        style={{ width: HEATMAP_WIDTH, height: HEATMAP_HEIGHT }}
      >
        {cells.map((cell, index) => {
          const isPositive = cell.item.change >= 0;
          const intensity = Math.min(Math.abs(cell.item.change) / 6, 1);
          const backgroundColor = getChangeColor(cell.item.change, intensity);

          const showTicker = cell.width > 30 && cell.height > 25;
          const showChange = cell.width > 45 && cell.height > 40;
          const showValue = cell.width > 60 && cell.height > 55 && mode === 'portfolio';

          return (
            <Animated.View
              key={cell.item.ticker}
              entering={FadeIn.delay(index * 15).duration(250)}
              style={{
                position: 'absolute',
                left: cell.x,
                top: cell.y,
                width: cell.width - 2,
                height: cell.height - 2,
              }}
            >
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                  padding: 4,
                }}
                className="active:opacity-80"
              >
                {showTicker && (
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: Math.min(cell.width / 4.5, 14) }}
                    numberOfLines={1}
                  >
                    {cell.item.ticker}
                  </Text>
                )}
                {showChange && (
                  <Text
                    className={cn(
                      'font-semibold',
                      isPositive ? 'text-emerald-200' : 'text-red-200'
                    )}
                    style={{ fontSize: Math.min(cell.width / 5.5, 11) }}
                  >
                    {formatPercent(cell.item.change)}
                  </Text>
                )}
                {showValue && cell.item.quantity !== undefined && (
                  <Text
                    className="text-white/70"
                    style={{ fontSize: Math.min(cell.width / 7, 9) }}
                  >
                    {formatCurrency(cell.item.price * cell.item.quantity)}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* Footer Info */}
      <View className="mt-4 pt-3 border-t border-zinc-800">
        {mode === 'portfolio' ? (
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-400 text-sm">Total Portfolio Value</Text>
            <Text className="text-white font-bold text-lg">
              {formatCurrency(totalValue)}
            </Text>
          </View>
        ) : (
          <Text className="text-zinc-500 text-xs text-center">
            Tile size is uniform for watchlist items
          </Text>
        )}

        {/* Legend */}
        <View className="flex-row items-center justify-center mt-3 gap-2">
          <View
            style={{
              width: 20,
              height: 12,
              borderRadius: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.6)',
            }}
          />
          <Text className="text-zinc-500 text-xs">Loss</Text>
          <View
            style={{
              width: 40,
              height: 12,
              borderRadius: 2,
              flexDirection: 'row',
              overflow: 'hidden',
              marginHorizontal: 4,
            }}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.3)' }} />
            <View style={{ flex: 1, backgroundColor: 'rgba(107, 114, 128, 0.2)' }} />
            <View style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
          </View>
          <Text className="text-zinc-500 text-xs">Gain</Text>
          <View
            style={{
              width: 20,
              height: 12,
              borderRadius: 2,
              backgroundColor: 'rgba(16, 185, 129, 0.6)',
            }}
          />
        </View>
      </View>
    </View>
  );
}
