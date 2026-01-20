// User Profile
export interface UserProfile {
  id: string;
  fullName: string;
  company: string;
  email: string;
  createdAt: string;
}

// Bet Types
export type BetType = 'New Product' | 'Feature' | 'Iteration' | 'Experiment';

// Success Metrics
export type SuccessMetric =
  | 'Growth'
  | 'Monetisation'
  | 'Retention'
  | 'Activation'
  | 'Conversion'
  | 'Engagement'
  | 'Revenue'
  | 'NPS'
  | 'Satisfaction';

// Novelty Types
export type Novelty = 'New Behavior' | 'New Persona' | 'Known Problem';

// Outcome Levels with their scores
export type OutcomeLevel =
  | 'Hit Target'      // 1.0 - ≥100% of target
  | 'Met Target'      // 0.8 - 80-99%
  | 'Strong Result'   // 0.6 - 60-79%
  | 'Mixed Result'    // 0.4 - 40-59%
  | 'Weak Result'     // 0.2 - 20-39%
  | 'Failed';         // 0.0 - <20%

// Outcome score mapping
export const OUTCOME_SCORES: Record<OutcomeLevel, number> = {
  'Hit Target': 1.0,
  'Met Target': 0.8,
  'Strong Result': 0.6,
  'Mixed Result': 0.4,
  'Weak Result': 0.2,
  'Failed': 0.0,
};

// Outcome descriptions for UI
export const OUTCOME_DESCRIPTIONS: Record<OutcomeLevel, string> = {
  'Hit Target': '≥100% of target achieved',
  'Met Target': '80-99% of target achieved',
  'Strong Result': '60-79% of target achieved',
  'Mixed Result': '40-59% of target achieved',
  'Weak Result': '20-39% of target achieved',
  'Failed': '<20% of target achieved',
};

// Forecast status
export type ForecastStatus = 'open' | 'closed';

// Main Forecast interface
export interface Forecast {
  id: string;
  dateCreated: string;
  status: ForecastStatus;
  betType: BetType;
  prediction: string;
  successMetric: SuccessMetric;
  targetThreshold: string;
  byWhen: string;
  probability: number; // 0-100
  confidenceBucket: string; // Derived: "70-80%"
  novelty: Novelty;
  weight: number; // Calculated: betTypeWeight × noveltyWeight

  // Optional supporting context
  risks?: string;       // Key risks that could cause prediction to fail
  evidence?: string;    // Supporting data/reasoning for prediction
  imageData?: string;   // Base64 data URL (compressed)
  imageName?: string;   // Original filename

  // Filled when closing
  actualOutcome?: OutcomeLevel;
  outcomeScore?: number; // 0.0 - 1.0
  brierScore?: number;
  weightedBrier?: number;
  learningNote?: string;
  closedAt?: string;
}

// Weight Settings
export interface WeightSettings {
  betType: Record<BetType, number>;
  novelty: Record<Novelty, number>;
}

// Default weight settings
export const DEFAULT_WEIGHT_SETTINGS: WeightSettings = {
  betType: {
    'New Product': 3.0,
    'Feature': 1.5,
    'Iteration': 1.0,
    'Experiment': 1.0,
  },
  novelty: {
    'New Behavior': 1.5,
    'New Persona': 1.3,
    'Known Problem': 1.0,
  },
};

// Brier Score interpretation bands
export type BrierLevel =
  | 'Elite Judgment'
  | 'Strong Calibration'
  | 'Typical PM'
  | 'Overconfident'
  | 'Uncalibrated';

export const BRIER_LEVEL_THRESHOLDS: { max: number; level: BrierLevel }[] = [
  { max: 0.10, level: 'Elite Judgment' },
  { max: 0.15, level: 'Strong Calibration' },
  { max: 0.25, level: 'Typical PM' },
  { max: 0.40, level: 'Overconfident' },
  { max: Infinity, level: 'Uncalibrated' },
];

// Calibration bucket for analytics
export interface CalibrationBucket {
  bucket: string; // e.g., "70-80%"
  forecastCount: number;
  avgPredictedProbability: number;
  avgActualOutcome: number;
}

// App state for localStorage
export interface AppState {
  userProfile: UserProfile | null;
  forecasts: Forecast[];
  weightSettings: WeightSettings;
}

// Filter options for forecast list
export type ForecastFilter = 'all' | 'open' | 'closed';

// Form data for creating a new forecast
export interface NewForecastData {
  betType: BetType;
  prediction: string;
  successMetric: SuccessMetric;
  targetThreshold: string;
  byWhen: string;
  probability: number;
  novelty: Novelty;
  risks?: string;
  evidence?: string;
  imageData?: string;
  imageName?: string;
}

// Form data for closing a forecast
export interface CloseForecastData {
  actualOutcome: OutcomeLevel;
  learningNote: string;
}
