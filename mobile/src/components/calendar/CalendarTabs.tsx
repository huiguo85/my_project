import React from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TrendingUp, Globe, Calendar } from 'lucide-react-native';
import { cn } from '@/lib/cn';

export type CalendarTabType = 'earnings' | 'macro' | 'events';

interface CalendarTabsProps {
  activeTab: CalendarTabType;
  onTabChange: (tab: CalendarTabType) => void;
}

const TABS: { value: CalendarTabType; label: string; icon: 'earnings' | 'macro' | 'events' }[] = [
  { value: 'earnings', label: 'Earnings', icon: 'earnings' },
  { value: 'macro', label: 'Macro', icon: 'macro' },
  { value: 'events', label: 'Events', icon: 'events' },
];

export const CalendarTabs: React.FC<CalendarTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const selectedIndex = TABS.findIndex((tab) => tab.value === activeTab);
  const containerWidth = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const segmentWidth = containerWidth.value / TABS.length;
    const width = segmentWidth - 4;
    return {
      width: width > 0 ? width : 0,
      transform: [
        {
          translateX: withTiming(selectedIndex * segmentWidth, {
            duration: 200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        },
      ],
    };
  }, [selectedIndex]);

  const renderIcon = (iconType: string, isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : '#71717A';
    const size = 16;

    switch (iconType) {
      case 'earnings':
        return <TrendingUp size={size} color={color} />;
      case 'macro':
        return <Globe size={size} color={color} />;
      case 'events':
        return <Calendar size={size} color={color} />;
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

      {/* Tab Options */}
      {TABS.map((tab) => {
        const isSelected = tab.value === activeTab;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            className="flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-lg z-10"
          >
            <View className="mr-1.5">
              {renderIcon(tab.icon, isSelected)}
            </View>
            <Text
              className={cn(
                'font-semibold text-sm',
                isSelected ? 'text-white' : 'text-zinc-500'
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default CalendarTabs;
