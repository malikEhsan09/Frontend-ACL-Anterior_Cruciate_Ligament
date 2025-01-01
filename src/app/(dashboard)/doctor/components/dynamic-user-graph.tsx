"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const processPlayerData = (players) => {
  const playerCounts = {};
  players.forEach((player) => {
    const date = new Date(player.createdAt).toISOString().split("T")[0];
    playerCounts[date] = (playerCounts[date] || 0) + 1;
  });

  return Object.entries(playerCounts)
    .map(([date, count]) => ({
      date,
      players: count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const DynamicPlayerGraph = ({ players }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(processPlayerData(players));
  }, [players]);

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl text-gray-800">
          Player Registrations Over Time
        </CardTitle>
        <CardDescription className="text-gray-600">
          Daily breakdown of new player registrations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(143, 100%, 30%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(143, 100%, 30%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#888888"
                axisLine={false}
                tickLine={false}
              />
              <YAxis stroke="#888888" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="players"
                stroke="hsl(143, 100%, 30%)"
                fillOpacity={1}
                fill="url(#colorPlayers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded shadow-md">
        <p className="text-gray-800 font-semibold">{`${label} : ${payload[0].value} players`}</p>
      </div>
    );
  }
  return null;
};

export default DynamicPlayerGraph;
