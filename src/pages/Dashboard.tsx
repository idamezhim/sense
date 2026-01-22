import { Forecast } from '../types';
import { getDashboardStats } from '../utils/analytics';
import { formatBrierScore, getBrierLevel } from '../utils/scoring';
import { CalibrationCurve } from '../components/Charts/CalibrationCurve';
import { BetTypeChart } from '../components/Charts/BetTypeChart';
import { BetTypeBadge } from '../components/ScoreBadge';

interface DashboardProps {
  forecasts: Forecast[];
}

// Light mode color mapping
const getLightBrierLevelColor = (level: string) => {
  switch (level) {
    case 'Elite': return 'bg-emerald-100 text-emerald-700';
    case 'Strong': return 'bg-green-100 text-green-700';
    case 'Good': return 'bg-blue-100 text-blue-700';
    case 'Typical PM': return 'bg-amber-100 text-amber-700';
    case 'Needs Work': return 'bg-red-100 text-red-700';
    default: return 'bg-[#F3F4F6] text-[#707070]';
  }
};

export function Dashboard({ forecasts }: DashboardProps) {
  const stats = getDashboardStats(forecasts);
  const hasClosedForecasts = stats.counts.closed > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#707070] mt-1">Track your prediction accuracy over time</p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card col-span-1 md:col-span-2">
          <div className="text-sm text-[#707070] mb-1">Overall Brier Score</div>
          {stats.overallBrier !== null ? (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-[#1A1A1A]">
                {formatBrierScore(stats.overallBrier)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getLightBrierLevelColor(
                  getBrierLevel(stats.overallBrier)
                )}`}
              >
                {getBrierLevel(stats.overallBrier)}
              </span>
            </div>
          ) : (
            <div className="text-2xl text-[#9CA3AF]">—</div>
          )}
          <p className="text-xs text-[#9CA3AF] mt-2">
            Lower is better. &lt;0.10 = Elite, 0.10-0.15 = Strong, 0.15-0.25 = Typical PM
          </p>
        </div>

        <div className="card">
          <div className="text-sm text-[#707070] mb-1">Total Forecasts</div>
          <div className="text-3xl font-bold text-[#1A1A1A]">{stats.counts.total}</div>
        </div>

        <div className="card">
          <div className="flex justify-between mb-1">
            <div className="text-sm text-[#707070]">Open</div>
            <div className="text-sm text-[#707070]">Closed</div>
          </div>
          <div className="flex justify-between">
            <div className="text-2xl font-semibold text-blue-600">{stats.counts.open}</div>
            <div className="text-2xl font-semibold text-[#374151]">{stats.counts.closed}</div>
          </div>
        </div>
      </div>

      {/* Calibration Table */}
      {hasClosedForecasts && stats.calibrationData.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Calibration by Confidence Bucket</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left py-2 px-3 text-sm font-medium text-[#707070]">Bucket</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-[#707070]">Forecasts</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-[#707070]">Avg Predicted</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-[#707070]">Avg Actual</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-[#707070]">Difference</th>
                </tr>
              </thead>
              <tbody>
                {stats.calibrationData.map((bucket) => {
                  const diff = bucket.avgActualOutcome - bucket.avgPredictedProbability;
                  return (
                    <tr key={bucket.bucket} className="border-b border-[#F3F4F6]">
                      <td className="py-2 px-3 text-sm font-medium text-[#1A1A1A]">{bucket.bucket}</td>
                      <td className="py-2 px-3 text-sm text-right text-[#374151]">{bucket.forecastCount}</td>
                      <td className="py-2 px-3 text-sm text-right text-[#374151]">
                        {bucket.avgPredictedProbability.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-sm text-right text-[#374151]">
                        {bucket.avgActualOutcome.toFixed(1)}%
                      </td>
                      <td className={`py-2 px-3 text-sm text-right font-medium ${
                        Math.abs(diff) < 5 ? 'text-green-600' : Math.abs(diff) < 15 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Calibration Curve</h2>
          <CalibrationCurve data={stats.calibrationCurveData} />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Performance by Bet Type</h2>
          <BetTypeChart data={stats.betTypeData} />
        </div>
      </div>

      {/* Bet Type Breakdown */}
      {hasClosedForecasts && stats.betTypeData.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Bet Type Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.betTypeData.map((item) => (
              <div key={item.betType} className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                <BetTypeBadge betType={item.betType} />
                <div className="mt-2">
                  <div className="text-2xl font-semibold text-[#1A1A1A]">
                    {formatBrierScore(item.avgBrier)}
                  </div>
                  <div className="text-xs text-[#707070]">{item.count} forecasts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best and Worst Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.bestPredictions.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Best Predictions</h2>
            <div className="space-y-3">
              {stats.bestPredictions.map((forecast) => (
                <div key={forecast.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-[#9CA3AF]">{forecast.id}</span>
                    <span className="text-sm font-mono font-medium text-emerald-600">
                      {formatBrierScore(forecast.brierScore!)}
                    </span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] line-clamp-2">{forecast.prediction}</p>
                  <div className="text-xs text-[#707070] mt-1">
                    {forecast.probability}% → {forecast.actualOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.worstPredictions.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Worst Predictions</h2>
            <div className="space-y-3">
              {stats.worstPredictions.map((forecast) => (
                <div key={forecast.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-[#9CA3AF]">{forecast.id}</span>
                    <span className="text-sm font-mono font-medium text-red-500">
                      {formatBrierScore(forecast.brierScore!)}
                    </span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] line-clamp-2">{forecast.prediction}</p>
                  <div className="text-xs text-[#707070] mt-1">
                    {forecast.probability}% → {forecast.actualOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!hasClosedForecasts && (
        <div className="card text-center py-12">
          <div className="text-[#9CA3AF] mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">No data yet</h3>
          <p className="text-[#707070]">
            Close some forecasts to see your calibration metrics.
          </p>
        </div>
      )}
    </div>
  );
}
