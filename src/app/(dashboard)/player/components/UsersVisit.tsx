"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
// import { getAuthToken } from "@/utils/auth";

// Mock data service to simulate API response
const fetchMockUserVisits = (): Promise<{ date: string; visits: number }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = [
        { date: "2024-09-20", visits: Math.floor(Math.random() * 30) },
        { date: "2024-09-21", visits: Math.floor(Math.random() * 10) },
        { date: "2024-09-22", visits: Math.floor(Math.random() * 20) },
        { date: "2024-09-23", visits: Math.floor(Math.random() * 20) },
        { date: "2024-09-24", visits: Math.floor(Math.random() * 10) },
        { date: "2024-09-25", visits: Math.floor(Math.random() * 10) },
      ];
      resolve(mockData);
    }, 1000);
  });
};

export default function UserVisits() {
  const [userVisitsData, setUserVisitsData] = useState<
    { date: string; visits: number }[]
  >([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserVisits = async () => {
      try {
        const data = await fetchMockUserVisits();
        setUserVisitsData(data);
        const total = data.reduce((sum, entry) => sum + entry.visits, 0);
        setTotalVisits(total);
      } catch (err) {
        setError("Failed to fetch user visits data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserVisits();
  }, []);

  if (loading)
    return (
      <Card className="w-full h-[200px] flex items-center justify-center">
        Loading...
      </Card>
    );
  if (error)
    return (
      <Card className="w-full h-[200px] flex items-center justify-center text-red-500">
        Error: {error}
      </Card>
    );

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">User Visits</CardTitle>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Eye className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalVisits}</div>
        <p className="text-xs text-muted-foreground">
          +{userVisitsData[userVisitsData.length - 1]?.visits || 0} from
          yesterday
        </p>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userVisitsData}>
              <Bar dataKey="visits" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
