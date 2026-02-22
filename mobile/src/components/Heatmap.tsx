import React, { useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { SP500Stock } from '@/lib/stock-data';
import { formatPercent } from '@/lib/stock-data';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEATMAP_PADDING = 32;
const HEATMAP_WIDTH = SCREEN_WIDTH - HEATMAP_PADDING;
const HEATMAP_HEIGHT = SCREEN_HEIGHT * 0.55; // Use 55% of screen height

interface TreemapHeatmapProps {
  stocks: SP500Stock[];
  onStockPress?: (stock: SP500Stock) => void;
}

interface TreemapCell {
  stock: SP500Stock;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Simple treemap layout algorithm using squarified approach
function calculateTreemap(
  stocks: SP500Stock[],
  width: number,
  height: number
): TreemapCell[] {
  // Sort by market cap descending
  const sortedStocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap);
  const totalMarketCap = sortedStocks.reduce((sum, s) => sum + s.marketCap, 0);

  const cells: TreemapCell[] = [];
  let currentX = 0;
  let currentY = 0;
  let remainingWidth = width;
  let remainingHeight = height;
  let isHorizontal = width >= height;

  let i = 0;
  while (i < sortedStocks.length) {
    // Determine how many stocks fit in this row/column
    const rowStocks: SP500Stock[] = [];
    let rowMarketCap = 0;
    const remainingMarketCap = sortedStocks.slice(i).reduce((sum, s) => sum + s.marketCap, 0);

    // Fill row until aspect ratio gets worse
    const targetArea = isHorizontal
      ? (remainingMarketCap / totalMarketCap) * width * height
      : (remainingMarketCap / totalMarketCap) * width * height;

    let bestAspectRatio = Infinity;

    for (let j = i; j < sortedStocks.length && j < i + 8; j++) {
      rowStocks.push(sortedStocks[j]);
      rowMarketCap += sortedStocks[j].marketCap;

      const rowWeight = rowMarketCap / remainingMarketCap;
      const rowSize = isHorizontal
        ? remainingHeight * rowWeight
        : remainingWidth * rowWeight;

      // Calculate worst aspect ratio in this row
      let worstAspect = 0;
      for (const stock of rowStocks) {
        const cellWeight = stock.marketCap / rowMarketCap;
        const cellSize = isHorizontal
          ? remainingWidth * cellWeight
          : remainingHeight * cellWeight;
        const aspect = Math.max(cellSize / rowSize, rowSize / cellSize);
        worstAspect = Math.max(worstAspect, aspect);
      }

      if (worstAspect <= bestAspectRatio) {
        bestAspectRatio = worstAspect;
      } else {
        rowStocks.pop();
        rowMarketCap -= sortedStocks[j].marketCap;
        break;
      }
    }

    // Layout this row
    const rowWeight = rowMarketCap / remainingMarketCap;
    const rowSize = isHorizontal
      ? remainingHeight * rowWeight
      : remainingWidth * rowWeight;

    let offset = 0;
    for (const stock of rowStocks) {
      const cellWeight = stock.marketCap / rowMarketCap;
      const cellSize = isHorizontal
        ? remainingWidth * cellWeight
        : remainingHeight * cellWeight;

      cells.push({
        stock,
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
    i += rowStocks.length;
  }

  return cells;
}

export function TreemapHeatmap({ stocks, onStockPress }: TreemapHeatmapProps) {
  const cells = useMemo(
    () => calculateTreemap(stocks, HEATMAP_WIDTH, HEATMAP_HEIGHT),
    [stocks]
  );

  // Calculate market stats
  const gainers = stocks.filter((s) => s.return > 0).length;
  const losers = stocks.filter((s) => s.return < 0).length;
  const avgReturn = stocks.reduce((sum, s) => sum + s.return, 0) / stocks.length;

  return (
    <View>
      {/* Market Summary */}
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
          <Text className="text-zinc-400 text-xs">Avg Return</Text>
          <Text
            className={`text-xl font-bold ${avgReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {formatPercent(avgReturn)}
          </Text>
        </View>
      </View>

      {/* Treemap Heatmap */}
      <View
        className="rounded-xl overflow-hidden bg-zinc-900"
        style={{ width: HEATMAP_WIDTH, height: HEATMAP_HEIGHT }}
      >
        {cells.map((cell, index) => {
          const isPositive = cell.stock.return >= 0;
          const intensity = Math.min(Math.abs(cell.stock.return) / 6, 1);

          const backgroundColor = isPositive
            ? `rgba(16, 185, 129, ${0.15 + intensity * 0.65})`
            : `rgba(239, 68, 68, ${0.15 + intensity * 0.65})`;

          const showSymbol = cell.width > 28 && cell.height > 20;
          const showReturn = cell.width > 40 && cell.height > 32;
          const showName = cell.width > 60 && cell.height > 45;

          return (
            <Animated.View
              key={cell.stock.symbol}
              entering={FadeIn.delay(index * 10).duration(200)}
              style={{
                position: 'absolute',
                left: cell.x,
                top: cell.y,
                width: cell.width - 1,
                height: cell.height - 1,
              }}
            >
              <Pressable
                onPress={() => onStockPress?.(cell.stock)}
                style={{
                  flex: 1,
                  backgroundColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                className="active:opacity-80"
              >
                {showSymbol && (
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: Math.min(cell.width / 5, 12) }}
                    numberOfLines={1}
                  >
                    {cell.stock.symbol}
                  </Text>
                )}
                {showReturn && (
                  <Text
                    className={`font-medium ${isPositive ? 'text-emerald-200' : 'text-red-200'}`}
                    style={{ fontSize: Math.min(cell.width / 6, 9) }}
                  >
                    {formatPercent(cell.stock.return)}
                  </Text>
                )}
                {showName && (
                  <Text
                    className="text-white/60"
                    style={{ fontSize: 7 }}
                    numberOfLines={1}
                  >
                    {cell.stock.name}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-4 pt-3 border-t border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              style={{
                width: 32,
                height: 14,
                borderRadius: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
              }}
            />
            <Text className="text-zinc-400 text-xs ml-2">Loss</Text>
          </View>
          <View
            style={{
              width: 80,
              height: 14,
              borderRadius: 3,
              flexDirection: 'row',
              overflow: 'hidden',
            }}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.3)' }} />
            <View style={{ flex: 1, backgroundColor: 'rgba(107, 114, 128, 0.2)' }} />
            <View style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
          </View>
          <View className="flex-row items-center">
            <Text className="text-zinc-400 text-xs mr-2">Gain</Text>
            <View
              style={{
                width: 32,
                height: 14,
                borderRadius: 3,
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
              }}
            />
          </View>
        </View>
        <Text className="text-zinc-600 text-xs mt-2 text-center">
          Cell size = market cap | Tap for details
        </Text>
      </View>
    </View>
  );
}
