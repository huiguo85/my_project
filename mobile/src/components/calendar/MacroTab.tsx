import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle, AlertTriangle, MinusCircle } from 'lucide-react-native';
import {
  MOCK_MACRO_EVENTS,
  MacroEvent,
  formatEventDate,
  getCountryFlag,
} from '@/lib/financial-data';
import { cn } from '@/lib/cn';

interface MacroTabProps {
  className?: string;
}

type MacroFilterType = 'all' | 'today' | 'week';

interface MacroEventCardProps {
  event: MacroEvent;
}

const ImportanceIndicator: React.FC<{ importance: MacroEvent['importance'] }> = ({
  importance,
}) => {
  switch (importance) {
    case 'high':
      return (
        <View className="flex-row items-center">
          <AlertCircle size={12} color="#EF4444" />
          <Text className="text-red-500 text-xs ml-1 font-medium">High</Text>
        </View>
      );
    case 'medium':
      return (
        <View className="flex-row items-center">
          <AlertTriangle size={12} color="#FBBF24" />
          <Text className="text-yellow-500 text-xs ml-1 font-medium">Med</Text>
        </View>
      );
    case 'low':
      return (
        <View className="flex-row items-center">
          <MinusCircle size={12} color="#71717A" />
          <Text className="text-zinc-500 text-xs ml-1 font-medium">Low</Text>
        </View>
      );
    default:
      return null;
  }
};

const MacroEventCard: React.FC<MacroEventCardProps> = ({ event }) => {
  // Convert UTC time to user's local timezone
  const localDateTime = useMemo(() => {
    const date = new Date(event.dateTime);

    // Format date portion
    const dateStr = formatEventDate(event.dateTime.split('T')[0]);

    // Format time using Intl.DateTimeFormat for accurate local timezone conversion
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    const timeStr = timeFormatter.format(date);

    return { date: dateStr, time: timeStr };
  }, [event.dateTime]);

  const importanceBorderColor = useMemo(() => {
    switch (event.importance) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-zinc-600';
      default:
        return 'border-l-zinc-600';
    }
  }, [event.importance]);

  return (
    <View
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-2 border-l-4',
        importanceBorderColor
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <Text className="text-lg mr-2">{getCountryFlag(event.countryCode)}</Text>
          <Text className="text-white font-bold text-sm flex-1" numberOfLines={1}>
            {event.eventName}
          </Text>
        </View>
        <ImportanceIndicator importance={event.importance} />
      </View>

      {/* Description */}
      <Text className="text-zinc-400 text-xs mb-2" numberOfLines={1}>
        {event.description}
      </Text>

      {/* Info Row - Date, Time, Consensus, Previous in single row */}
      <View className="flex-row items-center justify-between gap-2">
        {/* Date & Time */}
        <View className="flex-1">
          <Text className="text-zinc-500 text-xs">{localDateTime.date}</Text>
          <Text className="text-blue-400 font-bold text-xs">{localDateTime.time}</Text>
        </View>

        {/* Consensus */}
        {event.consensus && (
          <View className="items-center px-1">
            <Text className="text-zinc-500 text-xs">Cons</Text>
            <Text className="text-white font-semibold text-xs">{event.consensus}</Text>
          </View>
        )}

        {/* Previous */}
        {event.previous && (
          <View className="items-center px-1">
            <Text className="text-zinc-500 text-xs">Prev</Text>
            <Text className="text-zinc-300 font-medium text-xs">{event.previous}</Text>
          </View>
        )}

        {/* Actual */}
        {event.actual && (
          <View className="items-center px-1">
            <Text className="text-zinc-500 text-xs">Act</Text>
            <Text className="text-green-500 font-semibold text-xs">{event.actual}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const MacroTab: React.FC<MacroTabProps> = ({ className }) => {
  const [filterType, setFilterType] = useState<MacroFilterType>('all');

  const sortedEvents = useMemo(() => {
    let events = [...MOCK_MACRO_EVENTS].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    // Filter events based on selected filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    if (filterType === 'today') {
      events = events.filter((event) => {
        const eventDate = new Date(event.dateTime);
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        return eventDay.getTime() === today.getTime();
      });
    } else if (filterType === 'week') {
      events = events.filter((event) => {
        const eventDate = new Date(event.dateTime);
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        return eventDay.getTime() >= today.getTime() && eventDay.getTime() < weekFromNow.getTime();
      });
    }

    return events;
  }, [filterType]);

  if (sortedEvents.length === 0) {
    return (
      <View className={cn('flex-1 items-center justify-center px-4', className)}>
        <Text className="text-zinc-500 text-center">
          No macro economic events scheduled
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('flex-1', className)}>
      {/* Filter Tabs */}
      <View className="px-4 pt-3 pb-3 flex-row gap-2">
        <Pressable
          onPress={() => setFilterType('today')}
          className={cn(
            'px-3 py-1.5 rounded-lg border',
            filterType === 'today'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-zinc-900 border-zinc-800'
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold',
              filterType === 'today' ? 'text-white' : 'text-zinc-400'
            )}
          >
            Today
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterType('week')}
          className={cn(
            'px-3 py-1.5 rounded-lg border',
            filterType === 'week'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-zinc-900 border-zinc-800'
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold',
              filterType === 'week' ? 'text-white' : 'text-zinc-400'
            )}
          >
            This Week
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterType('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg border',
            filterType === 'all'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-zinc-900 border-zinc-800'
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold',
              filterType === 'all' ? 'text-white' : 'text-zinc-400'
            )}
          >
            All
          </Text>
        </Pressable>
      </View>

      {/* Header Info */}
      <View className="px-4 pb-2">
        <Text className="text-zinc-500 text-xs">
          Times shown in your local timezone
        </Text>
      </View>

      {/* Events List */}
      <View className="px-4 py-2">
        {sortedEvents.map((event) => (
          <MacroEventCard key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
};

export default MacroTab;
