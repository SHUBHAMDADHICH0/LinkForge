export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  lastAccessedAt?: string;
  userId?: string;
  customAlias?: string;
}

export interface UTMEntry {
  value: string;
  clicks: number;
  percentage: number;
}

export interface LinkAnalytics {
  shortCode: string;
  totalClicks: number;
  dailyClicks: { date: string; clicks: number }[];
  hourlyClicks: { hour: string; clicks: number }[];
  heatmapData: { day: string; hour: number; clicks: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  countryBreakdown: { country: string; count: number; percentage: number }[];
  referrerBreakdown: { referrer: string; count: number; percentage: number }[];
  utmBreakdown: {
    sources: UTMEntry[];
    mediums: UTMEntry[];
    campaigns: UTMEntry[];
  };
}

export interface ShortenRequest {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
