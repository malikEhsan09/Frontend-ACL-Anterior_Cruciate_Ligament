"use client"; // Ensure that this component is only client-side

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaArrowUp } from "react-icons/fa"; // Importing the up arrow icon

const threshold = 7; // Define your threshold value here

// Custom Tooltip Component
import { TooltipProps } from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#A0C2ED",
          padding: "10px",
          borderRadius: "8px", // Rounded border
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow for better UI
        }}
      >
        <p className="label" style={{ fontWeight: "bold", color: "black" }}>
          {`${label} : ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

// Removed unused getAbbreviatedMonthName function

const PlayersGraph = () => {
  const [data, setData] = useState<MonthData[]>([]); // State for player registration data
  const [totalPlayers, setTotalPlayers] = useState(0); // State for total players count
  const [percentageChange, setPercentageChange] = useState(0); // State for percentage change
  const [percentageColor, setPercentageColor] = useState("green"); // Color for percentage change
  const [loading, setLoading] = useState(true);

  // Function to get the authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Group players by month using JavaScript Date methods
  interface Player {
    createdAt: string;
  }

  interface MonthData {
    name: string;
    value: number;
  }

  // Function to fetch player data from the API
  useEffect(() => {
    const groupPlayersByMonth = (players: Player[]): MonthData[] => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const playersByMonth: MonthData[] = months.map((month) => ({
        name: month,
        value: 0,
      }));

      players.forEach((player) => {
        const playerDate = new Date(player.createdAt);
        const monthIndex = playerDate.getMonth(); // Get the month index (0-11)
        playersByMonth[monthIndex].value += 1; // Increment the count for the respective month
      });

      return playersByMonth;
    };
    const fetchPlayerData = async () => {
      const authToken = getAuthToken();
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${authToken}`);

      try {
        const response = await fetch("http://localhost:8800/api/player", {
          headers: headers,
        });
        if (!response.ok) throw new Error("Failed to fetch players data");

        const playersData = await response.json();

        // Group players by month using createdAt field
        const groupedData = groupPlayersByMonth(playersData);
        setData(groupedData);

        // Calculate total players
        const total = playersData.length;
        setTotalPlayers(total);

        // Calculate percentage change based on the last two months
        const currentMonthPlayers =
          groupedData[new Date().getMonth()]?.value || 0;
        const previousMonthPlayers =
          groupedData[new Date().getMonth() - 1]?.value || 0;

        let percentage = 0;
        if (previousMonthPlayers) {
          percentage =
            ((currentMonthPlayers - previousMonthPlayers) /
              previousMonthPlayers) *
            100;
        }

        setPercentageChange(parseFloat(percentage.toFixed(2))); // Round to 2 decimal places

        // Adjust percentage color based on growth or no growth
        if (currentMonthPlayers === 0 && previousMonthPlayers === 0) {
          setPercentageColor("yellow"); // No players registered
        } else if (percentage > 0) {
          setPercentageColor("green"); // Growth
        } else {
          setPercentageColor("yellow"); // No growth, warning state
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData(); // Fetch data when component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching
  }

  return (
    <div>
      {/* Heading for Player Registrations placed outside the shadow box */}
      <h2 className="text-2xl font-bold mb-4">Player Registrations</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray-500 text-sm ">Total Players</p>
              <h1 className="text-3xl font-bold text-black">{totalPlayers}</h1>
            </div>
            <div
              className={`flex items-center bg-${percentageColor}-100 p-1 rounded-md mt-[1.5rem]`}
            >
              <FaArrowUp className={`text-${percentageColor}-500`} />{" "}
              {/* Arrow Icon */}
              <p
                className={`text-${percentageColor}-500 text-sm font-bold ml-1`}
              >
                {percentageChange}% {/* Dynamic percentage */}
              </p>{" "}
              {/* Spacing between arrow and percentage */}
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <select className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-onHover border-gray-300">
              <option>All Time</option>
              <option>Last Year</option>
              <option>Last Month</option>
            </select>
            <button className="text-[#A0C2ED] text-md font-bold no-underline p-2 rounded-md">
              See All
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Adjusting right margin to fit well
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />{" "}
            {/* Custom Tooltip with no greyish hover */}
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= threshold ? "#354B75" : "#A0C2ED"} // Threshold for color
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlayersGraph;
