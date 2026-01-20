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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Forecast Log</h1>
          <p className="text-slate-400 mt-1">Track your product predictions</p>
        </div>
        <button onClick={onNewForecast} className="btn btn-primary">
          + New Forecast
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {option.label}
            <span className="ml-1.5 text-xs opacity-75">({counts[option.value]})</span>
          </button>
        ))}
      </div>

      {filteredForecasts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-slate-500 mb-4">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            {filter === 'all' ? 'No forecasts yet' : `No ${filter} forecasts`}
          </h3>
          <p className="text-slate-400 mb-4">
            {filter === 'all'
              ? 'Create your first forecast to start tracking your judgment.'
              : `You don't have any ${filter} forecasts.`}
          </p>
          {filter === 'all' && (
            <button onClick={onNewForecast} className="btn btn-primary">
              Create First Forecast
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
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
