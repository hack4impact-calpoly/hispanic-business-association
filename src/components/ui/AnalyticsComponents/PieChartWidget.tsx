"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

type PieChartWidgetProps = {
  title: string;
  data: { name: string; value: number }[];
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export function PieChartWidget({ title, data }: PieChartWidgetProps) {
  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="40%" outerRadius={100} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} businesses`} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
