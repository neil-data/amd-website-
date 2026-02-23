'use client';

import { motion } from 'framer-motion';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface RadarDataPoint {
  metric: string;
  score: number;
}

interface SkillRadarChartProps {
  title: string;
  data: RadarDataPoint[];
}

export default function SkillRadarChart({ title, data }: SkillRadarChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
    >
      <h2 className="font-heading text-xl font-semibold text-black">{title}</h2>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#BDBDBD" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#555' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="score" stroke="#0A0A0A" fill="#0A0A0A" fillOpacity={0.2} strokeWidth={2} />
            <Tooltip formatter={(value) => [`${value}`, 'Score']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
