import { Forecast } from '../types';
import { formatBrierScore } from '../utils/scoring';

interface ForecastCardProps {
  forecast: Forecast;
  onClick: () => void;
}

export function ForecastCard({ forecast, onClick }: ForecastCardProps) {
  const dueDate = new Date(forecast.byWhen);
  const createdDate = new Date(forecast.dateCreated);
  const isOverdue = forecast.status === 'open' && dueDate < new Date();
  const isOpen = forecast.status === 'open';

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-sm hover:shadow-md border border-[#E8E8E8]"
    >
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Status row */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-amber-400' : 'bg-[#9CA3AF]'}`} />
              <span className="text-xs text-[#707070] uppercase tracking-wide">
                {forecast.betType}
              </span>
            </div>

            {/* Prediction text */}
            <h3 className="font-medium text-[#1A1A1A] leading-snug line-clamp-2">
              {forecast.prediction}
            </h3>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#707070]">
              <span className="px-2 py-0.5 rounded bg-[#F3F4F6]">
                {forecast.successMetric}
              </span>
              <span className={`${isOverdue ? 'text-red-500' : ''}`}>
                Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Probability */}
          <div className="text-right shrink-0 pl-2">
            <div className={`text-xl sm:text-2xl font-semibold tabular-nums ${isOpen ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'}`}>
              {forecast.probability}%
            </div>
            {forecast.status === 'closed' && forecast.brierScore !== undefined && (
              <div className="text-xs text-[#707070] mt-1">
                {formatBrierScore(forecast.brierScore)}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row - only show on hover for open, always show outcome for closed */}
        <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">
            {createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          {forecast.status === 'closed' ? (
            <span className="text-xs text-[#707070]">{forecast.actualOutcome}</span>
          ) : (
            <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Close →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
