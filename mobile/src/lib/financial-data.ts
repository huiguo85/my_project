// Mock news and calendar data for financial app

export interface NewsItem {
  id: string;
  ticker: string;
  company: string;
  headline: string;
  snippet: string;
  fullContent: string;
  source: string;
  timestamp: number;
  logoUrl: string;
}

export interface EarningsEvent {
  id: string;
  ticker: string;
  company: string;
  reportDate: string;
  reportTime: "BMO" | "AMC"; // Before Market Open / After Market Close
  estimatedEPS: number;
  actualEPS?: number;
  estimatedRevenue: number;
  actualRevenue?: number;
  logoUrl: string;
}

export interface MacroEvent {
  id: string;
  country: string;
  countryCode: string;
  eventName: string;
  description: string;
  dateTime: string; // ISO string in UTC
  consensus?: string;
  previous?: string;
  actual?: string;
  importance: "high" | "medium" | "low";
}

export interface CorporateEvent {
  id: string;
  ticker: string;
  company: string;
  eventName: string;
  description: string;
  date: string;
  logoUrl: string;
}

// Company domain mapping for Clearbit logos
export const COMPANY_DOMAINS: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "google.com",
  AMZN: "amazon.com",
  NVDA: "nvidia.com",
  META: "meta.com",
  TSLA: "tesla.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  JNJ: "jnj.com",
  UNH: "unitedhealthgroup.com",
  HD: "homedepot.com",
  PG: "pg.com",
  MA: "mastercard.com",
  DIS: "disney.com",
  NFLX: "netflix.com",
  COST: "costco.com",
  PFE: "pfizer.com",
  ABBV: "abbvie.com",
  MRK: "merck.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  WMT: "walmart.com",
  XOM: "exxonmobil.com",
  CVX: "chevron.com",
  BAC: "bankofamerica.com",
  WFC: "wellsfargo.com",
  INTC: "intel.com",
  AMD: "amd.com",
  CRM: "salesforce.com",
  ORCL: "oracle.com",
  ADBE: "adobe.com",
  BA: "boeing.com",
  CAT: "caterpillar.com",
  GE: "ge.com",
};

export const getLogoUrl = (ticker: string): string => {
  const domain = COMPANY_DOMAINS[ticker.toUpperCase()];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  return `https://ui-avatars.com/api/?name=${ticker}&background=3B82F6&color=fff&size=64`;
};

