"use client";

import { useEffect, useRef } from "react";
import {
  BarChart,
  LineChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
  type?: "line" | "bar" | "area";
}

export function DashboardChart({
  data,
  xKey,
  yKey,
  height = 300,
  color = "#3b82f6",
  type = "line",
}: DashboardChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Qualquer inicialização necessária
  }, []);

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fill={`${color}20`}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={data}>
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "white" }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div ref={chartRef} style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
