import {
  BetType,
  Novelty,
  OutcomeLevel,
  WeightSettings,
  OUTCOME_SCORES,
  BRIER_LEVEL_THRESHOLDS,
  BrierLevel,
  Forecast,
} from '../types';

/**
 * Calculate the weight for a forecast based on bet type and novelty
 */
export function calculateWeight(
  betType: BetType,
  novelty: Novelty,
  settings: WeightSettings
): number {
  return settings.betType[betType] * settings.novelty[novelty];
}

/**
 * Get the confidence bucket string from a probability (0-100)
 * e.g., 75 -> "70-80%"
 */
export function getConfidenceBucket(probability: number): string {
  const lower = Math.floor(probability / 10) * 10;
  const upper = lower + 10;
  return `${lower}-${upper}%`;
}

/**
 * Calculate Brier score from probability and outcome
 * Brier Score = (probability/100 - outcomeScore)²
 */
export function calculateBrierScore(
  probability: number,
  outcomeLevel: OutcomeLevel
): number {
  const probabilityDecimal = probability / 100;
  const outcomeScore = OUTCOME_SCORES[outcomeLevel];
  return Math.pow(probabilityDecimal - outcomeScore, 2);
}

/**
 * Calculate weighted Brier score
 */
export function calculateWeightedBrier(brierScore: number, weight: number): number {
  return brierScore * weight;
}

/**
 * Calculate overall Brier score from multiple forecasts
 * Overall = Σ(Weighted Brier) ÷ Σ(Weights)
 */
export function calculateOverallBrierScore(forecasts: Forecast[]): number | null {
  const closedForecasts = forecasts.filter(
    (f) => f.status === 'closed' && f.weightedBrier !== undefined && f.weight !== undefined
  );

  if (closedForecasts.length === 0) {
    return null;
  }

  const totalWeightedBrier = closedForecasts.reduce(
    (sum, f) => sum + (f.weightedBrier ?? 0),
    0
  );
  const totalWeight = closedForecasts.reduce((sum, f) => sum + f.weight, 0);

  return totalWeight > 0 ? totalWeightedBrier / totalWeight : null;
}

/**
 * Get the interpretation level for a Brier score
 */
export function getBrierLevel(brierScore: number): BrierLevel {
  for (const threshold of BRIER_LEVEL_THRESHOLDS) {
    if (brierScore < threshold.max) {
      return threshold.level;
    }
  }
  return 'Uncalibrated';
}

/**
 * Get the color class for a Brier level
 */
export function getBrierLevelColor(level: BrierLevel): string {
  switch (level) {
    case 'Elite Judgment':
      return 'text-emerald-300 bg-emerald-900/50 border border-emerald-700';
    case 'Strong Calibration':
      return 'text-green-300 bg-green-900/50 border border-green-700';
    case 'Typical PM':
      return 'text-blue-300 bg-blue-900/50 border border-blue-700';
    case 'Overconfident':
      return 'text-amber-300 bg-amber-900/50 border border-amber-700';
    case 'Uncalibrated':
      return 'text-red-300 bg-red-900/50 border border-red-700';
  }
}

/**
 * Format a Brier score for display (4 decimal places)
 */
export function formatBrierScore(score: number): string {
  return score.toFixed(4);
}

/**
 * Get the outcome score for an outcome level
 */
export function getOutcomeScore(outcomeLevel: OutcomeLevel): number {
  return OUTCOME_SCORES[outcomeLevel];
}
