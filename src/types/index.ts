export interface MetricCard {
  id: string;
  title: string;
  value: string;
  unit: string;
  growth: string;
  growthType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartPanel {
  id: string;
  title: string;
  type: 'line' | 'bar';
  data: ChartDataPoint[];
}

export type PanelType = 'metric' | 'chart';

export interface Panel {
  id: string;
  type: PanelType;
  data: MetricCard | ChartPanel;
}
