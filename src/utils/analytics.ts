import { Forecast, BetType, CalibrationBucket } from '../types';
import { calculateOverallBrierScore } from './scoring';

/**
 * Get forecast counts by status
 */
export function getForecastCounts(forecasts: Forecast[]) {
  return {
    total: forecasts.length,
    open: forecasts.filter((f) => f.status === 'open').length,
    closed: forecasts.filter((f) => f.status === 'closed').length,
  };
}

/**
 * Get calibration data by confidence bucket
 */
export function getCalibrationByBucket(forecasts: Forecast[]): CalibrationBucket[] {
  const closedForecasts = forecasts.filter(
    (f) => f.status === 'closed' && f.outcomeScore !== undefined
  );

  // Group by confidence bucket
  const bucketMap = new Map<
    string,
    { probabilities: number[]; outcomes: number[] }
  >();

  closedForecasts.forEach((f) => {
    const bucket = f.confidenceBucket;
    if (!bucketMap.has(bucket)) {
      bucketMap.set(bucket, { probabilities: [], outcomes: [] });
    }
    const data = bucketMap.get(bucket)!;
    data.probabilities.push(f.probability);
    data.outcomes.push(f.outcomeScore!);
  });

  // Calculate averages and sort by bucket
  const buckets: CalibrationBucket[] = [];

  bucketMap.forEach((data, bucket) => {
    const avgPredicted =
      data.probabilities.reduce((a, b) => a + b, 0) / data.probabilities.length;
    const avgOutcome =
      data.outcomes.reduce((a, b) => a + b, 0) / data.outcomes.length;

    buckets.push({
      bucket,
      forecastCount: data.probabilities.length,
      avgPredictedProbability: avgPredicted,
      avgActualOutcome: avgOutcome * 100, // Convert to percentage for comparison
    });
  });

  // Sort by bucket (e.g., "0-10%", "10-20%", etc.)
  buckets.sort((a, b) => {
    const aNum = parseInt(a.bucket.split('-')[0], 10);
    const bNum = parseInt(b.bucket.split('-')[0], 10);
    return aNum - bNum;
  });

  return buckets;
}

/**
 * Get average Brier score by bet type
 */
export function getBrierByBetType(
  forecasts: Forecast[]
): { betType: BetType; avgBrier: number; count: number }[] {
  const closedForecasts = forecasts.filter(
    (f) => f.status === 'closed' && f.brierScore !== undefined
  );

  const betTypeMap = new Map<BetType, number[]>();

  closedForecasts.forEach((f) => {
    if (!betTypeMap.has(f.betType)) {
      betTypeMap.set(f.betType, []);
    }
    betTypeMap.get(f.betType)!.push(f.brierScore!);
  });

  const result: { betType: BetType; avgBrier: number; count: number }[] = [];

  betTypeMap.forEach((scores, betType) => {
    result.push({
      betType,
      avgBrier: scores.reduce((a, b) => a + b, 0) / scores.length,
      count: scores.length,
    });
  });

  // Sort by bet type in a logical order
  const betTypeOrder: BetType[] = ['New Product', 'Feature', 'Iteration', 'Experiment'];
  result.sort(
    (a, b) => betTypeOrder.indexOf(a.betType) - betTypeOrder.indexOf(b.betType)
  );

  return result;
}

/**
 * Get top N best predictions (lowest Brier scores)
 */
export function getBestPredictions(forecasts: Forecast[], n: number = 3): Forecast[] {
  return forecasts
    .filter((f) => f.status === 'closed' && f.brierScore !== undefined)
    .sort((a, b) => (a.brierScore ?? 0) - (b.brierScore ?? 0))
    .slice(0, n);
}

/**
 * Get top N worst predictions (highest Brier scores)
 */
export function getWorstPredictions(forecasts: Forecast[], n: number = 3): Forecast[] {
  return forecasts
    .filter((f) => f.status === 'closed' && f.brierScore !== undefined)
    .sort((a, b) => (b.brierScore ?? 0) - (a.brierScore ?? 0))
    .slice(0, n);
}

/**
 * Get data for calibration curve chart
 */
export function getCalibrationCurveData(forecasts: Forecast[]) {
  const buckets = getCalibrationByBucket(forecasts);

  return buckets.map((b) => ({
    name: b.bucket,
    predicted: Math.round(b.avgPredictedProbability),
    actual: Math.round(b.avgActualOutcome),
    count: b.forecastCount,
  }));
}

/**
 * Get overall Brier score
 */
export function getOverallBrier(forecasts: Forecast[]): number | null {
  return calculateOverallBrierScore(forecasts);
}

/**
 * Get summary statistics for dashboard
 */
export function getDashboardStats(forecasts: Forecast[]) {
  const counts = getForecastCounts(forecasts);
  const overallBrier = getOverallBrier(forecasts);
  const calibrationData = getCalibrationByBucket(forecasts);
  const betTypeData = getBrierByBetType(forecasts);
  const bestPredictions = getBestPredictions(forecasts, 3);
  const worstPredictions = getWorstPredictions(forecasts, 3);
  const calibrationCurveData = getCalibrationCurveData(forecasts);

  return {
    counts,
    overallBrier,
    calibrationData,
    betTypeData,
    bestPredictions,
    worstPredictions,
    calibrationCurveData,
  };
}