// Generate mock news data
const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    ticker: "AAPL",
    company: "Apple Inc.",
    headline: "Apple Unveils Revolutionary AI Features at WWDC 2025",
    snippet: "Apple announced a suite of AI-powered features coming to iOS 19, including an enhanced Siri with deep contextual understanding...",
    fullContent: `Apple announced a suite of AI-powered features coming to iOS 19 at WWDC 2025, marking the company's most significant AI initiative to date.

The centerpiece of the announcement is a completely redesigned Siri that leverages advanced large language models to provide contextual understanding across all Apple devices.

Key features include:
- Enhanced natural language processing for more conversational interactions
- Cross-app intelligence that understands context from emails, messages, and documents
- On-device AI processing for privacy-focused computing
- Integration with third-party apps through a new AI API

Apple CEO Tim Cook called this "the most important update to iOS in a decade," emphasizing the company's commitment to user privacy while delivering cutting-edge AI capabilities.

The update is expected to roll out in fall 2025 with the new iPhone 17 lineup.`,
    source: "TechCrunch",
    timestamp: now - hour * 2,
    logoUrl: getLogoUrl("AAPL"),
  },
  {
    id: "2",
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    headline: "NVIDIA Reports Record Q4 Revenue Driven by AI Chip Demand",
    snippet: "NVIDIA's data center revenue surged 265% year-over-year as demand for AI training chips continues to outpace supply...",
    fullContent: `NVIDIA reported record-breaking Q4 2025 revenue of $38.9 billion, driven primarily by unprecedented demand for its AI training and inference chips.

The company's data center segment, which includes its H200 and upcoming B100 chips, generated $32.4 billion in revenue—a 265% increase from the same quarter last year.

CEO Jensen Huang stated that "we are at the iPhone moment of AI" and announced expanded production partnerships with TSMC and Samsung to meet growing demand.

Key highlights:
- Data Center revenue: $32.4B (+265% YoY)
- Gaming revenue: $3.8B (+15% YoY)
- Automotive revenue: $1.1B (+85% YoY)
- Gross margin: 76.4%

NVIDIA also announced the Blackwell Ultra architecture, promising 4x performance improvements for AI training workloads.`,
    source: "Bloomberg",
    timestamp: now - hour * 5,
    logoUrl: getLogoUrl("NVDA"),
  },
  {
    id: "3",
    ticker: "MSFT",
    company: "Microsoft Corp.",
    headline: "Microsoft Azure AI Services Expansion Targets Enterprise Market",
    snippet: "Microsoft announced major expansions to Azure AI services, including new partnerships with OpenAI for enterprise deployments...",
    fullContent: `Microsoft unveiled significant expansions to its Azure AI services portfolio, targeting enterprise customers looking to deploy AI at scale.

The announcements include:
- Azure OpenAI Service enhancements with GPT-5 access
- New Copilot features for Microsoft 365 enterprise
- Expanded data center capacity in 15 new regions
- Strategic partnership extensions with OpenAI through 2030

CEO Satya Nadella emphasized that "every company will be an AI company" and highlighted Azure's role in making AI accessible to enterprises of all sizes.

The company also reported that Azure AI revenue grew 85% year-over-year, with over 65,000 organizations now using Azure OpenAI Service.`,
    source: "Reuters",
    timestamp: now - hour * 8,
    logoUrl: getLogoUrl("MSFT"),
  },
  {
    id: "4",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    headline: "Google Launches Gemini 2.0 with Multimodal Reasoning",
    snippet: "Google's latest AI model demonstrates breakthrough capabilities in complex reasoning across text, images, and video...",
    fullContent: `Google announced the launch of Gemini 2.0, its most advanced AI model to date, featuring significant improvements in multimodal reasoning and task completion.

The new model showcases:
- 10x improvement in complex mathematical reasoning
- Native video understanding and generation
- Real-time language translation across 150+ languages
- Integration with Google Search, Gmail, and Workspace

CEO Sundar Pichai called Gemini 2.0 "the foundation of AI-first computing" and announced plans to integrate the model across all Google products.

Early access is available to Google Cloud customers, with broader availability planned for Q2 2025.`,
    source: "The Verge",
    timestamp: now - hour * 12,
    logoUrl: getLogoUrl("GOOGL"),
  },
  {
    id: "5",
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    headline: "Amazon AWS Launches Trainium3 Chips for AI Workloads",
    snippet: "AWS unveiled its third-generation custom AI chips, offering 4x performance improvement over previous generation...",
    fullContent: `Amazon Web Services announced the launch of Trainium3, its third-generation custom silicon designed specifically for AI training and inference workloads.

Key specifications:
- 4x performance improvement over Trainium2
- 50% reduction in training costs for large language models
- Native support for 8-bit precision training
- Integrated high-bandwidth memory (HBM4)

AWS CEO Adam Selipsky stated that Trainium3 "democratizes AI by making advanced computing affordable for organizations of all sizes."

The chips will be available in preview for select AWS customers in Q2 2025, with general availability planned for late 2025.`,
    source: "CNBC",
    timestamp: now - hour * 18,
    logoUrl: getLogoUrl("AMZN"),
  },
  {
    id: "6",
    ticker: "META",
    company: "Meta Platforms",
    headline: "Meta's Reality Labs Achieves Breakthrough in AR Display Technology",
    snippet: "Meta announced a significant advancement in augmented reality display technology, paving the way for consumer AR glasses...",
    fullContent: `Meta's Reality Labs division unveiled breakthrough display technology that could enable truly consumer-ready augmented reality glasses.

The new holographic waveguide technology achieves:
- Full field-of-view color AR displays
- Glasses form factor weighing under 100 grams
- All-day battery life
- Integration with Ray-Ban styling

CEO Mark Zuckerberg called this "the most important technological achievement in Reality Labs' history" and announced plans for a 2026 product launch.

The development represents a major milestone in Meta's long-term vision for the metaverse and spatial computing.`,
    source: "Wired",
    timestamp: now - day,
    logoUrl: getLogoUrl("META"),
  },
  {
    id: "7",
    ticker: "TSLA",
    company: "Tesla Inc.",
    headline: "Tesla FSD v13 Achieves Level 4 Autonomy Certification in Nevada",
    snippet: "Tesla's Full Self-Driving software received the first state-level Level 4 autonomy certification in the United States...",
    fullContent: `Tesla announced that its Full Self-Driving (FSD) v13 software has received Level 4 autonomy certification from the Nevada Department of Motor Vehicles, marking a first in the United States.

The certification allows Tesla vehicles to operate without human supervision in designated areas of Las Vegas and surrounding highways.

Key developments:
- Approval covers specific geofenced operational design domain
- Robotaxi service pilot program to begin Q3 2025
- FSD v13 trained on over 10 billion miles of real-world data
- 99.9% reduction in intervention rates versus v12

CEO Elon Musk stated that "this is the beginning of the transportation revolution" and projected nationwide rollout within 18 months.`,
    source: "Electrek",
    timestamp: now - day - hour * 4,
    logoUrl: getLogoUrl("TSLA"),
  },
  {
    id: "8",
    ticker: "JPM",
    company: "JPMorgan Chase",
    headline: "JPMorgan Expands AI Trading Desk with $500M Investment",
    snippet: "JPMorgan announced a major expansion of its AI-powered trading operations with a $500 million technology investment...",
    fullContent: `JPMorgan Chase announced a $500 million investment to expand its AI-powered trading operations, marking one of the largest financial AI initiatives on Wall Street.

The investment includes:
- Expansion of the IndexGPT AI trading system
- Development of proprietary large language models for market analysis
- Hiring of 200+ AI and ML specialists
- New AI research center in San Francisco

CEO Jamie Dimon emphasized that "AI will fundamentally transform how we serve our clients" while maintaining that human oversight remains essential.

The bank expects the investment to generate $1.5 billion in annual cost savings by 2027.`,
    source: "Financial Times",
    timestamp: now - day - hour * 8,
    logoUrl: getLogoUrl("JPM"),
  },
];

