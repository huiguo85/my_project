import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { FEATURED_STOCKS, SP500_STOCKS, formatBillions } from '@/lib/stock-data';
import { cn } from '@/lib/cn';

interface DualSearchBoxProps {
  onPrimarySelect: (ticker: string) => void;
  onComparisonSelect: (ticker: string | null) => void;
  primaryTicker: string;
  comparisonTicker: string | null;
}

interface StockSearchResult {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  marketCap?: number;
  sector?: string;
}

const ALL_STOCKS: StockSearchResult[] = [
  ...FEATURED_STOCKS.map((s) => ({
    symbol: s.symbol,
    name: s.name,
    price: s.currentPrice,
    change: s.priceChange,
    marketCap: s.marketCap,
    sector: s.sector,
  })),
  ...SP500_STOCKS.filter(
    (sp) => !FEATURED_STOCKS.some((f) => f.symbol === sp.symbol)
  ).map((s) => ({
    symbol: s.symbol,
    name: s.name,
    change: s.return,
    marketCap: s.marketCap,
    sector: s.sector,
  })),
];

export const DualSearchBox: React.FC<DualSearchBoxProps> = ({
  onPrimarySelect,
  onComparisonSelect,
  primaryTicker,
  comparisonTicker,
}) => {
  const [primarySearch, setPrimarySearch] = useState(primaryTicker);
  const [comparisonSearch, setComparisonSearch] = useState(comparisonTicker || '');
  const [showPrimaryDropdown, setShowPrimaryDropdown] = useState(false);
  const [showComparisonDropdown, setShowComparisonDropdown] = useState(false);

  const primaryResults = useMemo(() => {
    if (!primarySearch.trim()) return [];
    const query = primarySearch.toUpperCase();
    return ALL_STOCKS.filter(
      (stock) =>
        stock.symbol.includes(query) || stock.name.toUpperCase().includes(query)
    ).slice(0, 5);
  }, [primarySearch]);

  const comparisonResults = useMemo(() => {
    if (!comparisonSearch.trim()) return [];
    const query = comparisonSearch.toUpperCase();
    return ALL_STOCKS.filter(
      (stock) =>
        stock.symbol !== primaryTicker &&
        (stock.symbol.includes(query) || stock.name.toUpperCase().includes(query))
    ).slice(0, 5);
  }, [comparisonSearch, primaryTicker]);

  const handlePrimarySelect = (ticker: string) => {
    setPrimarySearch(ticker);
    onPrimarySelect(ticker);
    setShowPrimaryDropdown(false);
  };

  const handleComparisonSelect = (ticker: string) => {
    setComparisonSearch(ticker);
    onComparisonSelect(ticker);
    setShowComparisonDropdown(false);
  };

  return (
    <View className="gap-3">
      {/* Primary and Comparison Search Row */}
      <View className="flex-row gap-2">
        {/* Primary Search */}
        <View className="flex-1">
          <Text className="text-zinc-400 text-xs mb-2 ml-1">Company</Text>
          <View className="relative">
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5">
              <Search size={16} color="#71717A" />
              <TextInput
                value={primarySearch}
                onChangeText={(text) => {
                  setPrimarySearch(text);
                  setShowPrimaryDropdown(text.length > 0);
                }}
                onFocus={() => setShowPrimaryDropdown(primarySearch.length > 0)}
                placeholder="Company..."
                placeholderTextColor="#71717A"
                className="flex-1 text-white px-2 py-0 text-sm"
                autoCapitalize="characters"
              />
            </View>

            {showPrimaryDropdown && primaryResults.length > 0 && (
              <View className="absolute top-full mt-1 left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-lg z-10 overflow-hidden">
                {primaryResults.map((stock, index) => (
                  <Pressable
                    key={stock.symbol}
                    onPress={() => handlePrimarySelect(stock.symbol)}
                    className={cn(
                      'px-3 py-2.5',
                      index !== primaryResults.length - 1 && 'border-b border-zinc-700'
                    )}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-white font-semibold text-sm">
                          {stock.symbol}
                        </Text>
                        <Text className="text-zinc-500 text-xs">{stock.name}</Text>
                      </View>
                      {stock.change !== undefined && (
                        <Text
                          className={cn(
                            'text-xs font-medium',
                            stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                          )}
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Comparison Search */}
        <View className="flex-1">
          <Text className="text-zinc-400 text-xs mb-2 ml-1">Compare</Text>
          <View className="relative">
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5">
              <Search size={16} color="#71717A" />
              <TextInput
                value={comparisonSearch}
                onChangeText={(text) => {
                  setComparisonSearch(text);
                  setShowComparisonDropdown(text.length > 0);
                }}
                onFocus={() => setShowComparisonDropdown(comparisonSearch.length > 0)}
                placeholder="Compare..."
                placeholderTextColor="#71717A"
                className="flex-1 text-white px-2 py-0 text-sm"
                autoCapitalize="characters"
              />
              {comparisonTicker && (
                <Pressable
                  onPress={() => {
                    setComparisonSearch('');
                    onComparisonSelect(null);
                  }}
                  className="ml-1"
                >
                  <X size={14} color="#EF4444" />
                </Pressable>
              )}
            </View>

            {showComparisonDropdown && comparisonResults.length > 0 && (
              <View className="absolute top-full mt-1 left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-lg z-10 overflow-hidden">
                {comparisonResults.map((stock, index) => (
                  <Pressable
                    key={stock.symbol}
                    onPress={() => handleComparisonSelect(stock.symbol)}
                    className={cn(
                      'px-3 py-2.5',
                      index !== comparisonResults.length - 1 && 'border-b border-zinc-700'
                    )}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-white font-semibold text-sm">
                          {stock.symbol}
                        </Text>
                        <Text className="text-zinc-500 text-xs">{stock.name}</Text>
                      </View>
                      {stock.change !== undefined && (
                        <Text
                          className={cn(
                            'text-xs font-medium',
                            stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                          )}
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

interface CompanyInfoBoxProps {
  ticker: string;
}

export const CompanyInfoBox: React.FC<CompanyInfoBoxProps> = ({ ticker }) => {
  const featuredStock = FEATURED_STOCKS.find((s) => s.symbol === ticker);
  const stock = featuredStock || ALL_STOCKS.find((s) => s.symbol === ticker);

  if (!stock) return null;

  const briefDescriptions: Record<string, string> = {
    AAPL: 'Apple is a technology company that designs, manufactures, and sells consumer electronics, including iPhones, iPads, and Macs.',
    MSFT: 'Microsoft is a software and cloud computing company providing operating systems, productivity software, and cloud services.',
    GOOGL: 'Alphabet (Google) is a tech company focused on search engines, online advertising, cloud computing, and AI.',
    AMZN: 'Amazon is an e-commerce and cloud computing company offering retail services, AWS, and digital content.',
    NVDA: 'NVIDIA is a semiconductor company specializing in GPUs for gaming, data centers, and artificial intelligence.',
    META: 'Meta is a social media and technology company operating Facebook, Instagram, WhatsApp, and metaverse platforms.',
  };

  const description = briefDescriptions[ticker] || `${stock.name} is a publicly traded company.`;

  // Get price and change from featured stock or search result
  const price = featuredStock?.currentPrice || (stock as StockSearchResult).price;
  const change = featuredStock?.priceChange || (stock as StockSearchResult).change;
  const marketCap = featuredStock?.marketCap || (stock as StockSearchResult).marketCap;
  const sector = featuredStock?.sector || (stock as StockSearchResult).sector;

  return (
    <View className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-white font-bold text-lg">{ticker}</Text>
          <Text className="text-zinc-400 text-sm">{stock.name}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1">
          <Text className="text-zinc-500 text-xs mb-1">Price</Text>
          <Text className="text-white font-semibold text-sm">
            {price ? `$${price.toFixed(2)}` : '-'}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-zinc-500 text-xs mb-1">Change</Text>
          <Text
            className={cn(
              'font-semibold text-sm',
              (change ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {(change ?? 0) >= 0 ? '+' : ''}{change?.toFixed(2)}%
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-zinc-500 text-xs mb-1">Market Cap</Text>
          <Text className="text-white font-semibold text-sm">
            {marketCap ? formatBillions(marketCap) : '-'}
          </Text>
        </View>
        {sector && (
          <View className="flex-1">
            <Text className="text-zinc-500 text-xs mb-1">Sector</Text>
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {sector}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text className="text-zinc-400 text-xs leading-4">{description}</Text>
    </View>
  );
};
