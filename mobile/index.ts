import "react-native-get-random-values";
import "react-native-reanimated";
import { LogBox } from "react-native";
import "./global.css";

// Patch console methods to handle undefined log objects on web
if (typeof window !== "undefined") {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  const safeLog = (fn: typeof originalLog) => (...args: any[]) => {
    try {
      return fn(...args);
    } catch (e) {
      // Silently handle logger errors on web
    }
  };

  console.log = safeLog(originalLog);
  console.warn = safeLog(originalWarn);
  console.error = safeLog(originalError);
}

import "expo-router/entry";
LogBox.ignoreLogs(["Expo AV has been deprecated", "Disconnected from Metro"]);
