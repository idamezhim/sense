import { Forecast } from '../types';
import { StatusBadge, BetTypeBadge } from './ScoreBadge';
import { formatBrierScore } from '../utils/scoring';

interface ForecastCardProps {
  forecast: Forecast;
  onClick: () => void;
}

export function ForecastCard({ forecast, onClick }: ForecastCardProps) {
  const dueDate = new Date(forecast.byWhen);
  const isOverdue = forecast.status === 'open' && dueDate < new Date();

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:bg-slate-750 hover:border-slate-600 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-slate-500">{forecast.id}</span>
            <StatusBadge status={forecast.status} />
            <BetTypeBadge betType={forecast.betType} />
          </div>

          <h3 className="font-medium text-white truncate mb-1">
            {forecast.prediction}
          </h3>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>
              Target: <span className="text-slate-300">{forecast.targetThreshold}</span>
            </span>
            <span>
              Metric: <span className="text-slate-300">{forecast.successMetric}</span>
            </span>
          </div>

          {/* Indicators for evidence, risks, and image */}
          {(forecast.evidence || forecast.risks || forecast.imageData) && (
            <div className="flex items-center gap-2 mt-2">
              {forecast.evidence && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-900/40 text-emerald-400 text-xs rounded"
                  title="Has supporting evidence"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Evidence
                </span>
              )}
              {forecast.risks && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-900/40 text-amber-400 text-xs rounded"
                  title="Has identified risks"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risks
                </span>
              )}
              {forecast.imageData && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-900/40 text-blue-400 text-xs rounded"
                  title="Has attached image"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-semibold text-indigo-400">
            {forecast.probability}%
          </div>
          <div className="text-xs text-slate-500">{forecast.confidenceBucket}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="text-sm">
          <span className={`${isOverdue ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
            Due: {dueDate.toLocaleDateString()}
          </span>
          {isOverdue && (
            <span className="ml-2 text-xs text-red-400">(Overdue)</span>
          )}
        </div>

        {forecast.status === 'closed' && forecast.brierScore !== undefined && (
          <div className="text-sm">
            <span className="text-slate-400">Brier: </span>
            <span className="font-mono font-medium text-white">
              {formatBrierScore(forecast.brierScore)}
            </span>
            {forecast.actualOutcome && (
              <span className="ml-2 text-slate-400">({forecast.actualOutcome})</span>
            )}
          </div>
        )}

        {forecast.status === 'open' && (
          <span className="text-sm text-indigo-400 font-medium">
            Click to close →
          </span>
        )}
      </div>
    </div>
  );
}
