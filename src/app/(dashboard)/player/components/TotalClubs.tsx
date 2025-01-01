"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Bar, BarChart } from "recharts"
import { motion } from "framer-motion"
import { Users } from 'lucide-react'

export default function TotalClubs() {
  const [totalClubs, setTotalClubs] = useState(0)
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAuthToken = () => {
    return localStorage.getItem("authToken")
  }

  useEffect(() => {
    const fetchClubsData = async () => {
      const authToken = getAuthToken()
      const headers = new Headers()
      headers.append("Authorization", `Bearer ${authToken}`)

      try {
        const response = await fetch("http://localhost:8800/api/club", {
          headers: headers,
        })
        if (!response.ok) throw new Error("Failed to fetch clubs data")
        const clubsData = await response.json()

        setTotalClubs(clubsData.length)
        
        // Generate chart data based on club creation dates
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date()
          d.setMonth(d.getMonth() - i)
          return d.toISOString().slice(0, 7) // YYYY-MM format
        }).reverse()

        const monthlyData = last6Months.map((month, index) => ({
          name: new Date(month).toLocaleString('default', { month: 'short' }),
          value: clubsData.filter((club: { createdAt: string }) => 
            club.createdAt.startsWith(month)
          ).length,
        }))

        setChartData(monthlyData)
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchClubsData()
  }, [])

  if (loading) return <Card className="w-full h-[200px] flex items-center justify-center">Loading...</Card>
  if (error) return <Card className="w-full h-[200px] flex items-center justify-center text-red-500">Error: {error}</Card>

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Total Clubs Registered</CardTitle>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Users className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalClubs}</div>
        <p className="text-xs text-muted-foreground">
          +{chartData[chartData.length - 1]?.value || 0} from last month
        </p>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                hide={true}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

