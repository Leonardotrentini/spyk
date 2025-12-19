
export interface LibraryEntry {
  id: string;
  url: string;
  brandName: string;
  activeAdsCount: number;
  landingPageUrl: string;
  niche: string;
  status: 'monitoring' | 'paused' | 'archived';
  notes?: string;
  createdAt: number;
  lastChecked: number;
  isFavorite: boolean;
  boardIds: string[];
  trafficEstimate?: string;
}

export interface NicheOption {
  id: string;
  label: string;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  type: 'system' | 'custom';
}

export interface KanbanTask {
  id: string;
  content: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: number;
}

export enum SortOption {
  NEWEST = 'NEWEST',
  ADS_HIGH_TO_LOW = 'ADS_HIGH_TO_LOW',
  ADS_LOW_TO_HIGH = 'ADS_LOW_TO_HIGH',
  ALPHABETICAL = 'ALPHABETICAL',
}

export interface Stats {
  totalMonitored: number;
  totalAds: number;
  topNiche: string;
}

export interface TrafficStats {
  totalVisits: string;
  bounceRate: string;
  avgDuration: string;
  pagesPerVisit: string;
  history: { date: string; visits: number }[];
}
