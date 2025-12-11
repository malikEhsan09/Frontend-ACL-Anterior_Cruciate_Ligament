"use client";
import React, { useState, useEffect } from "react";

interface Club {
  _id: string;
  clubName: string;
  clubLogo?: string;
  isActive: boolean;
  createdAt: string;
  clubLocation?: string;
}

const ClubsTable = () => {
  const [clubs, setClubs] = useState<Club[]>([]); // State to store the club data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to get the authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch club data from the API
  const fetchClubsData = async () => {
    const authToken = getAuthToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);

    try {
      const response = await fetch("http://localhost:8800/api/club", {
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch club data");
      const clubData = await response.json();
      setClubs(clubData); // Set the fetched club data
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

  // Fetch clubs on component mount
  useEffect(() => {
    fetchClubsData();
  }, []);

  // Handle loading state
  if (loading) return <p>Loading clubs...</p>;

  // Handle error state
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-lg font-bold mb-4">All Active and In Active Clubs</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Logo</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club._id}>
              <td className="border px-4 py-2">
                {/* Display the club logo */}
                {club.clubLogo ? (
                  <img
                    src={club.clubLogo}
                    alt={club.clubName}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <span>No Logo</span>
                )}
              </td>
              <td className="border px-4 py-2">{club.clubName}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full border font-bold ${
                    club.isActive
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "bg-red-100 text-red-700 border-red-500"
                  }`}
                >
                  {club.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="border px-4 py-2">
                {new Date(club.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{club.clubLocation || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubsTable;
