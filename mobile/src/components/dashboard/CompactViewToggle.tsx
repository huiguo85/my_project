import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Briefcase, Eye, TableProperties, LayoutGrid } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import usePortfolioStore, {
  ViewMode,
  DisplayMode,
} from '@/lib/state/portfolio-store';

export function CompactViewToggle() {
  const viewMode = usePortfolioStore((s) => s.viewMode);
  const displayMode = usePortfolioStore((s) => s.displayMode);
  const setViewMode = usePortfolioStore((s) => s.setViewMode);
  const setDisplayMode = usePortfolioStore((s) => s.setDisplayMode);

  return (
    <View className="flex-row gap-2">
      {/* View Mode Toggle */}
      <View className="flex-row bg-zinc-800 rounded-lg p-1">
        <Pressable
          onPress={() => setViewMode('portfolio')}
          className={cn(
            'flex-row items-center px-2.5 py-1.5 rounded-md gap-1',
            viewMode === 'portfolio' ? 'bg-blue-500' : ''
          )}
        >
          <Briefcase size={14} color={viewMode === 'portfolio' ? '#fff' : '#71717A'} />
          <Text className={cn(
            'text-xs font-semibold',
            viewMode === 'portfolio' ? 'text-white' : 'text-zinc-500'
          )}>
            Portfolio
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode('watchlist')}
          className={cn(
            'flex-row items-center px-2.5 py-1.5 rounded-md gap-1',
            viewMode === 'watchlist' ? 'bg-blue-500' : ''
          )}
        >
          <Eye size={14} color={viewMode === 'watchlist' ? '#fff' : '#71717A'} />
          <Text className={cn(
            'text-xs font-semibold',
            viewMode === 'watchlist' ? 'text-white' : 'text-zinc-500'
          )}>
            Watch
          </Text>
        </Pressable>
      </View>

      {/* Display Mode Toggle */}
      <View className="flex-row bg-zinc-800 rounded-lg p-1">
        <Pressable
          onPress={() => setDisplayMode('table')}
          className={cn(
            'flex-row items-center px-2.5 py-1.5 rounded-md',
            displayMode === 'table' ? 'bg-blue-500' : ''
          )}
        >
          <TableProperties size={14} color={displayMode === 'table' ? '#fff' : '#71717A'} />
        </Pressable>
        <Pressable
          onPress={() => setDisplayMode('map')}
          className={cn(
            'flex-row items-center px-2.5 py-1.5 rounded-md',
            displayMode === 'map' ? 'bg-blue-500' : ''
          )}
        >
          <LayoutGrid size={14} color={displayMode === 'map' ? '#fff' : '#71717A'} />
        </Pressable>
      </View>
    </View>
  );
}
