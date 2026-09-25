export type ActiveTab = 'overview' | 'ai-builder' | 'copilot' | 'data' | 'reports';

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  subtitle: string;
  badge?: string;
  badgeType?: 'default' | 'success' | 'warning';
  sparklineType?: 'area' | 'line' | 'bar';
}

export interface AiInsight {
  id: string;
  type: 'growth' | 'risk' | 'anomaly';
  title: string;
  tag: string;
  badge: string;
  badgeColor: string;
  description: string;
  supportingMetricLabel: string;
  supportingMetricValue: string;
  actionLabel: string;
  actionTarget: string;
  copilotPrompt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  diagnostic?: {
    confidence: string;
    summary: string;
    factors: {
      title: string;
      description: string;
      icon: string;
      color: string;
    }[];
    chartData?: {
      title: string;
      subtitle: string;
      bars: {
        label: string;
        value: string;
        percentage: number;
        color: string;
      }[];
    };
    nextSteps?: {
      label: string;
      actionPrompt: string;
    }[];
    followUps?: string[];
    generatedTime?: string;
  };
}

export interface DataConnector {
  id: string;
  name: string;
  category: 'databases' | 'warehouses' | 'files' | 'saas';
  tag: string;
  tagColor?: string;
  description: string;
  badgeText: string;
  extraFeature: string;
  icon: string;
  iconBg: string;
  connected?: boolean;
  statusText?: string;
  keywords: string;
}

export interface IngestStream {
  id: string;
  name: string;
  syncTime: string;
  details: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
}
