"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";

// Dynamically import PlayersGraph with SSR disabled
const PlayersGraph = dynamic(() => import("./components/PlayersGraph"), {
  ssr: false, // Disable server-side rendering for the chart component
});

import { User, Users, ShieldCheck, Stethoscope } from "lucide-react";
import UserActivationChart from "./components/UserActivationChart";
import ClubsTable from "./components/ClubsTable";

const Admin = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0); // New state for total clubs
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // New state for total users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const commonColor = "bg-[#354B75]";

  // Function to get the authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch players data from the API
  const fetchPlayersData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);

    try {
      const response = await fetch("http://localhost:8800/api/player", {
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch players data");
      const playersData = await response.json();

      // Set the total number of players
      setTotalPlayers(playersData.length);
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

  // Fetch clubs data from the API
  const fetchClubsData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    try {
      const response = await fetch("http://localhost:8800/api/club/", {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch clubs data");
      const clubsData = await response.json();

      // Set the total number of clubs
      setTotalClubs(clubsData.length);
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

  // Fetch doctors data from the API
  const fetchDoctorsData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    try {
      const response = await fetch("http://localhost:8800/api/doctor/", {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch doctors data");
      const doctorData = await response.json();

      // Set the total number of doctors
      setTotalDoctors(doctorData.length);
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

  // Fetch users data from the API
  const fetchUsersData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);

    try {
      const response = await fetch("http://localhost:8800/api/auth/users", {
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch users data");
      const usersData = await response.json();

      // Set the total number of users
      setTotalUsers(usersData.length);
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
    fetchPlayersData();
    fetchClubsData();
    fetchDoctorsData();
    fetchUsersData(); // Fetch users data when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-6 px-4">
      {/* Statistics Section */}
      <div className="flex justify-between space-x-6 mb-6 w-full ">
        <StatsCard
          title="Total Players"
          value={totalPlayers}
          description="+8% from yesterday"
          percentageChange="+8% from yesterday"
          bgColor={commonColor}
          icon={<User />}
        />
        <StatsCard
          title="Total Clubs"
          value={totalClubs} // Dynamically pass totalClubs
          description="+8% from yesterday"
          percentageChange="+8% from yesterday"
          bgColor={commonColor}
          icon={<ShieldCheck />}
        />
        <StatsCard
          title="Total Users"
          value={totalUsers} // Dynamically pass totalUsers
          description="+8% from yesterday"
          percentageChange="+8% from yesterday"
          bgColor={commonColor}
          icon={<Users />}
        />
        <StatsCard
          title="Total Doctors"
          value={totalDoctors}
          description="+8% from yesterday"
          percentageChange="+8% from yesterday"
          bgColor={commonColor}
          icon={<Stethoscope />}
        />
      </div>
      {/* Players Registration Graph */}
      <PlayersGraph /> {/* Dynamically loaded graph component */}
      <div className="flex space-x-6 mt-6">
        {/* User Activation Pie Chart */}
        <UserActivationChart />

        {/* Clubs Table */}
        <ClubsTable />
      </div>
    </div>
  );
};

export default Admin;
