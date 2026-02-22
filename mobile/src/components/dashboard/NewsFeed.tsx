import React, { useState, useCallback } from "react";
import { View, Text, Image, Pressable, ImageSourcePropType } from "react-native";
import { Clock } from "lucide-react-native";
import { MOCK_NEWS, NewsItem, formatRelativeTime } from "@/lib/financial-data";
import { cn } from "@/lib/cn";
import { NewsDetailModal } from "./NewsDetailModal";

interface NewsFeedProps {
  relevantTickers?: string[];
  className?: string;
}

interface NewsCardProps {
  news: NewsItem;
  onPress: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const fallbackSource: ImageSourcePropType = {
    uri: `https://ui-avatars.com/api/?name=${news.ticker}&background=3B82F6&color=fff&size=80`,
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-3"
      style={{
        shadowColor: "#000",
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
            source={imageError ? fallbackSource : { uri: news.logoUrl }}
            onError={handleImageError}
            className="w-10 h-10 rounded-lg bg-zinc-800"
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Ticker and Time Row */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-blue-500 font-semibold text-sm">
              {news.ticker}
            </Text>
            <View className="flex-row items-center">
              <Clock size={12} color="#71717a" />
              <Text className="text-zinc-500 text-xs ml-1">
                {formatRelativeTime(news.timestamp)}
              </Text>
            </View>
          </View>

          {/* Headline */}
          <Text
            className="text-white font-bold text-base leading-5 mb-2"
            numberOfLines={2}
          >
            {news.headline}
          </Text>

          {/* Snippet */}
          <Text className="text-zinc-400 text-sm leading-5 mb-2" numberOfLines={2}>
            {news.snippet}
          </Text>

          {/* Source */}
          <Text className="text-zinc-500 text-xs">{news.source}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const NewsFeed: React.FC<NewsFeedProps> = ({
  relevantTickers = [],
  className,
}) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter news based on relevant tickers
  const filteredNews =
    relevantTickers.length > 0
      ? MOCK_NEWS.filter((news) =>
          relevantTickers
            .map((t) => t.toUpperCase())
            .includes(news.ticker.toUpperCase())
        )
      : MOCK_NEWS;

  // Sort by timestamp (most recent first)
  const sortedNews = [...filteredNews].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const handleNewsPress = useCallback((news: NewsItem) => {
    setSelectedNews(news);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedNews(null);
  }, []);

  if (sortedNews.length === 0) {
    return (
      <View className={cn("py-8", className)}>
        <Text className="text-zinc-500 text-center">
          No news available for selected tickers
        </Text>
      </View>
    );
  }

  return (
    <View className={cn("flex-1", className)}>
      {sortedNews.map((news) => (
        <NewsCard
          key={news.id}
          news={news}
          onPress={() => handleNewsPress(news)}
        />
      ))}

      <NewsDetailModal
        news={selectedNews}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default NewsFeed;
