// Stock data types and mock data for fundamental analysis

export interface QuarterlyFinancial {
  quarter: string;
  revenue: number;
  expenses: number;
  ebitda: number;
  netIncome: number;
}

export interface IncomeStatementData {
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

export interface BalanceSheetData {
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

export interface CashFlowData {
  quarter: string;
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  financingCashFlow: number;
  investingCashFlow: number;
  endingCashBalance: number;
}

export type FinancialStatement = 'income' | 'balance' | 'cashflow';

export interface TechnicalIndicators {
  rsi: number; // 0-100
  macd: number; // MACD line value
  macdSignal: number; // Signal line
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  sma20: number; // 20-day simple moving average
  sma50: number; // 50-day simple moving average
  sma200: number; // 200-day simple moving average
}

export interface HistoricalTechnicalData {
  date: string; // YYYY-MM-DD
  rsi: number;
  macd: number;
  bollingerMiddle: number;
}

export interface HistoricalRatioData {
  date: string; // YYYY-MM-DD
  pe: number;
  ps: number;
  pb: number;
  roe: number;
  debtToEquity: number;
}

export interface FinancialRatios {
  pe: number; // Price to Earnings
  peg: number; // Price/Earnings to Growth
  ps: number; // Price to Sales
  pb: number; // Price to Book
  pcf: number; // Price to Cash Flow
  roe: number; // Return on Equity (%)
  roa: number; // Return on Assets (%)
  debtToEquity: number; // Debt to Equity ratio
  currentRatio: number; // Current Ratio
  quickRatio: number; // Quick Ratio
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  currentPrice: number;
  priceChange: number; // percentage
  quarterlyData: QuarterlyFinancial[];
  incomeStatement: IncomeStatementData[];
  balanceSheet: BalanceSheetData[];
  cashFlow: CashFlowData[];
  technicalIndicators: TechnicalIndicators;
  financialRatios: FinancialRatios;
  historicalTechnical: HistoricalTechnicalData[];
  historicalRatios: HistoricalRatioData[];
}

export interface SP500Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in billions
  return: number; // percentage return (positive/negative)
}

// Helper function to generate 5-year quarterly data
function generateQuarterlyData(baseRevenue: number, volatility: number, baseYear: number): QuarterlyFinancial[] {
  const data: QuarterlyFinancial[] = [];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  for (let year = baseYear - 4; year <= baseYear; year++) {
    for (let q = 1; q <= 4; q++) {
      const seasonality = 1 + (q === 4 ? 0.15 : q === 1 ? -0.05 : 0);
      const variance = 1 + (Math.random() - 0.5) * volatility;
      const revenue = baseRevenue * seasonality * variance * (1 + (year - baseYear) * 0.08);
      const expenses = revenue * (0.55 + Math.random() * 0.1);
      const ebitda = (revenue - expenses) * (1 + Math.random() * 0.2);
      const netIncome = ebitda * 0.65 * (1 + Math.random() * 0.15);

      data.push({
        quarter: `${quarters[q - 1]} ${year}`,
        revenue: Math.round(revenue * 10) / 10,
        expenses: Math.round(expenses * 10) / 10,
        ebitda: Math.round(ebitda * 10) / 10,
        netIncome: Math.round(netIncome * 10) / 10,
      });
    }
  }
  return data;
}

function generateIncomeStatement(quarterlyData: QuarterlyFinancial[]): IncomeStatementData[] {
  return quarterlyData.map((q) => ({
    quarter: q.quarter,
    revenue: q.revenue,
    costOfRevenue: q.revenue * 0.45,
    grossProfit: q.revenue * 0.55,
    operatingExpenses: q.expenses * 0.7,
    operatingIncome: q.ebitda * 0.85,
    interestExpense: q.revenue * 0.02,
    taxesPaid: q.netIncome * 0.21,
    netIncome: q.netIncome,
  }));
}

function generateBalanceSheet(quarterlyData: QuarterlyFinancial[]): BalanceSheetData[] {
  return quarterlyData.map((q, i) => {
    const assetMultiplier = 1 + i * 0.02;
    return {
      quarter: q.quarter,
      totalAssets: q.revenue * 4 * assetMultiplier,
      currentAssets: q.revenue * 2 * assetMultiplier,
      totalLiabilities: q.revenue * 1.5 * assetMultiplier,
      currentLiabilities: q.revenue * 0.8 * assetMultiplier,
      totalEquity: q.revenue * 2.5 * assetMultiplier,
      cashAndEquivalents: q.revenue * 0.5 * assetMultiplier,
      accountsReceivable: q.revenue * 0.35 * assetMultiplier,
      inventory: q.revenue * 0.3 * assetMultiplier,
    };
  });
}

function generateCashFlow(quarterlyData: QuarterlyFinancial[]): CashFlowData[] {
  return quarterlyData.map((q, i) => ({
    quarter: q.quarter,
    operatingCashFlow: q.netIncome * 1.2 + Math.random() * 5,
    capitalExpenditures: q.revenue * 0.08,
    freeCashFlow: q.netIncome * 1.1,
    financingCashFlow: -(q.revenue * 0.02),
    investingCashFlow: -(q.revenue * 0.05),
    endingCashBalance: 50 + i * 0.5,
  }));
}

function generateTechnicalIndicators(): TechnicalIndicators {
  return {
    rsi: 40 + Math.random() * 30, // 40-70 range mostly
    macd: -2 + Math.random() * 4, // -2 to 2 range
    macdSignal: -1 + Math.random() * 2, // -1 to 1 range
    bollingerUpper: 200 + Math.random() * 50,
    bollingerMiddle: 170 + Math.random() * 50,
    bollingerLower: 150 + Math.random() * 40,
    sma20: 165 + Math.random() * 50,
    sma50: 160 + Math.random() * 50,
    sma200: 155 + Math.random() * 50,
  };
}

function generateFinancialRatios(currentPrice: number, latestIncome: IncomeStatementData, latestBalance: BalanceSheetData): FinancialRatios {
  const eps = latestIncome.netIncome / 2.5; // Simplified: assume 2.5B shares
  const pe = currentPrice / eps;
  const ps = currentPrice / (latestIncome.revenue / 2.5);
  const pb = currentPrice / (latestBalance.totalEquity / 2.5);
  const pcf = currentPrice / (latestBalance.totalEquity * 0.3); // Simplified

  return {
    pe: Math.max(pe, 5), // Minimum 5x
    peg: pe / 20, // Assume 20% growth
    ps: Math.max(ps, 2),
    pb: Math.max(pb, 1.5),
    pcf: Math.max(pcf, 8),
    roe: (latestIncome.netIncome / latestBalance.totalEquity) * 100,
    roa: (latestIncome.netIncome / latestBalance.totalAssets) * 100,
    debtToEquity: latestBalance.totalLiabilities / latestBalance.totalEquity,
    currentRatio: latestBalance.currentAssets / latestBalance.currentLiabilities,
    quickRatio: (latestBalance.currentAssets - latestBalance.inventory) / latestBalance.currentLiabilities,
  };
}

function generateHistoricalTechnicalData(days: number = 365): HistoricalTechnicalData[] {
  const data: HistoricalTechnicalData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic technical values that vary over time
    const dayFraction = i / days;
    const trend = Math.sin(dayFraction * Math.PI * 4) * 20; // Oscillating trend

    data.push({
      date: dateStr,
      rsi: 50 + trend + (Math.random() - 0.5) * 15,
      macd: trend / 10 + (Math.random() - 0.5) * 0.5,
      bollingerMiddle: 170 + trend + (Math.random() - 0.5) * 20,
    });
  }