// Generate mock earnings calendar data
const today = new Date();
const getDateString = (daysFromNow: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

export const MOCK_EARNINGS: EarningsEvent[] = [
  {
    id: "e1",
    ticker: "AAPL",
    company: "Apple Inc.",
    reportDate: getDateString(0),
    reportTime: "AMC",
    estimatedEPS: 2.35,
    estimatedRevenue: 94500000000,
    logoUrl: getLogoUrl("AAPL"),
  },
  {
    id: "e2",
    ticker: "MSFT",
    company: "Microsoft Corp.",
    reportDate: getDateString(0),
    reportTime: "AMC",
    estimatedEPS: 3.12,
    estimatedRevenue: 65800000000,
    logoUrl: getLogoUrl("MSFT"),
  },
  {
    id: "e3",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    reportDate: getDateString(1),
    reportTime: "AMC",
    estimatedEPS: 1.89,
    estimatedRevenue: 86200000000,
    logoUrl: getLogoUrl("GOOGL"),
  },
  {
    id: "e4",
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    reportDate: getDateString(1),
    reportTime: "AMC",
    estimatedEPS: 1.45,
    estimatedRevenue: 155000000000,
    logoUrl: getLogoUrl("AMZN"),
  },
  {
    id: "e5",
    ticker: "META",
    company: "Meta Platforms",
    reportDate: getDateString(2),
    reportTime: "AMC",
    estimatedEPS: 5.28,
    actualEPS: 5.45,
    estimatedRevenue: 40500000000,
    actualRevenue: 41200000000,
    logoUrl: getLogoUrl("META"),
  },
  {
    id: "e6",
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    reportDate: getDateString(3),
    reportTime: "AMC",
    estimatedEPS: 6.78,
    estimatedRevenue: 38900000000,
    logoUrl: getLogoUrl("NVDA"),
  },
  {
    id: "e7",
    ticker: "TSLA",
    company: "Tesla Inc.",
    reportDate: getDateString(4),
    reportTime: "AMC",
    estimatedEPS: 0.89,
    estimatedRevenue: 25800000000,
    logoUrl: getLogoUrl("TSLA"),
  },
  {
    id: "e8",
    ticker: "JPM",
    company: "JPMorgan Chase",
    reportDate: getDateString(5),
    reportTime: "BMO",
    estimatedEPS: 4.65,
    estimatedRevenue: 42500000000,
    logoUrl: getLogoUrl("JPM"),
  },
];

// Generate mock macro calendar data (times in UTC)
export const MOCK_MACRO_EVENTS: MacroEvent[] = [
  {
    id: "m1",
    country: "United States",
    countryCode: "US",
    eventName: "CPI (Consumer Price Index)",
    description: "Month-over-month change in consumer prices",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 13, 30).toISOString(),
    consensus: "0.2%",
    previous: "0.3%",
    importance: "high",
  },
  {
    id: "m2",
    country: "United States",
    countryCode: "US",
    eventName: "Non-Farm Payrolls",
    description: "Change in number of employed people (excluding farm workers)",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 13, 30).toISOString(),
    consensus: "180K",
    previous: "175K",
    importance: "high",
  },
  {
    id: "m3",
    country: "United States",
    countryCode: "US",
    eventName: "FOMC Rate Decision",
    description: "Federal Reserve interest rate announcement",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 19, 0).toISOString(),
    consensus: "4.50%",
    previous: "4.75%",
    importance: "high",
  },
  {
    id: "m4",
    country: "European Union",
    countryCode: "EU",
    eventName: "ECB Interest Rate Decision",
    description: "European Central Bank main refinancing rate",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 12, 45).toISOString(),
    consensus: "3.75%",
    previous: "4.00%",
    importance: "high",
  },
  {
    id: "m5",
    country: "United States",
    countryCode: "US",
    eventName: "PCE Price Index",
    description: "Personal Consumption Expenditures - Fed's preferred inflation measure",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 30).toISOString(),
    consensus: "2.5%",
    previous: "2.6%",
    importance: "high",
  },
  {
    id: "m6",
    country: "China",
    countryCode: "CN",
    eventName: "Manufacturing PMI",
    description: "Purchasing Managers' Index for manufacturing sector",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 1, 30).toISOString(),
    consensus: "50.5",
    previous: "49.8",
    importance: "medium",
  },
  {
    id: "m7",
    country: "Japan",
    countryCode: "JP",
    eventName: "BOJ Interest Rate Decision",
    description: "Bank of Japan policy rate announcement",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 3, 0).toISOString(),
    consensus: "0.25%",
    previous: "0.25%",
    importance: "high",
  },
  {
    id: "m8",
    country: "United Kingdom",
    countryCode: "GB",
    eventName: "GDP Growth Rate",
    description: "Quarterly gross domestic product growth",
    dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 7, 0).toISOString(),
    consensus: "0.3%",
    previous: "0.2%",
    importance: "medium",
  },
];

