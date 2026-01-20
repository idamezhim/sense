import { getBrierLevel, getBrierLevelColor } from '../utils/scoring';

interface ScoreBadgeProps {
  brierScore: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ brierScore, size = 'md' }: ScoreBadgeProps) {
  const level = getBrierLevel(brierScore);
  const colorClass = getBrierLevelColor(level);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses[size]}`}>
      {level}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'open' | 'closed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass =
    status === 'open'
      ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
      : 'bg-slate-700 text-slate-300 border border-slate-600';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {status === 'open' ? 'Open' : 'Closed'}
    </span>
  );
}

interface BetTypeBadgeProps {
  betType: string;
}

export function BetTypeBadge({ betType }: BetTypeBadgeProps) {
  const colorMap: Record<string, string> = {
    'New Product': 'bg-indigo-900/50 text-indigo-300 border border-indigo-700',
    'Feature': 'bg-sky-900/50 text-sky-300 border border-sky-700',
    'Iteration': 'bg-slate-700 text-slate-300 border border-slate-600',
    'Experiment': 'bg-teal-900/50 text-teal-300 border border-teal-700',
  };

  const colorClass = colorMap[betType] || 'bg-slate-700 text-slate-300 border border-slate-600';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {betType}
    </span>
  );
}
