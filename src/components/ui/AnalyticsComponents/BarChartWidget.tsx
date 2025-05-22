"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-0 mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[500px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={Math.max(data.length * 60, 240)}>
            <BarChart layout="vertical" data={data}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={150} interval={0} tick={{ fontSize: 14 }} />
              <Tooltip formatter={(val: number) => `${val} businesses`} />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {data.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
