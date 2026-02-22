# Stock Analysis Pro

A comprehensive stock analysis app with fundamental insights, advanced charting, portfolio management, and financial calendar.

## Major Enhancements (v3.2)

### 1. Expandable Charts with Fullscreen View
**Enhanced chart interaction across all Analysis views:**

#### Expand Icon Feature
- **Maximize button** on all charts (Technical Indicators, Financial Ratios, Fundamental Analysis)
- Click to view charts in fullscreen modal for detailed analysis
- Close button to return to normal view
- Clean, distraction-free fullscreen interface

#### Improved Column Value Display
- **Dynamic positioning**: Selected column values now display directly above bars (not at top)
- **Automatic sizing**: Font size adapts based on value length to prevent truncation
- **Full number visibility**: No "..." truncation - complete values always displayed
- **Better spacing**: Improved layout for single and comparison bar charts

### 2. Chart Types with Fullscreen Support
- **Line Charts**: Technical indicator trends (RSI, MACD, Bollinger Bands)
- **Bar Charts**: Fundamental financial data (Income, Balance Sheet, Cash Flow)
- **Comparison Charts**: Side-by-side comparison bars for stock analysis

## Major Enhancements (v3.1)

### 1. Enhanced Analysis Screen - Technical & Ratios Views
**Complete overhaul of Technical Indicators and Financial Ratios components with dual list/chart visualization:**

#### Technical Indicators
- **List View**: Current values for RSI, MACD, Bollinger Bands, and Moving Averages with clear "Current" labels
  - RSI with overbought (>70) and oversold (<30) thresholds
  - MACD line and signal line with status indicators
  - Bollinger Bands showing price position relative to upper/middle/lower bands
  - SMA 20, 50, 200 with trend indicators showing price above/below each MA
- **Chart View**: Historical trend visualization for 1-year and 3-year periods
  - RSI Trend chart showing momentum oscillation
  - MACD Trend chart showing momentum changes
  - Bollinger Middle Band Trend chart showing MA movement
  - Automatic data scaling and line chart visualization

#### Financial Ratios
- **List View**: Current values with rolling averages for key metrics
  - Valuation Ratios: P/E, P/S, P/B, P/FCF, PEG (with rolling 1Y/3Y averages for P/E and P/S)
  - Profitability Ratios: ROE, ROA (with rolling 1Y/3Y averages for ROE)
  - Leverage Ratio: Debt-to-Equity
  - Liquidity Ratios: Current Ratio, Quick Ratio
  - All values labeled with "Current" to distinguish from historical averages
  - Green/Red color coding based on health benchmarks
- **Chart View**: Historical trend visualization for 1-year and 3-year periods
  - P/E Ratio Trend chart
  - P/S Ratio Trend chart
  - P/B Ratio Trend chart
  - ROE Trend chart
  - Debt-to-Equity Trend chart

### 2. Historical Data Storage
**Extended data structure for comprehensive analysis:**
- 3 years (1,095 days) of historical technical indicator values for each stock
- 3 years (1,095 days) of historical ratio values for each stock
- Enables both 1-year and 3-year period comparisons in chart views
- Realistic daily variations with trend patterns

## Major Enhancements (v3.0)

### 1. Dashboard - Portfolio & Watchlist Management

### 1. Dashboard - Portfolio & Watchlist Management
**New primary landing view with full portfolio tracking:**

#### Portfolio Mode
- Track your stock holdings with ticker and quantity
- Automatic market value calculation (Price × Quantity)
- Total portfolio value summary
- Add/remove stocks with search functionality

#### Watchlist Mode
- Track stocks you're interested in (ticker only)
- Quick add/remove functionality
- Monitor price changes

#### Dual Views
- **Table View**: Clean tabular layout with ticker, price, change %, and value
- **Map View (Heatmap)**: Treemap visualization where:
  - Portfolio mode: Tile size proportional to position value
  - Watchlist mode: Uniform tile sizes
  - Color gradient represents price change % (green=gain, red=loss)