  return data;
}

function generateHistoricalRatioData(days: number = 365): HistoricalRatioData[] {
  const data: HistoricalRatioData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic ratio values that vary over time
    const dayFraction = i / days;
    const trend = Math.sin(dayFraction * Math.PI * 2) * 3; // Oscillating trend

    data.push({
      date: dateStr,
      pe: 20 + trend + (Math.random() - 0.5) * 5,
      ps: 4 + trend * 0.2 + (Math.random() - 0.5) * 1,
      pb: 3 + trend * 0.15 + (Math.random() - 0.5) * 0.8,
      roe: 15 + trend + (Math.random() - 0.5) * 5,
      debtToEquity: 0.5 + trend * 0.05 + (Math.random() - 0.5) * 0.2,
    });
  }

  return data;
}

// Mock quarterly data for featured stocks (20 quarters / 5 years)
export const FEATURED_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    marketCap: 2890,
    currentPrice: 178.52,
    priceChange: 2.34,
    quarterlyData: generateQuarterlyData(100, 0.15, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095), // 3 years
    historicalRatios: generateHistoricalRatioData(1095), // 3 years
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    marketCap: 2780,
    currentPrice: 374.58,
    priceChange: 1.87,
    quarterlyData: generateQuarterlyData(60, 0.12, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095),
    historicalRatios: generateHistoricalRatioData(1095),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    marketCap: 1720,
    currentPrice: 139.25,
    priceChange: -0.54,
    quarterlyData: generateQuarterlyData(80, 0.14, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095),
    historicalRatios: generateHistoricalRatioData(1095),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    marketCap: 1580,
    currentPrice: 151.94,
    priceChange: 3.21,
    quarterlyData: generateQuarterlyData(140, 0.18, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095),
    historicalRatios: generateHistoricalRatioData(1095),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    sector: 'Technology',
    marketCap: 1120,
    currentPrice: 454.72,
    priceChange: 5.67,
    quarterlyData: generateQuarterlyData(35, 0.22, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095),
    historicalRatios: generateHistoricalRatioData(1095),
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    sector: 'Technology',
    marketCap: 980,
    currentPrice: 386.27,
    priceChange: 1.45,
    quarterlyData: generateQuarterlyData(40, 0.16, 2025),
    get incomeStatement() { return generateIncomeStatement(this.quarterlyData); },
    get balanceSheet() { return generateBalanceSheet(this.quarterlyData); },
    get cashFlow() { return generateCashFlow(this.quarterlyData); },
    technicalIndicators: generateTechnicalIndicators(),
    get financialRatios() {
      const latestIncome = this.incomeStatement[this.incomeStatement.length - 1];
      const latestBalance = this.balanceSheet[this.balanceSheet.length - 1];
      return generateFinancialRatios(this.currentPrice, latestIncome, latestBalance);
    },
    historicalTechnical: generateHistoricalTechnicalData(1095),
    historicalRatios: generateHistoricalRatioData(1095),
  },
];

