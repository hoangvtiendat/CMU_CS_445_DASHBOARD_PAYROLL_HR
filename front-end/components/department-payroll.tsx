"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Engineering",
    "Base Salary": 380000,
    Bonuses: 40000,
    Benefits: 60000,
  },
  {
    name: "Marketing",
    "Base Salary": 220000,
    Bonuses: 20000,
    Benefits: 35000,
  },
  {
    name: "Finance",
    "Base Salary": 160000,
    Bonuses: 20000,
    Benefits: 25000,
  },
  {
    name: "HR",
    "Base Salary": 110000,
    Bonuses: 10000,
    Benefits: 18000,
  },
  {
    name: "Sales",
    "Base Salary": 280000,
    Bonuses: 40000,
    Benefits: 45000,
  },
]

export function DepartmentPayroll() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Base Salary" fill="#8884d8" />
        <Bar dataKey="Bonuses" fill="#82ca9d" />
        <Bar dataKey="Benefits" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

