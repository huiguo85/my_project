// Portfolio and Watchlist State Management
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PortfolioItem {
  ticker: string;
  quantity: number;
  addedAt: number;
}

export interface WatchlistItem {
  ticker: string;
  addedAt: number;
}

export type ViewMode = "portfolio" | "watchlist";
export type DisplayMode = "table" | "map";

interface PortfolioStore {
  // View state
  viewMode: ViewMode;
  displayMode: DisplayMode;

  // Data
  portfolio: PortfolioItem[];
  watchlist: WatchlistItem[];

  // Actions - View
  setViewMode: (mode: ViewMode) => void;
  setDisplayMode: (mode: DisplayMode) => void;

  // Actions - Portfolio
  addToPortfolio: (ticker: string, quantity: number) => void;
  removeFromPortfolio: (ticker: string) => void;
  updatePortfolioQuantity: (ticker: string, quantity: number) => void;

  // Actions - Watchlist
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;

  // Utility
  isInPortfolio: (ticker: string) => boolean;
  isInWatchlist: (ticker: string) => boolean;
  getPortfolioItem: (ticker: string) => PortfolioItem | undefined;
}

const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      // Initial state
      viewMode: "portfolio",
      displayMode: "table",
      portfolio: [
        { ticker: "AAPL", quantity: 50, addedAt: Date.now() },
        { ticker: "MSFT", quantity: 30, addedAt: Date.now() },
        { ticker: "GOOGL", quantity: 20, addedAt: Date.now() },
        { ticker: "NVDA", quantity: 15, addedAt: Date.now() },
      ],
      watchlist: [
        { ticker: "AMZN", addedAt: Date.now() },
        { ticker: "META", addedAt: Date.now() },
        { ticker: "TSLA", addedAt: Date.now() },
      ],

      // View actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setDisplayMode: (mode) => set({ displayMode: mode }),

      // Portfolio actions
      addToPortfolio: (ticker, quantity) => {
        const current = get().portfolio;
        const exists = current.find(p => p.ticker.toUpperCase() === ticker.toUpperCase());

        if (exists) {
          set({
            portfolio: current.map(p =>
              p.ticker.toUpperCase() === ticker.toUpperCase()
                ? { ...p, quantity: p.quantity + quantity }
                : p
            ),
          });
        } else {
          set({
            portfolio: [...current, { ticker: ticker.toUpperCase(), quantity, addedAt: Date.now() }],
          });
        }
      },

      removeFromPortfolio: (ticker) => {
        set({
          portfolio: get().portfolio.filter(
            p => p.ticker.toUpperCase() !== ticker.toUpperCase()
          ),
        });
      },

      updatePortfolioQuantity: (ticker, quantity) => {
        if (quantity <= 0) {
          get().removeFromPortfolio(ticker);
          return;
        }
        set({
          portfolio: get().portfolio.map(p =>
            p.ticker.toUpperCase() === ticker.toUpperCase()
              ? { ...p, quantity }
              : p
          ),
        });
      },

      // Watchlist actions
      addToWatchlist: (ticker) => {
        const current = get().watchlist;
        const exists = current.find(w => w.ticker.toUpperCase() === ticker.toUpperCase());

        if (!exists) {
          set({
            watchlist: [...current, { ticker: ticker.toUpperCase(), addedAt: Date.now() }],
          });
        }
      },

      removeFromWatchlist: (ticker) => {
        set({
          watchlist: get().watchlist.filter(
            w => w.ticker.toUpperCase() !== ticker.toUpperCase()
          ),
        });
      },

      // Utility functions
      isInPortfolio: (ticker) => {
        return get().portfolio.some(
          p => p.ticker.toUpperCase() === ticker.toUpperCase()
        );
      },

      isInWatchlist: (ticker) => {
        return get().watchlist.some(
          w => w.ticker.toUpperCase() === ticker.toUpperCase()
        );
      },

      getPortfolioItem: (ticker) => {
        return get().portfolio.find(
          p => p.ticker.toUpperCase() === ticker.toUpperCase()
        );
      },
    }),
    {
      name: "portfolio-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePortfolioStore;
