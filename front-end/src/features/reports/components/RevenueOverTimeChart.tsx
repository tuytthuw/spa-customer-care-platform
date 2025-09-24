// src/features/reports/components/RevenueOverTimeChart.tsx
"use client";

import { Invoice } from "@/features/billing/types";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RevenueChartProps {
  data: Invoice[];
}

export default function RevenueOverTimeChart({ data }: RevenueChartProps) {
  // Nhóm doanh thu theo ngày
  const dailyRevenue = data.reduce((acc, invoice) => {
    const date = format(parseISO(invoice.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += invoice.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(dailyRevenue)
    .map((date) => ({
      name: format(parseISO(date), "dd/MM", { locale: vi }),
      total: dailyRevenue[date],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
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
          tickFormatter={(value) =>
            `${new Intl.NumberFormat("vi-VN").format(value as number)}`
          }
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Doanh thu
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(payload[0].value as number)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
