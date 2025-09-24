"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu mẫu
const revenueData = [
  { name: "Tuần 1", DoanhThu: 25000000 },
  { name: "Tuần 2", DoanhThu: 31000000 },
  { name: "Tuần 3", DoanhThu: 28000000 },
  { name: "Tuần 4", DoanhThu: 41600000 },
];

const RevenueChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan doanh thu</CardTitle>
        <CardDescription>Doanh thu 4 tuần gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("vi-VN").format(value) + " VNĐ"
                }
              />
              <Line
                type="monotone"
                dataKey="DoanhThu"
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
