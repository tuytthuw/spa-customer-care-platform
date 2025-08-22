"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

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
  // 1. Tạo state để lưu màu
  const [chartColor1, setChartColor1] = useState("#000");
  const [chartColor2, setChartColor2] = useState("#000");

  // 2. Dùng useEffect để đọc màu từ CSS sau khi component mount
  useEffect(() => {
    // Kiểm tra để chắc chắn code chỉ chạy ở phía client
    if (typeof window !== "undefined") {
      const computedStyle = getComputedStyle(document.documentElement);
      const color1 = computedStyle.getPropertyValue("--chart-1").trim();
      const color2 = computedStyle.getPropertyValue("--chart-2").trim();

      // Chuyển đổi thành màu mà Recharts có thể đọc được
      setChartColor1(`oklch(${color1})`);
      setChartColor2(`oklch(${color2})`);
    }
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần
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
        {/* 3. Thay thế màu cứng bằng state */}
        <Bar dataKey="total" fill={chartColor1} radius={[4, 4, 0, 0]} />
        {/* Nếu có Bar thứ 2, làm tương tự */}
        {/* <Bar dataKey="other" fill={chartColor2} radius={[4, 4, 0, 0]} /> */}{" "}
      </BarChart>
    </ResponsiveContainer>
  );
}