#### News Feed
- Filtered news relevant to your portfolio/watchlist tickers
- Each card shows: Company Logo, Ticker, Headline, Snippet, Timestamp
- Click to expand full article in modal
- Uses Clearbit API for company logos

### 2. Global Financial Calendar
**New Calendar page with three-way tab switcher:**

#### Earnings Tab
- Upcoming earnings reports with company logos
- Filter by "Today" or "This Week"
- Shows: Ticker, Report Date, AM/PM indicator
- Analyst Estimate vs. Actual (when available)
- Beat/Miss indicators

#### Macro Tab
- Key economic data releases (CPI, NFP, FOMC, etc.)
- **Automatic timezone conversion** to user's local time
- Country flags and event names
- Consensus vs. Previous values
- Importance indicators (High/Medium/Low)

#### Events Tab
- Corporate events (WWDC, GTC, Build, etc.)
- Company logo, ticker, date
- 2-line event descriptions
- Sorted by date

### 3. Enhanced Analysis Screen
**Redesigned Analysis tab with improved stock selection and three analysis views:**

#### Dual Search Boxes
- Primary company search with autocomplete results
- Optional comparison company search
- Comparison search excludes primary company to prevent self-comparison
- Autocomplete dropdown limited to 5 results for easy scanning

#### Company Info Box
- Displays: Ticker, Name, Current Price, Price Change %, Market Cap, Sector
- Brief company description (pre-populated for AAPL, MSFT, GOOGL, AMZN, NVDA, META)
- Clean card layout below search boxes
- Compact and focused information architecture

#### Three Analysis Views
- **Fundamental**: Financial statements (Income, Balance Sheet, Cash Flow) with aggregation and comparison support
- **Technical**: Technical indicators with dual list/chart views
  - List view: RSI, MACD, Bollinger Bands, and Moving Averages (SMA20, SMA50, SMA200) with "Current" labels
  - Chart view: Historical trend lines for RSI, MACD, and Bollinger Middle Band with 1-year/3-year period toggle
- **Ratios**: Financial ratios with dual list/chart views
  - List view: Valuation (P/E, P/S, P/B, P/FCF, PEG), Profitability (ROE, ROA), Leverage (Debt-to-Equity), and Liquidity (Current, Quick) ratios with "Current" labels and rolling 1-year/3-year averages
  - Chart view: Historical trend lines for P/E, P/S, P/B, ROE, and Debt-to-Equity with 1-year/3-year period toggle

#### Improved Heatmap Screen
- Multiple index tabs: S&P 500, NASDAQ 100, DOW, Watchlist, Portfolio
- Time period dropdown selector: Today, 1 Week, 1 Month, YTD, 1 Year
- Maintains treemap visualization with color-coded performance
- Stock detail modal for quick information access

#### Dashboard Optimizations
- Compact header with inline position count (e.g., "5 positions")
- Single-row toggle for Portfolio/Watchlist + Table/Map views
- Portfolio table includes P/L (Profit/Loss) column showing dollar gain/loss
- All currency values rounded to 0 decimals for cleaner display
- Portfolio row editing: Click any position to open modal for updating quantity or removing
- Watchlist has quick remove button on each row

#### Calendar Optimizations
- **Earnings Tab**: Compact card layout with logo on left, estimates on right (EPS & Revenue)
- **Macro Tab**: Single-row layout squeezing date, local time, consensus, previous, and actual into one line
- **All Calendar Events**: Converted from FlatList to View + map() to avoid virtualization nesting issues

## Previous Features (v2.0)

### Extended Data Horizon
- **3-Year Historical View**: All stocks include 3 years (1,095 days) of historical technical indicators and financial ratios
- Complete trend analysis for technical indicators (RSI, MACD, Bollinger Bands)
- Complete trend analysis for financial ratios (P/E, P/S, P/B, ROE, Debt-to-Equity)