// Generate mock corporate events
export const MOCK_CORPORATE_EVENTS: CorporateEvent[] = [
  {
    id: "c1",
    ticker: "AAPL",
    company: "Apple Inc.",
    eventName: "WWDC 2025",
    description: "Apple's annual Worldwide Developers Conference featuring iOS 19, macOS 16, and new AI features",
    date: getDateString(5),
    logoUrl: getLogoUrl("AAPL"),
  },
  {
    id: "c2",
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    eventName: "GTC 2025",
    description: "GPU Technology Conference showcasing next-gen AI hardware and software innovations",
    date: getDateString(8),
    logoUrl: getLogoUrl("NVDA"),
  },
  {
    id: "c3",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    eventName: "Google I/O 2025",
    description: "Annual developer conference featuring Android 16, Gemini updates, and cloud innovations",
    date: getDateString(10),
    logoUrl: getLogoUrl("GOOGL"),
  },
  {
    id: "c4",
    ticker: "MSFT",
    company: "Microsoft Corp.",
    eventName: "Microsoft Build 2025",
    description: "Developer conference highlighting Azure AI, Copilot, and Windows platform updates",
    date: getDateString(12),
    logoUrl: getLogoUrl("MSFT"),
  },
  {
    id: "c5",
    ticker: "META",
    company: "Meta Platforms",
    eventName: "Meta Connect 2025",
    description: "VR/AR focused event with Quest 4 announcement and metaverse platform updates",
    date: getDateString(15),
    logoUrl: getLogoUrl("META"),
  },
  {
    id: "c6",
    ticker: "TSLA",
    company: "Tesla Inc.",
    eventName: "Tesla AI Day 2025",
    description: "Showcase of FSD progress, Optimus robot updates, and Dojo supercomputer advances",
    date: getDateString(20),
    logoUrl: getLogoUrl("TSLA"),
  },
  {
    id: "c7",
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    eventName: "AWS re:Invent 2025",
    description: "Cloud computing conference with new service announcements and AI/ML updates",
    date: getDateString(25),
    logoUrl: getLogoUrl("AMZN"),
  },
];

// Helper functions for formatting
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatLocalTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

export const formatRevenue = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

export const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    EU: "🇪🇺",
    GB: "🇬🇧",
    JP: "🇯🇵",
    CN: "🇨🇳",
    DE: "🇩🇪",
    FR: "🇫🇷",
    CA: "🇨🇦",
    AU: "🇦🇺",
  };
  return flags[countryCode] || "🌐";
};
