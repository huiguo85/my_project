import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { FEATURED_STOCKS, type Stock } from '@/lib/stock-data';

interface CompareInputProps {
  onCompare: (stock: Stock) => void;
  disabled?: boolean;
}

export function CompareInput({ onCompare, disabled }: CompareInputProps) {
  const [ticker, setTicker] = useState('');

  const handleCompare = () => {
    const stock = FEATURED_STOCKS.find((s) => s.symbol === ticker.toUpperCase());
    if (stock) {
      onCompare(stock);
      setTicker('');
    }
  };

  return (
    <View className="flex-row items-center gap-2 bg-zinc-900 rounded-xl p-2">
      <View className="flex-1 flex-row items-center bg-zinc-800 rounded-lg px-3 py-2">
        <Search size={14} color="#71717a" />
        <TextInput
          placeholder="Compare: MSFT, GOOGL..."
          value={ticker}
          onChangeText={setTicker}
          onSubmitEditing={handleCompare}
          className="flex-1 text-white text-sm ml-2"
          placeholderTextColor="#71717a"
          autoCapitalize="characters"
          editable={!disabled}
        />
      </View>
      <Pressable
        onPress={handleCompare}
        disabled={!ticker || disabled}
        className={`px-4 py-2 rounded-lg ${ticker && !disabled ? 'bg-blue-500' : 'bg-zinc-700'}`}
      >
        <Text className={`text-sm font-medium ${ticker && !disabled ? 'text-white' : 'text-zinc-500'}`}>
          Go
        </Text>
      </Pressable>
    </View>
  );
}
