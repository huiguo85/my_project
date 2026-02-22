import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  X,
  Crown,
  Check,
  BarChart3,
  TrendingUp,
  Bell,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PlanType = 'monthly' | 'annual';

const PLANS = {
  monthly: {
    price: '$9.99',
    period: '/month',
    description: 'Billed monthly',
    savings: null,
  },
  annual: {
    price: '$89.99',
    period: '/year',
    description: 'Billed annually',
    savings: 'Save 25%',
  },
};

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Advanced Fundamentals',
    description: 'Revenue, EBITDA, Net Income & more quarterly data',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Heatmaps',
    description: 'S&P 500 market visualization updated live',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified when stocks hit your target price',
  },
  {
    icon: Zap,
    title: 'AI Insights',
    description: 'Intelligent analysis powered by machine learning',
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 customer support for Pro members',
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const buttonScale = useSharedValue(1);

  const handleSubscribe = () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    // In a real app, this would trigger the payment flow
    // For now, we'll just show a message
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#1e3a8a', '#000000', '#000000']}
        locations={[0, 0.4, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Close Button */}
        <View className="px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="self-end bg-zinc-800/50 p-2 rounded-full active:opacity-70"
          >
            <X size={24} color="#ffffff" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            className="items-center px-6 pt-4 pb-8"
          >
            <View className="bg-amber-500/20 p-4 rounded-full mb-4">
              <Crown size={40} color="#F59E0B" />
            </View>
            <Text className="text-white text-3xl font-bold text-center">
              Unlock Pro Features
            </Text>
            <Text className="text-zinc-400 text-center mt-3 leading-6">
              Get access to advanced analytics, real-time data, and AI-powered
              insights
            </Text>
          </Animated.View>

          {/* Plan Selector */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="px-6 mb-8"
          >
            <View className="bg-zinc-900 rounded-2xl p-1.5 flex-row">
              <Pressable
                onPress={() => setSelectedPlan('monthly')}
                className={`flex-1 py-3 rounded-xl ${
                  selectedPlan === 'monthly' ? 'bg-zinc-800' : ''
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  Monthly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedPlan('annual')}
                className={`flex-1 py-3 rounded-xl ${
                  selectedPlan === 'annual' ? 'bg-zinc-800' : ''
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Text
                    className={`font-semibold ${
                      selectedPlan === 'annual' ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    Annual
                  </Text>
                  {selectedPlan === 'annual' && (
                    <View className="bg-emerald-500/20 px-2 py-0.5 rounded-full ml-2">
                      <Text className="text-emerald-400 text-xs font-semibold">
                        -25%
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          </Animated.View>

          {/* Price Display */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="px-6 mb-8"
          >
            <View className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-6">
              <View className="flex-row items-end justify-center">
                <Text className="text-white text-5xl font-bold">
                  {PLANS[selectedPlan].price}
                </Text>
                <Text className="text-zinc-500 text-lg mb-2 ml-1">
                  {PLANS[selectedPlan].period}
                </Text>
              </View>
              <Text className="text-zinc-500 text-center mt-2">
                {PLANS[selectedPlan].description}
              </Text>
              {PLANS[selectedPlan].savings && (
                <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl py-2 mt-4">
                  <Text className="text-emerald-400 text-center font-semibold">
                    {PLANS[selectedPlan].savings} compared to monthly
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Features */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            className="px-6 mb-8"
          >
            <Text className="text-white text-lg font-semibold mb-4">
              What's included
            </Text>
            <View className="bg-zinc-900 rounded-2xl p-4">
              {FEATURES.map((feature, index) => (
                <View
                  key={feature.title}
                  className={`flex-row items-start ${
                    index < FEATURES.length - 1
                      ? 'border-b border-zinc-800 pb-4 mb-4'
                      : ''
                  }`}
                >
                  <View className="bg-blue-500/20 p-2 rounded-xl mr-3">
                    <feature.icon size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {feature.title}
                    </Text>
                    <Text className="text-zinc-500 text-sm mt-0.5">
                      {feature.description}
                    </Text>
                  </View>
                  <Check size={18} color="#10B981" />
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Subscribe Button */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            className="px-6"
          >
            <Animated.View style={buttonAnimatedStyle}>
              <Pressable
                onPress={handleSubscribe}
                className="overflow-hidden rounded-2xl active:opacity-90"
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ paddingVertical: 18, paddingHorizontal: 24 }}
                >
                  <View className="flex-row items-center justify-center">
                    <Sparkles size={20} color="#ffffff" />
                    <Text className="text-white text-lg font-bold ml-2">
                      Start Pro Subscription
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Terms */}
            <Text className="text-zinc-600 text-xs text-center mt-4 leading-5">
              Cancel anytime. Subscription automatically renews unless cancelled
              at least 24 hours before the end of the current period.
            </Text>

            {/* Restore Purchase */}
            <Pressable className="mt-4 py-2 active:opacity-70">
              <Text className="text-blue-400 text-center font-medium">
                Restore Purchase
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
