// src/components/SkillChart.js
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function SkillChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="skill" />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
        />
        <Tooltip formatter={(value) => `${Math.round(value * 100)}%`} />
        <Bar dataKey="score" name="Match %" />
      </BarChart>
    </ResponsiveContainer>
  );
}
