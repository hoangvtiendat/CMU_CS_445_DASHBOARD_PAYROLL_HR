"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Engineering", value: 420, color: "#8884d8" },
  { name: "Marketing", value: 240, color: "#82ca9d" },
  { name: "Finance", value: 180, color: "#ffc658" },
  { name: "HR", value: 120, color: "#ff8042" },
  { name: "Sales", value: 320, color: "#0088fe" },
]

export function DepartmentDistribution() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