// S&P 500 sample stocks for heatmap
export const SP500_STOCKS: SP500Stock[] = [
  // Technology
  { symbol: 'AAPL', name: 'Apple', sector: 'Technology', marketCap: 2890, return: 2.34 },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology', marketCap: 2780, return: 1.87 },
  { symbol: 'GOOGL', name: 'Alphabet', sector: 'Technology', marketCap: 1720, return: -0.54 },
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Technology', marketCap: 1120, return: 5.67 },
  { symbol: 'META', name: 'Meta', sector: 'Technology', marketCap: 980, return: 1.45 },
  { symbol: 'AVGO', name: 'Broadcom', sector: 'Technology', marketCap: 580, return: 3.21 },
  { symbol: 'ORCL', name: 'Oracle', sector: 'Technology', marketCap: 310, return: -1.23 },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Technology', marketCap: 245, return: 0.89 },
  { symbol: 'AMD', name: 'AMD', sector: 'Technology', marketCap: 220, return: 4.56 },
  { symbol: 'ADBE', name: 'Adobe', sector: 'Technology', marketCap: 215, return: -2.34 },
  { symbol: 'INTC', name: 'Intel', sector: 'Technology', marketCap: 180, return: -4.21 },
  { symbol: 'CSCO', name: 'Cisco', sector: 'Technology', marketCap: 195, return: 0.45 },

  // Healthcare
  { symbol: 'UNH', name: 'UnitedHealth', sector: 'Healthcare', marketCap: 480, return: -1.56 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 380, return: 0.23 },
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', marketCap: 565, return: 6.78 },
  { symbol: 'PFE', name: 'Pfizer', sector: 'Healthcare', marketCap: 155, return: -3.45 },
  { symbol: 'ABBV', name: 'AbbVie', sector: 'Healthcare', marketCap: 285, return: 1.12 },
  { symbol: 'MRK', name: 'Merck', sector: 'Healthcare', marketCap: 265, return: -0.89 },
  { symbol: 'TMO', name: 'Thermo Fisher', sector: 'Healthcare', marketCap: 195, return: 2.34 },

  // Financial
  { symbol: 'BRK.B', name: 'Berkshire', sector: 'Financial', marketCap: 785, return: 1.23 },
  { symbol: 'JPM', name: 'JPMorgan', sector: 'Financial', marketCap: 495, return: 2.67 },
  { symbol: 'V', name: 'Visa', sector: 'Financial', marketCap: 520, return: 0.98 },
  { symbol: 'MA', name: 'Mastercard', sector: 'Financial', marketCap: 395, return: 1.45 },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financial', marketCap: 255, return: -1.78 },
  { symbol: 'WFC', name: 'Wells Fargo', sector: 'Financial', marketCap: 175, return: -0.56 },
  { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financial', marketCap: 125, return: 3.21 },

  // Consumer
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer', marketCap: 1580, return: 3.21 },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Consumer', marketCap: 560, return: -2.89 },
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer', marketCap: 335, return: 0.67 },
  { symbol: 'MCD', name: "McDonald's", sector: 'Consumer', marketCap: 205, return: -0.34 },
  { symbol: 'NKE', name: 'Nike', sector: 'Consumer', marketCap: 145, return: -1.98 },
  { symbol: 'SBUX', name: 'Starbucks', sector: 'Consumer', marketCap: 105, return: 1.23 },
  { symbol: 'COST', name: 'Costco', sector: 'Consumer', marketCap: 295, return: 2.45 },

  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', marketCap: 425, return: -0.78 },
  { symbol: 'CVX', name: 'Chevron', sector: 'Energy', marketCap: 275, return: -1.23 },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', marketCap: 125, return: 0.45 },
  { symbol: 'SLB', name: 'Schlumberger', sector: 'Energy', marketCap: 65, return: 2.34 },

  // Industrial
  { symbol: 'CAT', name: 'Caterpillar', sector: 'Industrial', marketCap: 165, return: 1.89 },
  { symbol: 'RTX', name: 'RTX Corp', sector: 'Industrial', marketCap: 145, return: 0.56 },
  { symbol: 'BA', name: 'Boeing', sector: 'Industrial', marketCap: 115, return: -5.67 },
  { symbol: 'HON', name: 'Honeywell', sector: 'Industrial', marketCap: 135, return: 0.78 },
  { symbol: 'UPS', name: 'UPS', sector: 'Industrial', marketCap: 95, return: -2.12 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Industrial', marketCap: 185, return: 3.45 },

  // Communication
  { symbol: 'DIS', name: 'Disney', sector: 'Communication', marketCap: 165, return: -1.34 },
  { symbol: 'NFLX', name: 'Netflix', sector: 'Communication', marketCap: 245, return: 4.23 },
  { symbol: 'CMCSA', name: 'Comcast', sector: 'Communication', marketCap: 145, return: -0.67 },
  { symbol: 'T', name: 'AT&T', sector: 'Communication', marketCap: 125, return: 0.89 },
  { symbol: 'VZ', name: 'Verizon', sector: 'Communication', marketCap: 155, return: 0.34 },
];

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial',
  'Consumer',
  'Energy',
  'Industrial',
  'Communication',
] as const;

export type Sector = (typeof SECTORS)[number];

export const SECTOR_COLORS: Record<Sector, string> = {
  Technology: '#3B82F6',
  Healthcare: '#10B981',
  Financial: '#8B5CF6',
  Consumer: '#F59E0B',
  Energy: '#EF4444',
  Industrial: '#6B7280',
  Communication: '#EC4899',
};

// Format helpers
export const formatBillions = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}T`;
  }
  return `$${value.toFixed(0)}B`;
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};
