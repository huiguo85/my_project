import React from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import usePortfolioStore from "@/lib/state/portfolio-store";
import { CompactViewToggle } from "@/components/dashboard/CompactViewToggle";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PortfolioTable } from "@/components/dashboard/PortfolioTable";
import { PortfolioHeatmap } from "@/components/dashboard/PortfolioHeatmap";
import { NewsFeed } from "@/components/dashboard/NewsFeed";

export default function DashboardScreen() {
  const viewMode = usePortfolioStore((s) => s.viewMode);
  const displayMode = usePortfolioStore((s) => s.displayMode);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const watchlist = usePortfolioStore((s) => s.watchlist);
  const addToPortfolio = usePortfolioStore((s) => s.addToPortfolio);
  const addToWatchlist = usePortfolioStore((s) => s.addToWatchlist);
  const removeFromPortfolio = usePortfolioStore((s) => s.removeFromPortfolio);
  const removeFromWatchlist = usePortfolioStore((s) => s.removeFromWatchlist);
  const updatePortfolioQuantity = usePortfolioStore((s) => s.updatePortfolioQuantity);

  const handleAdd = (ticker: string, quantity?: number) => {
    if (viewMode === "portfolio" && quantity) {
      addToPortfolio(ticker, quantity);
    } else {
      addToWatchlist(ticker);
    }
  };

  const handleRemove = (ticker: string) => {
    if (viewMode === "portfolio") {
      removeFromPortfolio(ticker);
    } else {
      removeFromWatchlist(ticker);
    }
  };

  const positionCount = viewMode === "portfolio" ? portfolio.length : watchlist.length;

  return (
    <View className="flex-1 bg-zinc-950">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Compact Header with Toggles */}
          <View className="px-4 pt-3 pb-3 border-b border-zinc-800">
            <View className="flex-row items-center justify-between">
              <CompactViewToggle />
              <Text className="text-zinc-400 text-sm">
                {viewMode === "portfolio"
                  ? `${positionCount} positions`
                  : `${positionCount} watching`}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="px-4 mt-3">
            <SearchBar mode={viewMode} onAdd={handleAdd} />
          </View>

          {/* Content View */}
          <View className="mt-3 px-4">
            {displayMode === "table" ? (
              <PortfolioTable
                mode={viewMode}
                onRemove={handleRemove}
                onUpdateQuantity={updatePortfolioQuantity}
              />
            ) : (
              <PortfolioHeatmap mode={viewMode} />
            )}
          </View>

          {/* News Section */}
          <View className="mt-6 px-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">
                Related News
              </Text>
              <Text className="text-zinc-500 text-sm">
                {positionCount > 0
                  ? `${positionCount} tickers`
                  : "All news"}
              </Text>
            </View>
            <NewsFeed relevantTickers={viewMode === "portfolio" ? portfolio.map(p => p.ticker) : watchlist.map(w => w.ticker)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
