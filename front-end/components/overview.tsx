"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    Engineering: 420000,
    Marketing: 240000,
    Finance: 180000,
    HR: 120000,
    Sales: 320000,
  },
  {
    name: "Feb",
    Engineering: 425000,
    Marketing: 245000,
    Finance: 182000,
    HR: 121000,
    Sales: 325000,
  },
  {
    name: "Mar",
    Engineering: 430000,
    Marketing: 250000,
    Finance: 185000,
    HR: 122000,
    Sales: 330000,
  },
  {
    name: "Apr",
    Engineering: 435000,
    Marketing: 255000,
    Finance: 187000,
    HR: 123000,
    Sales: 335000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Engineering" fill="#8884d8" />
        <Bar dataKey="Marketing" fill="#82ca9d" />
        <Bar dataKey="Finance" fill="#ffc658" />
        <Bar dataKey="HR" fill="#ff8042" />
        <Bar dataKey="Sales" fill="#0088fe" />
      </BarChart>
    </ResponsiveContainer>
  )
}

