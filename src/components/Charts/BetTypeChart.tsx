import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BetType } from '../../types';

interface BetTypeDataPoint {
  betType: BetType;
  avgBrier: number;
  count: number;
}

interface BetTypeChartProps {
  data: BetTypeDataPoint[];
}

const COLORS: Record<BetType, string> = {
  'New Product': '#4f46e5',
  'Feature': '#0ea5e9',
  'Iteration': '#64748b',
  'Experiment': '#14b8a6',
};

export function BetTypeChart({ data }: BetTypeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Close some forecasts to see performance by bet type.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    name: d.betType,
    avgBrier: Number(d.avgBrier.toFixed(4)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          stroke="#475569"
        />
        <YAxis
          domain={[0, 'auto']}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          stroke="#475569"
          label={{ value: 'Avg Brier', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#94a3b8' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#e2e8f0',
          }}
          formatter={(value: number | undefined) => [value !== undefined ? value.toFixed(4) : '-', 'Avg Brier Score']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="avgBrier" radius={[4, 4, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.betType as BetType] || '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
