import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';
import { Search, Plus, X } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { FEATURED_STOCKS, SP500_STOCKS } from '@/lib/stock-data';
import usePortfolioStore from '@/lib/state/portfolio-store';

interface SearchBarProps {
  mode: 'portfolio' | 'watchlist';
  onAdd: (ticker: string, quantity?: number) => void;
}

interface StockSearchResult {
  symbol: string;
  name: string;
}

// Combine all available stocks for search
const ALL_STOCKS: StockSearchResult[] = [
  ...FEATURED_STOCKS.map((s) => ({ symbol: s.symbol, name: s.name })),
  ...SP500_STOCKS.filter(
    (sp) => !FEATURED_STOCKS.some((f) => f.symbol === sp.symbol)
  ).map((s) => ({ symbol: s.symbol, name: s.name })),
];

export function SearchBar({ mode, onAdd }: SearchBarProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);

  const isInPortfolio = usePortfolioStore((s) => s.isInPortfolio);
  const isInWatchlist = usePortfolioStore((s) => s.isInWatchlist);

  // Filter stocks based on search text
  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];

    const query = searchText.toUpperCase().trim();
    return ALL_STOCKS.filter(
      (stock) =>
        stock.symbol.includes(query) ||
        stock.name.toUpperCase().includes(query)
    ).slice(0, 6); // Limit to 6 results
  }, [searchText]);

  // Check if stock is already added
  const isAlreadyAdded = useCallback(
    (symbol: string) => {
      return mode === 'portfolio'
        ? isInPortfolio(symbol)
        : isInWatchlist(symbol);
    },
    [mode, isInPortfolio, isInWatchlist]
  );

  const handleSelectStock = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setSearchText(stock.symbol);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleAdd = () => {
    if (!selectedStock) {
      // Try to find exact match
      const exactMatch = ALL_STOCKS.find(
        (s) => s.symbol.toUpperCase() === searchText.toUpperCase().trim()
      );
      if (exactMatch && !isAlreadyAdded(exactMatch.symbol)) {
        const qty = mode === 'portfolio' ? parseInt(quantity, 10) || 1 : undefined;
        onAdd(exactMatch.symbol, qty);
        clearForm();
      }
      return;
    }

    if (isAlreadyAdded(selectedStock.symbol)) return;

    const qty = mode === 'portfolio' ? parseInt(quantity, 10) || 1 : undefined;
    onAdd(selectedStock.symbol, qty);
    clearForm();
  };

  const clearForm = () => {
    setSearchText('');
    setQuantity('');
    setSelectedStock(null);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const canAdd =
    (selectedStock || ALL_STOCKS.some((s) => s.symbol.toUpperCase() === searchText.toUpperCase().trim())) &&
    !isAlreadyAdded(searchText.toUpperCase().trim()) &&
    (mode === 'watchlist' || (mode === 'portfolio' && parseInt(quantity, 10) > 0));

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2">
        {/* Search Input */}
        <View className="flex-1 flex-row items-center bg-zinc-800 rounded-xl border border-zinc-700 px-3">
          <Search size={18} color="#71717A" />
          <TextInput
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setSelectedStock(null);
              setShowDropdown(text.length > 0);
            }}
            onFocus={() => setShowDropdown(searchText.length > 0)}
            placeholder="Search ticker or company..."
            placeholderTextColor="#71717A"
            className="flex-1 text-white py-3 px-2"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <Pressable onPress={clearForm} hitSlop={10}>
              <X size={16} color="#71717A" />
            </Pressable>
          )}
        </View>

        {/* Quantity Input (Portfolio mode only) */}
        {mode === 'portfolio' && (
          <View className="flex-row items-center bg-zinc-800 rounded-xl border border-zinc-700 px-3" style={{ width: 80 }}>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Qty"
              placeholderTextColor="#71717A"
              className="flex-1 text-white py-3 text-center"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        )}

        {/* Add Button */}
        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          className={cn(
            'rounded-xl p-3',
            canAdd ? 'bg-blue-500 active:bg-blue-600' : 'bg-zinc-700'
          )}
        >
          <Plus size={20} color={canAdd ? '#FFFFFF' : '#71717A'} />
        </Pressable>
      </View>

      {/* Autocomplete Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <View className="mt-2 bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
          {searchResults.map((item, index) => {
            const alreadyAdded = isAlreadyAdded(item.symbol);
            return (
              <Pressable
                key={item.symbol}
                onPress={() => !alreadyAdded && handleSelectStock(item)}
                disabled={alreadyAdded}
                className={cn(
                  'flex-row items-center justify-between px-4 py-3',
                  index !== searchResults.length - 1 && 'border-b border-zinc-700',
                  alreadyAdded ? 'opacity-50' : 'active:bg-zinc-700'
                )}
              >
                <View className="flex-1">
                  <Text
                    className={cn(
                      'font-semibold',
                      alreadyAdded ? 'text-zinc-500' : 'text-white'
                    )}
                  >
                    {item.symbol}
                  </Text>
                  <Text className="text-zinc-500 text-xs" numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                {alreadyAdded && (
                  <View className="bg-zinc-700 rounded-full px-2 py-1">
                    <Text className="text-zinc-400 text-xs">Added</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {/* No results message */}
      {showDropdown && searchText.length > 0 && searchResults.length === 0 && (
        <View className="mt-2 bg-zinc-800 rounded-xl border border-zinc-700 p-4">
          <Text className="text-zinc-500 text-center text-sm">
            No stocks found for "{searchText}"
          </Text>
        </View>
      )}
    </View>
  );
}
