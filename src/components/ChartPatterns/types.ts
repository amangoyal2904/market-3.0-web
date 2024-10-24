export interface Pattern {
  companyId: string;
  companySeoName: string;
  companyName: string;
  patternName?: string;
  patternFormedDate?: string; // Allowing undefined here
  breakoutPrice: any;
  marketCap: any;
  stockReturn: number;
  returnTimeframe: number;
  industryName?: string;
}

export interface PatternData {
  subPatternFlag?: boolean;
  headingText?: string;
  positiveCount?: number;
  negativeCount?: number;
  successRate?: number;
  averageReturn?: number;
  holdingPeriod?: string;
  patternType?: string;
  totalCount?: number;
  companyName?: string;
  pastPatternList: Pattern[];
}

export interface PastPatternCardProps {
  patternData: PatternData;
  timeFrame?: string; // Made optional
  showCta?: boolean;
}
