import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { Sun, Moon, TrendingUp, TrendingDown } from 'lucide-react-native';
import {
  MOCK_EARNINGS,
  EarningsEvent,
  formatEventDate,
  formatRevenue,
} from '@/lib/financial-data';
import { cn } from '@/lib/cn';

type FilterType = 'today' | 'week';

interface EarningsTabProps {
  className?: string;
}

interface EarningsCardProps {
  earnings: EarningsEvent;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const fallbackSource: ImageSourcePropType = {
    uri: `https://ui-avatars.com/api/?name=${earnings.ticker}&background=3B82F6&color=fff&size=96`,
  };

  const hasActuals = earnings.actualEPS !== undefined;
  const epsBeat = hasActuals && earnings.actualEPS! > earnings.estimatedEPS;
  const epsMiss = hasActuals && earnings.actualEPS! < earnings.estimatedEPS;
  const revenueBeat = hasActuals && earnings.actualRevenue! > earnings.estimatedRevenue;
  const revenueMiss = hasActuals && earnings.actualRevenue! < earnings.estimatedRevenue;

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-2"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <View className="flex-row">
        {/* Company Logo */}
        <View className="mr-3">
          <Image
            source={imageError ? fallbackSource : { uri: earnings.logoUrl }}
            onError={handleImageError}
            className="w-10 h-10 rounded-lg bg-zinc-800"
            resizeMode="contain"
          />
        </View>

        {/* Left Content */}
        <View className="flex-1">
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center">
              <Text className="text-blue-500 font-bold text-sm mr-2">
                {earnings.ticker}
              </Text>
              <Text className="text-zinc-400 text-xs" numberOfLines={1}>
                {earnings.company}
              </Text>
            </View>
            <View className="flex-row items-center bg-zinc-800 rounded-full px-2 py-0.5">
              {earnings.reportTime === 'BMO' ? (
                <>
                  <Sun size={10} color="#FBBF24" />
                  <Text className="text-yellow-400 text-xs ml-0.5 font-medium">
                    BMO
                  </Text>
                </>
              ) : (
                <>
                  <Moon size={10} color="#818CF8" />
                  <Text className="text-indigo-400 text-xs ml-0.5 font-medium">
                    AMC
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Date */}
          <Text className="text-white font-semibold text-xs">
            {formatEventDate(earnings.reportDate)}
          </Text>
        </View>

        {/* Right Content - Estimates */}
        <View className="ml-2 items-end">
          {/* EPS */}
          <View className="mb-1">
            <Text className="text-zinc-500 text-xs">EPS</Text>
            <View className="flex-row items-center">
              <Text className="text-white font-semibold text-xs">
                ${earnings.estimatedEPS.toFixed(2)}
              </Text>
              {hasActuals && (
                <View className="flex-row items-center ml-1">
                  {epsBeat && <TrendingUp size={10} color="#10B981" />}
                  {epsMiss && <TrendingDown size={10} color="#EF4444" />}
                  <Text
                    className={cn(
                      'text-xs ml-0.5 font-medium',
                      epsBeat ? 'text-green-500' : epsMiss ? 'text-red-500' : 'text-zinc-400'
                    )}
                  >
                    ${earnings.actualEPS?.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Revenue */}
          <View>
            <Text className="text-zinc-500 text-xs">Rev</Text>
            <View className="flex-row items-center">
              <Text className="text-white font-semibold text-xs">
                {formatRevenue(earnings.estimatedRevenue)}
              </Text>
              {hasActuals && (
                <View className="flex-row items-center ml-1">
                  {revenueBeat && <TrendingUp size={10} color="#10B981" />}
                  {revenueMiss && <TrendingDown size={10} color="#EF4444" />}
                  <Text
                    className={cn(
                      'text-xs ml-0.5 font-medium',
                      revenueBeat ? 'text-green-500' : revenueMiss ? 'text-red-500' : 'text-zinc-400'
                    )}
                  >
                    {formatRevenue(earnings.actualRevenue!)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const EarningsTab: React.FC<EarningsTabProps> = ({ className }) => {
  const [filter, setFilter] = useState<FilterType>('week');

  const filteredEarnings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return MOCK_EARNINGS.filter((event) => {
      const eventDate = new Date(event.reportDate);
      eventDate.setHours(0, 0, 0, 0);

      if (filter === 'today') {
        return eventDate.getTime() === today.getTime();
      }
      return eventDate >= today && eventDate <= endOfWeek;
    }).sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime());
  }, [filter]);

  return (
    <View className={cn('flex-1', className)}>
      {/* Filter Toggle */}
      <View className="flex-row px-4 pt-3 pb-2 gap-2">
        <Pressable
          onPress={() => setFilter('today')}
          className={cn(
            'flex-1 py-2 rounded-lg border',
            filter === 'today' ? 'bg-blue-500 border-blue-500' : 'bg-zinc-900 border-zinc-700'
          )}
        >
          <Text
            className={cn(
              'text-center font-semibold text-xs',
              filter === 'today' ? 'text-white' : 'text-zinc-400'
            )}
          >
            Today
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('week')}
          className={cn(
            'flex-1 py-2 rounded-lg border',
            filter === 'week' ? 'bg-blue-500 border-blue-500' : 'bg-zinc-900 border-zinc-700'
          )}
        >
          <Text
            className={cn(
              'text-center font-semibold text-xs',
              filter === 'week' ? 'text-white' : 'text-zinc-400'
            )}
          >
            This Week
          </Text>
        </Pressable>
      </View>

      {/* Earnings List */}
      {filteredEarnings.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-zinc-500 text-center text-sm">
            No earnings reports scheduled for {filter === 'today' ? 'today' : 'this week'}
          </Text>
        </View>
      ) : (
        <View className="px-4 py-2">
          {filteredEarnings.map((earnings) => (
            <EarningsCard key={earnings.id} earnings={earnings} />
          ))}
        </View>
      )}
    </View>
  );
};

export default EarningsTab;
