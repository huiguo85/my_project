import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  ImageSourcePropType,
} from "react-native";
import { X, Share2, Clock, ExternalLink } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewsItem } from "@/lib/financial-data";

interface NewsDetailModalProps {
  news: NewsItem | null;
  visible: boolean;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Reset image error when news changes
  React.useEffect(() => {
    setImageError(false);
  }, [news?.id]);

  const handleShare = useCallback(async () => {
    if (!news) return;

    try {
      await Share.share({
        title: news.headline,
        message: `${news.headline}\n\n${news.snippet}\n\nSource: ${news.source}`,
      });
    } catch (error) {
      // Handle share error silently
    }
  }, [news]);

  const formatFullDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!news) return null;

  const fallbackSource: ImageSourcePropType = {
    uri: `https://ui-avatars.com/api/?name=${news.ticker}&background=3B82F6&color=fff&size=80`,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 bg-zinc-950"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800">
          <View className="flex-row items-center flex-1">
            <Image
              source={imageError ? fallbackSource : { uri: news.logoUrl }}
              onError={handleImageError}
              className="w-10 h-10 rounded-lg bg-zinc-800 mr-3"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-blue-500 font-semibold text-sm">
                {news.ticker}
              </Text>
              <Text className="text-zinc-400 text-xs" numberOfLines={1}>
                {news.company}
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center ml-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <Text className="text-white font-bold text-2xl leading-8 mb-4">
            {news.headline}
          </Text>

          {/* Meta Info */}
          <View className="flex-row items-center flex-wrap mb-6">
            <View className="flex-row items-center mr-4 mb-2">
              <ExternalLink size={14} color="#71717a" />
              <Text className="text-zinc-400 text-sm ml-1.5">{news.source}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Clock size={14} color="#71717a" />
              <Text className="text-zinc-400 text-sm ml-1.5">
                {formatFullDate(news.timestamp)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-zinc-800 mb-6" />

          {/* Full Article Content */}
          <View>
            {news.fullContent.split("\n\n").map((paragraph, index) => {
              // Check if paragraph is a list (starts with -)
              if (paragraph.includes("\n-")) {
                const [intro, ...listItems] = paragraph.split("\n-");
                return (
                  <View key={index} className="mb-4">
                    {intro && (
                      <Text className="text-zinc-300 text-base leading-7 mb-2">
                        {intro}
                      </Text>
                    )}
                    {listItems.map((item, itemIndex) => (
                      <View key={itemIndex} className="flex-row mb-1.5 pl-2">
                        <Text className="text-blue-500 mr-2">•</Text>
                        <Text className="text-zinc-300 text-base leading-6 flex-1">
                          {item.trim()}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              }

              // Check if paragraph starts with a list item
              if (paragraph.startsWith("-")) {
                const listItems = paragraph.split("\n-");
                return (
                  <View key={index} className="mb-4">
                    {listItems.map((item, itemIndex) => (
                      <View key={itemIndex} className="flex-row mb-1.5 pl-2">
                        <Text className="text-blue-500 mr-2">•</Text>
                        <Text className="text-zinc-300 text-base leading-6 flex-1">
                          {item.replace(/^-\s*/, "").trim()}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              }

              // Regular paragraph
              return (
                <Text
                  key={index}
                  className="text-zinc-300 text-base leading-7 mb-4"
                >
                  {paragraph}
                </Text>
              );
            })}
          </View>
        </ScrollView>

        {/* Share Button */}
        <View
          className="px-4 py-4 border-t border-zinc-800"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Pressable
            onPress={handleShare}
            className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center"
            style={{
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Share2 size={20} color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">
              Share Article
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default NewsDetailModal;
