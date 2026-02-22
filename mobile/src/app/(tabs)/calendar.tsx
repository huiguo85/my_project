import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarTabs, CalendarTabType } from "@/components/calendar/CalendarTabs";
import { EarningsTab } from "@/components/calendar/EarningsTab";
import { MacroTab } from "@/components/calendar/MacroTab";
import { EventsTab } from "@/components/calendar/EventsTab";

export default function CalendarScreen() {
  const [activeTab, setActiveTab] = useState<CalendarTabType>("earnings");

  const renderTabContent = () => {
    switch (activeTab) {
      case "earnings":
        return <EarningsTab />;
      case "macro":
        return <MacroTab />;
      case "events":
        return <EventsTab />;
      default:
        return <EarningsTab />;
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "earnings":
        return "Upcoming earnings reports from your tracked companies";
      case "macro":
        return "Key economic data releases (times in your timezone)";
      case "events":
        return "Corporate events, conferences, and investor days";
      default:
        return "";
    }
  };

  return (
    <View className="flex-1 bg-zinc-950">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tab Switcher */}
          <View className="px-4 pt-4">
            <CalendarTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          {/* Tab Content */}
          <View className="mt-4">{renderTabContent()}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
