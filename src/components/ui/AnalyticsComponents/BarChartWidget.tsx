"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

type BarChartWidgetProps = {
  title: string;
  data: { name: string; value: number }[];
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a28efc",
  "#f9b872",
  "#85d0f0",
  "#fc728f",
  "#b2df8a",
];

export function BarChartWidget({ title, data }: BarChartWidgetProps) {
  // Estimate Y-axis width based on longest label
  const longestLabel = data.reduce((a, b) => (a.name.length > b.name.length ? a : b), { name: "" });
  const estimatedYAxisWidth = Math.min(Math.max(longestLabel.name.length * 8.5, 60), 160);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(data.length * 60, 240)}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" interval={0} tick={{ fontSize: 14 }} width={estimatedYAxisWidth} />
          <Tooltip formatter={(val: number) => `${val} businesses`} />
          <Bar dataKey="value" radius={[4, 4, 4, 4]}>
            {data.map((_, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
