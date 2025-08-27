
export type Suggestion = 'Strong Buy' | 'Moderate Buy' | 'Hold' | 'Moderate Sell' | 'Strong Sell';

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface AnalysisResult {
  ticker: string;
  suggestion: Suggestion;
  confidence: string;
  analysis: string[];
  risks: string[];
  startDate: string;
  endDate: string;
  historicalData: PriceDataPoint[];
}