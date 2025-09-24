"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Dữ liệu mẫu
const serviceData = [
  { name: "Chăm sóc da", value: 45 },
  { name: "Massage", value: 30 },
  { name: "Triệt lông", value: 25 },
];

// Màu sắc tương ứng với theme
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ServiceBreakdownChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỉ trọng dịch vụ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: number, name) => [`${value}%`, name]}
              />
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                // === SỬA LỖI Ở ĐÂY ===
                label={({ name, percent }) =>
                  // Thêm `(percent ?? 0)` để xử lý trường hợp percent là undefined
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {serviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceBreakdownChart;
