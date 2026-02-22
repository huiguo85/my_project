import React from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Briefcase, Eye, TableProperties, LayoutGrid } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import usePortfolioStore, {
  ViewMode,
  DisplayMode,
} from '@/lib/state/portfolio-store';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; iconName: 'briefcase' | 'eye' | 'table' | 'grid' }[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}

function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((opt) => opt.value === selectedValue);
  const containerWidth = useSharedValue(0);
  const segmentWidth = containerWidth.value / options.length;

  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const width = containerWidth.value / options.length - 4;
    return {
      width: width > 0 ? width : 0,
      transform: [
        {
          translateX: withTiming(
            selectedIndex * (containerWidth.value / options.length),
            {
              duration: 200,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }
          ),
        },
      ],
    };
  }, [selectedIndex, options.length]);

  const renderIcon = (iconName: string, isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : '#71717A';
    const size = 16;

    switch (iconName) {
      case 'briefcase':
        return <Briefcase size={size} color={color} />;
      case 'eye':
        return <Eye size={size} color={color} />;
      case 'table':
        return <TableProperties size={size} color={color} />;
      case 'grid':
        return <LayoutGrid size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View
      className="flex-row bg-zinc-800 rounded-xl p-1 relative"
      onLayout={onLayout}
    >
      {/* Animated Background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: 4,
            backgroundColor: '#3B82F6',
            borderRadius: 8,
          },
          animatedBackgroundStyle,
        ]}
      />

      {/* Options */}
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            className="flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-lg z-10"
          >
            <View className="mr-1.5">
              {renderIcon(option.iconName, isSelected)}
            </View>
            <Text
              className={cn(
                'font-semibold text-sm',
                isSelected ? 'text-white' : 'text-zinc-500'
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ViewToggle() {
  const viewMode = usePortfolioStore((s) => s.viewMode);
  const displayMode = usePortfolioStore((s) => s.displayMode);
  const setViewMode = usePortfolioStore((s) => s.setViewMode);
  const setDisplayMode = usePortfolioStore((s) => s.setDisplayMode);

  const viewModeOptions: { value: ViewMode; label: string; iconName: 'briefcase' | 'eye' }[] = [
    {
      value: 'portfolio',
      label: 'Portfolio',
      iconName: 'briefcase',
    },
    {
      value: 'watchlist',
      label: 'Watchlist',
      iconName: 'eye',
    },
  ];

  const displayModeOptions: { value: DisplayMode; label: string; iconName: 'table' | 'grid' }[] = [
    {
      value: 'table',
      label: 'Table',
      iconName: 'table',
    },
    {
      value: 'map',
      label: 'Map',
      iconName: 'grid',
    },
  ];

  return (
    <View className="mb-4 gap-3">
      {/* First Row: Portfolio/Watchlist Toggle */}
      <SegmentedControl
        options={viewModeOptions}
        selectedValue={viewMode}
        onValueChange={setViewMode}
      />

      {/* Second Row: Table/Map Toggle */}
      <SegmentedControl
        options={displayModeOptions}
        selectedValue={displayMode}
        onValueChange={setDisplayMode}
      />
    </View>
  );
}