### 2. Multiple Financial Statements
Comprehensive financial analysis across three statements:
- **Income Statement**: Revenue, expenses, operating income, net income
- **Balance Sheet**: Assets, liabilities, equity, cash positions
- **Cash Flow**: Operating, investing, and financing activities

### 3. Financial Tabs
Switch between Income Statement, Balance Sheet, and Cash Flow with a clean tabbed interface. Each statement displays relevant metrics with color-coded gradients.

### 4. Time-Series Data Aggregation
Toggle between three aggregation modes:
- **Quarterly**: Raw quarterly data points
- **TTM (Trailing Twelve Months)**: Rolling 4-quarter sum for trend smoothing
- **Annual**: Fiscal year totals (auto-hides current year if Q4 incomplete)

### 5. Interactive Chart Features
- **Bar Column Selection**: Tap any bar to highlight and see exact USD value
- **Zoom Modal**: Click zoom icon to expand chart for detailed inspection
- **YoY Tracking**: Year-over-year growth metrics alongside QoQ changes
- **Color-Coded Indicators**: Green for positive, red for negative trends

### 6. Benchmarking Mode
Compare two companies side-by-side:
- Enter a ticker symbol to compare
- View clustered bar charts comparing metrics
- Display side-by-side statistics (revenue, market cap, price)
- Visual legend distinguishing primary vs comparison stock

## Features

### Analysis Tab
- **Dual Search Boxes**: Search for primary company and optional comparison company
- **Company Info Box**: Displays ticker, name, price, change %, market cap, sector, and brief company description
- **5-Year Financial Data**: Income Statement, Balance Sheet, Cash Flow
- **Data Aggregation**: Switch between Quarterly, TTM, and Annual views
- **Interactive Charts**: Click bars for details, zoom for full inspection
- **Benchmarking**: Compare with comparison companies using dual search

### Heatmap Tab
- **S&P 500 Visualization**: Market heatmap showing stock performance
- **Color Coding**:
  - Green = positive returns
  - Red = negative returns
- **Size Representation**: Cell size reflects market capitalization
- **Sector Grouping**: Stocks organized by sector
- **Stock Details Modal**: Tap any stock for detailed information

### Subscription
- Monthly: $9.99/month
- Annual: $89.99/year (25% savings)

## Tech Stack
- Expo SDK 53
- React Native 0.76.7
- react-native-reanimated for animations
- expo-linear-gradient for chart gradients
- NativeWind/TailwindCSS for styling
- lucide-react-native for icons

## File Structure
```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Tab navigation (4 tabs)
│   │   ├── dashboard.tsx            # NEW - Dashboard screen
│   │   ├── index.tsx                # Analysis screen
│   │   ├── two.tsx                  # Heatmap screen
│   │   └── calendar.tsx             # NEW - Calendar screen
│   ├── _layout.tsx                  # Root layout
│   └── subscription.tsx             # Paywall/subscription modal
├── components/
│   ├── dashboard/                   # NEW - Dashboard components
│   │   ├── CompactViewToggle.tsx    # Compact Portfolio/Watchlist & Table/Map toggle
│   │   ├── SearchBar.tsx            # Ticker search with autocomplete
│   │   ├── PortfolioTable.tsx       # Table view with P/L column & editing
│   │   ├── PortfolioHeatmap.tsx     # Treemap heatmap component
│   │   ├── NewsFeed.tsx             # News feed with filtering
│   │   └── NewsDetailModal.tsx      # Full article modal
│   ├── calendar/                    # NEW - Calendar components
│   │   ├── CalendarTabs.tsx         # Earnings/Macro/Events toggle
│   │   ├── EarningsTab.tsx          # Earnings calendar (compact layout)
│   │   ├── MacroTab.tsx             # Macro events with timezone & single-row layout
│   │   └── EventsTab.tsx            # Corporate events
│   ├── AnalysisSearch.tsx           # NEW - Dual search & company info box
│   ├── TechnicalIndicators.tsx      # NEW - RSI, MACD, Bollinger Bands, SMA
│   ├── FinancialRatios.tsx          # NEW - P/E, ROE, Debt-to-Equity, etc.
│   ├── AdvancedFinancialChart.tsx   # Advanced charting with aggregation
│   ├── BenchmarkingMode.tsx         # Dual-stock comparison
│   ├── FinancialChart.tsx           # Legacy charts
│   ├── Heatmap.tsx                  # Multiple index heatmaps with time periods
│   └── StockCard.tsx                # Stock selection cards
└── lib/
    ├── stock-data.ts                # Stock data & mock data
    ├── financial-data.ts            # NEW - News & calendar mock data
    └── state/
        └── portfolio-store.ts       # NEW - Zustand store for portfolio
```

