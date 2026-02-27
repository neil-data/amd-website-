'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface TrendPoint {
  label: string;
  score: number;
  aiProbability: number;
}

interface TrendChartProps {
  data: TrendPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="label" stroke="#a1a1aa" tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              borderColor: '#27272a',
              borderRadius: '12px',
              color: '#fafafa',
            }}
          />
          <Line type="monotone" dataKey="score" stroke="#fafafa" strokeWidth={2} dot={false} name="Score" />
          <Line type="monotone" dataKey="aiProbability" stroke="#a1a1aa" strokeWidth={2} dot={false} name="AI Probability" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
