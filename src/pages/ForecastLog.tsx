import { useState } from 'react';
import { Forecast, ForecastFilter } from '../types';
import { ForecastCard } from '../components/ForecastCard';

interface ForecastLogProps {
  forecasts: Forecast[];
  onNewForecast: () => void;
  onSelectForecast: (forecast: Forecast) => void;
}

const filterOptions: { value: ForecastFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

export function ForecastLog({
  forecasts,
  onNewForecast,
  onSelectForecast,
}: ForecastLogProps) {
  const [filter, setFilter] = useState<ForecastFilter>('all');

  const filteredForecasts = forecasts.filter((f) => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  const counts = {
    all: forecasts.length,
    open: forecasts.filter((f) => f.status === 'open').length,
    closed: forecasts.filter((f) => f.status === 'closed').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight">Forecasts</h1>
          <button
            onClick={onNewForecast}
            className="bg-[#1A1A1A] hover:bg-[#333] text-white px-4 py-2 rounded-full font-medium transition-colors text-sm flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            <span className="hidden sm:inline">New Forecast</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
        <p className="text-[#707070] mt-1 text-sm">Track and close your predictions</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#F3F4F6] rounded-lg p-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-[#707070] hover:text-[#1A1A1A]'
            }`}
          >
            {option.label}
            <span className="ml-1.5 text-[#9CA3AF]">
              {counts[option.value]}
            </span>
          </button>
        ))}
      </div>

      {filteredForecasts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
            {filter === 'all' ? 'No forecasts yet' : `No ${filter} forecasts`}
          </h3>
          <p className="text-[#707070] mb-6 max-w-sm mx-auto">
            {filter === 'all'
              ? 'Start tracking your product intuition by creating your first forecast.'
              : `You don't have any ${filter} forecasts yet.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={onNewForecast}
              className="bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Create your first forecast
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredForecasts.map((forecast) => (
            <ForecastCard
              key={forecast.id}
              forecast={forecast}
              onClick={() => onSelectForecast(forecast)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
