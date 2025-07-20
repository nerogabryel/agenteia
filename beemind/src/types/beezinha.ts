export interface Source {
  pageContent: string;
  metadata: Record<string, any>;
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface BeezinhaResponse {
  message: string; // <= 300 chars
  sources?: Source[];
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  suggestions: Suggestion[];
  followUp?: string;
}