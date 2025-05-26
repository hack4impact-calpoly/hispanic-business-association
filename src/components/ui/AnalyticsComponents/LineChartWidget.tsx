"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Props = {
  title: string;
  data: { year: string; total: number }[];
};

export function LineChartWidget({ title, data }: Props) {
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-0 mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(val: number) => `${val} businesses`} />
          <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