## New Components

### AdvancedFinancialChart.tsx
Core component for financial visualization with:
- Quarterly, TTM, and Annual aggregation
- Interactive bar selection
- Zoom modal expansion
- YoY/QoQ change calculation
- Dynamic metric selection

```tsx
<AdvancedFinancialChart
  symbol="AAPL"
  incomeStatement={data.incomeStatement}
  metric="revenue"
  title="Revenue"
/>
```

### BenchmarkingMode.tsx
Dual-stock comparison interface:
- Clustered bar chart visualization
- Side-by-side metrics comparison
- Available stock selection

```tsx
<BenchmarkingMode
  primaryStock={selectedStock}
  onClose={() => setShowBenchmarking(false)}
/>
```

## Usage Examples

### View 5-Year Analysis
1. Tap Analysis tab
2. Select a stock from carousel
3. View all financial statements across 5 years

### Compare Data Periods
1. On any chart, tap: **Quarterly** | **TTM** | **Annual**
2. See data re-aggregated by period
3. Use TTM for trend smoothing

### Zoom Into Details
1. Click zoom icon in chart header
2. View full 20-quarter dataset in table
3. Scroll through all historical data

### Benchmark Two Companies
1. Tap "Compare with Another Stock"
2. Enter ticker (AAPL, MSFT, GOOGL, AMZN, NVDA, META)
3. View side-by-side comparison with charts

## Data Structure

### Extended Stock Interface
```tsx
interface Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  currentPrice: number;
  priceChange: number;
  quarterlyData: QuarterlyFinancial[];        // 20 quarters
  incomeStatement: IncomeStatementData[];     // 20 quarters
  balanceSheet: BalanceSheetData[];           // 20 quarters
  cashFlow: CashFlowData[];                   // 20 quarters
}
```

### Financial Statement Types
```tsx
interface IncomeStatementData {
  quarter: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  interestExpense: number;
  taxesPaid: number;
  netIncome: number;
}

interface BalanceSheetData {
  quarter: string;
  totalAssets: number;
  currentAssets: number;
  totalLiabilities: number;
  currentLiabilities: number;
  totalEquity: number;
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
}

interface CashFlowData {
  quarter: string;
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  financingCashFlow: number;
  investingCashFlow: number;
  endingCashBalance: number;
}
```

## Supported Stocks

- **AAPL** - Apple Inc. (Technology)
- **MSFT** - Microsoft Corp. (Technology)
- **GOOGL** - Alphabet Inc. (Technology)
- **AMZN** - Amazon.com Inc. (Consumer)
- **NVDA** - NVIDIA Corp. (Technology)
- **META** - Meta Platforms (Technology)

## Future Enhancements

- Real-time data integration with financial APIs
- Expanded stock universe
- Financial ratio analysis (P/E, ROE, Debt-to-Equity)
- Custom date range selection
- Export to PDF/CSV
- Push notifications for earnings/macro events
- Advanced filters and search
- Social features (share portfolios)

## Subscription Setup
To enable real payments, go to the PAYMENTS tab in Vibecode to set up RevenueCat.

## Navigation Structure

The app has 4 main tabs:
1. **Dashboard** - Portfolio/Watchlist management with news
2. **Analysis** - Detailed stock fundamental analysis
3. **Heatmap** - S&P 500 market visualization
4. **Calendar** - Earnings, Macro events, Corporate events

