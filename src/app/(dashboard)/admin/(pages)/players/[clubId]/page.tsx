"use client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaFlag,
  FaCheckCircle,
} from "react-icons/fa";

interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  image: string;
  isMember: string;
}

const ClubPlayersPage: React.FC = () => {
  const router = useRouter();
  const { players: playerIds } = router.query; // Get the playerIds from the URL
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8800/api/player", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlayers(response.data); // Set all players
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching players:", error);
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Filter players based on the player IDs passed in the query
  useEffect(() => {
    if (players.length > 0 && playerIds) {
      const idsArray = (playerIds as string).split(",");
      const filtered = players.filter((player) =>
        idsArray.includes(player._id)
      );
      setFilteredPlayers(filtered);
    }
  }, [players, playerIds]);

  if (isLoading) {
    return <div>Loading players...</div>;
  }

  return (
    <div className="p-2 mt-2">
      <h2 className="text-xl font-bold text-gray-800">Players in this Club</h2>

      {filteredPlayers.length > 0 ? (
        <ul>
          {filteredPlayers.map((player) => (
            <li key={player._id} className="player-details mb-4">
              <div className="player-info flex items-center">
                <img
                  src={player.image}
                  alt={player.firstName}
                  className="player-image w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-md font-semibold">
                    {player.firstName} {player.lastName}
                  </h3>
                  <p className="text-sm flex items-center">
                    <FaCalendarAlt className="mr-2" />{" "}
                    {new Date(player.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p className="text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> {player.address}
                  </p>
                  <p className="text-sm flex items-center">
                    <FaPhoneAlt className="mr-2" /> {player.phoneNumber}
                  </p>
                  <p className="text-sm flex items-center">
                    <FaUser className="mr-2" /> {player.gender}
                  </p>
                  <p className="text-sm flex items-center">
                    <FaFlag className="mr-2" /> {player.nationality}
                  </p>
                  <p className="text-sm flex items-center">
                    <FaCheckCircle className="mr-2" /> {player.isMember}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No players assigned to this club.</p>
      )}
    </div>
  );
};

export default ClubPlayersPage;
