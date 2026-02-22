import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import {
  MOCK_CORPORATE_EVENTS,
  CorporateEvent,
  formatEventDate,
} from '@/lib/financial-data';
import { cn } from '@/lib/cn';

interface EventsTabProps {
  className?: string;
}

interface EventCardProps {
  event: CorporateEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const fallbackSource: ImageSourcePropType = {
    uri: `https://ui-avatars.com/api/?name=${event.ticker}&background=3B82F6&color=fff&size=96`,
  };

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-3"
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
            source={imageError ? fallbackSource : { uri: event.logoUrl }}
            onError={handleImageError}
            className="w-12 h-12 rounded-lg bg-zinc-800"
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-500 font-bold text-sm">
              {event.ticker}
            </Text>
            <View className="flex-row items-center">
              <Calendar size={12} color="#71717A" />
              <Text className="text-zinc-400 text-xs ml-1 font-medium">
                {formatEventDate(event.date)}
              </Text>
            </View>
          </View>

          {/* Event Name */}
          <Text
            className="text-white font-bold text-base leading-5 mb-2"
            numberOfLines={1}
          >
            {event.eventName}
          </Text>

          {/* Description */}
          <Text className="text-zinc-400 text-sm leading-5" numberOfLines={2}>
            {event.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const EventsTab: React.FC<EventsTabProps> = ({ className }) => {
  const sortedEvents = useMemo(() => {
    return [...MOCK_CORPORATE_EVENTS].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, []);

  if (sortedEvents.length === 0) {
    return (
      <View className={cn('flex-1 items-center justify-center px-4', className)}>
        <Text className="text-zinc-500 text-center">
          No corporate events scheduled
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('flex-1', className)}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-zinc-500 text-xs">
          Upcoming conferences, investor days, and corporate events
        </Text>
      </View>

      {/* Events List */}
      <View className="px-4 py-2">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
};

export default EventsTab;
