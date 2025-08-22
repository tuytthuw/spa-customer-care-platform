"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "T2", total: Math.floor(Math.random() * 15) + 5 },
  { name: "T3", total: Math.floor(Math.random() * 15) + 5 },
  { name: "T4", total: Math.floor(Math.random() * 15) + 5 },
  { name: "T5", total: Math.floor(Math.random() * 15) + 5 },
  { name: "T6", total: Math.floor(Math.random() * 15) + 5 },
  { name: "T7", total: Math.floor(Math.random() * 15) + 5 },
  { name: "CN", total: Math.floor(Math.random() * 15) + 5 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
