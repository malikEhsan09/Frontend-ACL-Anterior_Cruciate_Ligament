"use client";
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Activity } from 'lucide-react'
import { getAuthToken } from "@/utils/auth"


export default function TotalPlayers() {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<{ index: number; value: number }[]>([])


  // Fetch players data from the API
  useEffect(() => {
    const fetchPlayersData = async () => {
      const authToken = getAuthToken();
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${authToken}`);

      try {
        const response = await fetch("http://localhost:8800/api/player", {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) throw new Error("Failed to fetch players data");

        const playersData = await response.json();
        setTotalPlayers(playersData.length);

        const processedData = playersData.map(
          (_user: { id: number; name: string }, index: number) => ({
            index,
            value: index % 2 === 0 ? 3 + index * 2 : 2 + index * 3,
          })
        ).slice(-6)

        setChartData(processedData)
      } catch (error) {
        console.error("Error:", (error as Error).message);
        if (error instanceof Error) {
          setError(error.message); // Display error to the user
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersData();
  }, []);


  if (loading) return <Card className="w-full h-[200px] flex items-center justify-center">Loading...</Card>
  if (error) return <Card className="w-full h-[200px] flex items-center justify-center text-red-500">Error: {error}</Card>


  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Total Players</CardTitle>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Activity className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalPlayers}</div>
        <p className="text-xs text-muted-foreground">
          +{chartData[chartData.length - 1]?.value || 0} new users
        </p>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

}
