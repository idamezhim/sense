import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface CalibrationDataPoint {
  name: string;
  predicted: number;
  actual: number;
  count: number;
}

interface CalibrationCurveProps {
  data: CalibrationDataPoint[];
}

export function CalibrationCurve({ data }: CalibrationCurveProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Close some forecasts to see your calibration curve.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          stroke="#475569"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          stroke="#475569"
          label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#94a3b8' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#e2e8f0',
          }}
          formatter={(value: number | undefined, name: string | undefined) => [
            value !== undefined ? `${value}%` : '-',
            name === 'predicted' ? 'Predicted' : 'Actual',
          ]}
          labelFormatter={(label) => `Confidence: ${label}`}
        />
        <Legend wrapperStyle={{ color: '#94a3b8' }} />
        <ReferenceLine
          segment={[{ x: '0-10%', y: 5 }, { x: '90-100%', y: 95 }]}
          stroke="#475569"
          strokeDasharray="5 5"
          label={{ value: 'Perfect Calibration', position: 'top', fontSize: 10, fill: '#64748b' }}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#818cf8"
          strokeWidth={2}
          dot={{ fill: '#818cf8', r: 4 }}
          name="Predicted"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#34d399"
          strokeWidth={2}
          dot={{ fill: '#34d399', r: 4 }}
          name="Actual"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
