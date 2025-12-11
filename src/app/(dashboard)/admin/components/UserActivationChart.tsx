"use client";
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#A0C2ED", // Light blue background
          padding: "10px",
          borderRadius: "8px", // Rounded borders
          color: "#000",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
        }}
      >
        <p style={{ fontWeight: "bold" }}>{payload[0].name}</p>
        <p>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

const UserActivationChart = () => {
  const [data, setData] = useState<ChartDataItem[]>([]); // State to store the data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch data for players, doctors, and admins
  const fetchData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    try {
      // Fetch players
      const playersResponse = await fetch("http://localhost:8800/api/player", {
        headers: headers,
      });
      if (!playersResponse.ok) throw new Error("Failed to fetch players data");
      const playersData = await playersResponse.json();

      // Fetch doctors
      const doctorsResponse = await fetch("http://localhost:8800/api/doctor", {
        headers: headers,
      });
      if (!doctorsResponse.ok) throw new Error("Failed to fetch doctors data");
      const doctorsData = await doctorsResponse.json();

      // Fetch admins (assuming the endpoint is `/api/admin`)
      const adminsResponse = await fetch("http://localhost:8800/api/admin", {
        headers: headers,
      });
      if (!adminsResponse.ok) throw new Error("Failed to fetch admins data");
      const adminsData = await adminsResponse.json();

      // Prepare the chart data
      const chartData: ChartDataItem[] = [
        {
          name: "Players",
          value: playersData.length,
          fill: "#A0C2ED", // Dark Blue
        },
        {
          name: "Admins",
          value: adminsData.length,
          fill: "#008080", // Light Blue
        },
        {
          name: "Doctors",
          value: doctorsData.length,
          fill: "#354B75", // Medium Blue
        },
      ];

      // Update state with the chart data
      setData(chartData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if there is any
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2">
      <h2 className="text-lg font-bold mb-4">Users Active Status</h2>
      <RadialBarChart
        width={300} // Adjusted to ensure it fits well
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="80%"
        barSize={20} // Smaller bar size for better fitting
        data={data}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar background dataKey="value" />
        <Tooltip
          content={<CustomTooltip />}
          cursor={false} // Disable the hover line (cursor)
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          iconType="circle" // Rounded legend icons
          wrapperStyle={{
            top: "50%",
            right: 0, // Adjusted to fit within the container
            transform: "translateY(-270%)",
            lineHeight: "24px",
          }}
        />
      </RadialBarChart>
    </div>
  );
};

export default UserActivationChart;
