"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash,
  Edit3,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // For success icon

const Clubs = () => {
  const dataPerPage = 7; // Limit to 7 entries per page
  const [currentPage, setCurrentPage] = useState(1);
  const [clubs, setClubs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [newClub, setNewClub] = useState({
    clubName: "",
    clubLocation: "",
    maxCapacity: 0,
    description: "",
    foundedYear: "",
    clubLogo: null,
  });
  interface Club {
    _id: string;
    clubName: string;
    clubLocation: string;
    maxCapacity: number;
    description: string;
    foundedYear: string;
    clubLogo: string | null;
    numOfMembers: number;
    isActive: boolean;
    players: string[];
  }
  
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [viewingClub, setViewingClub] = useState(null); // State for viewing club details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State to control view modal visibility
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [inviteLink, setInviteLink] = useState(""); // State for invite link
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // Invite modal
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false); // Player modal
  const [selectedClubId, setSelectedClubId] = useState(null); // For which club we are adding a player
  const [playerEmail, setPlayerEmail] = useState(""); // State for adding player email
  const [openAlert, setOpenAlert] = useState(false); // Custom alert state
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false); // Alert type

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8800/api/club", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedClubs = response.data;
        const sortedData =
          sortOrder === "Newest"
            ? fetchedClubs.sort(
                (a: { createdAt: string }, b: { createdAt: string }) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            : fetchedClubs.sort(
                (a: { createdAt: string }, b: { createdAt: string }) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );

        setClubs(sortedData);
        setTotalPages(Math.ceil(sortedData.length / dataPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching club data:", error);
        setIsLoading(false);
      }
    };
    fetchClubs();
  }, [sortOrder]);

  const currentData = clubs.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const token = localStorage.getItem("authToken");
    const adminId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("clubName", newClub.clubName);
    formData.append("clubLocation", newClub.clubLocation);
    formData.append("numOfMembers", "0"); // Set the initial number of members to 0
    formData.append("maxCapacity", newClub.maxCapacity);
    formData.append("description", newClub.description);
    formData.append("foundedYear", newClub.foundedYear);
    formData.append("isActive", true); // Default value for active status
    formData.append("createdBy", adminId); // Example creator ID

    if (newClub.clubLogo) {
      formData.append("clubLogo", newClub.clubLogo);
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:8800/api/club/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      const updatedClubs = await axios.get("http://localhost:8800/api/club", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClubs(updatedClubs.data);
      setNewClub({
        clubName: "",
        clubLocation: "",
        numOfMembers: 0, // Reset this to 0 after creating
        maxCapacity: 0,
        description: "",
        foundedYear: "",
        clubLogo: null,
      });
      setIsModalOpen(false);
      setSuccess(true);
      setAlertMessage("Club created successfully!");
      setOpenAlert(true);
      setTimeout(() => setOpenAlert(false), 3000);
    } catch (error) {
      console.error("Error creating club:", error);
    }
  };



  const createPromoCode = async (clubId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authorization token not found!");
        return;
      }
      const response = await axios.post(
        `http://localhost:8800/api/club/${clubId}/promocode`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Handle successful promo code creation
        console.log("Promo code created:", response.data);
      } else {
        // Handle error
        console.error("Error creating promo code:", response.data);
      }
    } catch (error) {
      console.error("Error creating promo code:", error);
    }
  };

  
  const handleAddPlayer = async () => {
    if (!playerEmail && !selectedClubId) {
      alert("Please provide a valid email or player ID.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authorization token not found!");
        return;
      }

      const requestBody = { email: playerEmail, clubId: selectedClubId };

      const response = await axios.post(
        "http://localhost:8800/api/club/assignPlayer",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        // setAlertMessage("Player assigned successfully!");
        setAlertMessage(`Player assigned successfully! Promo code: ${response.data.promoCode}`);
        setOpenAlert(true);
        setTimeout(() => setOpenAlert(false), 5000);
        closePlayerModal(); // Close modal after successful assignment
        const updatedClubs = await axios.get("http://localhost:8800/api/club", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClubs(updatedClubs.data);

      } else {
        setSuccess(false);
        setAlertMessage(response.data.message);
        setOpenAlert(true);
        setTimeout(() => setOpenAlert(false), 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error assigning player:", error.response.data);
        setSuccess(false);
        setAlertMessage(error.response.data.message);
        setOpenAlert(true);
        setTimeout(() => setOpenAlert(false), 3000);
      } else if (axios.isAxiosError(error) && error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error(
          "Error in request setup:",
          axios.isAxiosError(error) && error.message
        );
      }
    }
  };

  const handleGenerateInviteLink = async (clubId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:8800/api/club/generateInviteLink",
        { clubId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInviteLink(response.data.inviteLink);
      setIsInviteModalOpen(true); // Open the invite modal
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };

  const handleUpdateClub = async (e: React.FormEvent<HTMLFormElement>, clubId: string) => {
    e.preventDefault();
    const formData = new FormData();
    if (editingClub) {
      formData.append("clubName", editingClub.clubName);
    }
    if (editingClub) {
      formData.append("clubLocation", editingClub.clubLocation);
    }
    formData.append("maxCapacity", editingClub.maxCapacity);
    formData.append("description", editingClub.description);
    formData.append("foundedYear", editingClub.foundedYear);
    if (editingClub && editingClub.clubLogo) {
      formData.append("clubLogo", editingClub.clubLogo);
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(`http://localhost:8800/api/club/${clubId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const response = await axios.get("http://localhost:8800/api/club", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClubs(response.data);
      setEditingClub(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8800/api/club/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get("http://localhost:8800/api/club", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClubs(response.data);
      setIsDeletePopupOpen(false);
      setClubToDelete(null);
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const openDeletePopup = (club) => {
    setClubToDelete(club);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setClubToDelete(null);
  };

  const openViewClubModal = (club) => {
    setViewingClub(club);
    setIsViewModalOpen(true);
  };

  const closeViewClubModal = () => {
    setIsViewModalOpen(false);
    setViewingClub(null);
  };

  const openPlayerModal = (clubId) => {
    setSelectedClubId(clubId);
    setIsPlayerModalOpen(true);
  };

  const closePlayerModal = () => {
    setIsPlayerModalOpen(false);
    setSelectedClubId(null);
  };

  const headers = [
    "ID",
    "Club Logo",
    "Club Name",
    "Location",
    "Max Capacity",
    // "Founded Year",
    "Action",
  ];

  if (isLoading) {
    return <div>Loading Clubs...</div>;
  }

  return (
    <div className="p-2 mt-2 ">
      <div className="flex justify-between items-start mb-3 bg-[#F0F0F0] p-2 rounded-t-2xl">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
            <h2 className="text-xl font-bold text-gray-800">Clubs</h2>
          </div>
          <button
            className="text-md font-semibold px-2 p-1 rounded-md text-white bg-lightBlue mt-1 ml-3 hover:cursor-pointer hover:bg-onHover "
            onClick={() => setIsModalOpen(true)}
          >
            Add Club
          </button>
        </div>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Custom Alert */}
      {openAlert && (
        <div className="fixed top-0 left-0 right-0 bg-white border border-gray-200 shadow-lg p-4 text-center mx-auto max-w-xl z-50 animate-slide-down rounded-lg">
          {success ? (
            <>
              <FaCheckCircle className="w-8 h-8 text-green-500 inline-block mr-2" />
              <span className="text-lg font-semibold text-green-600">
                {alertMessage}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-red-600">
              {alertMessage}
            </span>
          )}
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200 rounded-md mt-[-1rem]">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="py-3 px-6 text-left font-medium text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 -mt-[-12]">
          {currentData.map((club, index) => (
            <tr key={index} className="border-t">
              <td className="py-3 px-6 text-blue-600 font-bold">{index + 1}</td>
              <td className="py-3 px-6">
                {club.clubLogo ? (
                  <img
                    src={club.clubLogo}
                    alt="Club Logo"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="py-3 px-6">{club.clubName || "N/A"}</td>
              <td className="py-3 px-6">{club.clubLocation || "N/A"}</td>
              <td className="py-3 px-6">{club.maxCapacity || "N/A"}</td>
              {/* <td className="py-3 px-6">{club.foundedYear || "N/A"}</td> */}
              <td className="py-3 px-6 text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    className="hover:text-gray-800 bg-transparent hover:cursor-pointer font-bold"
                    onClick={() => openViewClubModal(club)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 bg-transparent hover:cursor-pointer font-bold"
                    onClick={() => openDeletePopup(club)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <button
                    className="text-lightBlue bg-transparent hover:cursor-pointer font-bold"
                    onClick={() => {
                      setEditingClub(club);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  {/* Add Player Button */}
                  <button
                    className="text-green-500 hover:cursor-pointer bg-transparent font-bold"
                    onClick={() => openPlayerModal(club._id)}
                  >
                    <UserPlus className="h-5 w-5" />
                  </button>
                  {/* Generate Invite Button */}
                  {/* <button
                    className="text-lightBlue hover:cursor-pointer bg-transparent font-bold"
                    onClick={() => handleGenerateInviteLink(club._id)}
                  >
                    Generate Invite
                  </button> */}
                     {/* <button
              className="text-buttonColor hover:cursor-pointer bg-transparent font-bold"
              onClick={() => createPromoCode(club._id)}
            >
              Create Promo
            </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 items-center ml-2">
          Showing {currentPage * dataPerPage - dataPerPage + 1} to{" "}
          {Math.min(currentPage * dataPerPage, clubs.length)} of {clubs.length}{" "}
          entries
        </p>
        <div className="flex space-x-2 items-center">
          <button
            className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex + 1}
              className={`px-3 py-2 text-gray-600 bg-gray-100 rounded-md ${
                currentPage === pageIndex + 1 ? "bg-gray-300" : ""
              }`}
              onClick={() => handlePageChange(pageIndex + 1)}
            >
              {pageIndex + 1}
            </button>
          ))}
          <button
            className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Invite Link Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#333] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Invite Link</h2>
            <p className="mb-4">Send this invite link to the player:</p>
            <p className="text-blue-500 font-bold mb-4 break-all">
              {inviteLink}
            </p>
            <button
              className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* View Club Details Modal */}
      {isViewModalOpen && viewingClub && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#333] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Club Details
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={viewingClub.clubLogo}
                alt="Club Logo"
                className="w-24 h-24 rounded-full mb-4"
              />
              <p className="text-lg font-semibold text-lightBlue">
                {viewingClub.clubName}
              </p>
              <p className="text-sm text-gray-500">
                Location: {viewingClub.clubLocation}
              </p>
              <p className="text-sm text-gray-500">
                Max Capacity: {viewingClub.maxCapacity}
              </p>
              <p className="text-sm text-gray-500">
                Description: {viewingClub.description || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Founded Year: {viewingClub.foundedYear || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Number of Members: {viewingClub.numOfMembers || 0}
              </p>
              <p
                className={`text-sm text-gray-500 p-2 border-2 rounded-md ${
                  viewingClub.isActive
                    ? "border-green-500 bg-transparent text-green-500"
                    : "border-red-500 text-red-500"
                }`}
              >
                Active: {viewingClub.isActive ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-500">
                Players:{" "}
                {viewingClub.players.length
                  ? viewingClub.players.join(", ")
                  : "No players assigned"}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={closeViewClubModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player Modal */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#333] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Assign Player
            </h2>
            <input
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              type="email"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              placeholder="Enter Player Email"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={closePlayerModal}
              >
                Cancel
              </button>
              <button
                className="bg-buttonColor text-white py-2 px-4 rounded  hover:bg-darkBlue"
                onClick={handleAddPlayer}
              >
                Assign Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="mb-4 text-center">
              Are you sure you want to delete this club?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={closeDeletePopup}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => handleDeleteClub(clubToDelete._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating/Updating Club */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {editingClub ? "Edit Club Information" : "Add Club Information"}
            </h2>
            <form
              onSubmit={(e) =>
                editingClub
                  ? handleUpdateClub(e, editingClub._id)
                  : handleCreateClub(e)
              }
            >
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-users"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="text"
                  value={editingClub ? editingClub.clubName : newClub.clubName}
                  onChange={(e) =>
                    editingClub
                      ? setEditingClub({
                          ...editingClub,
                          clubName: e.target.value,
                        })
                      : setNewClub({ ...newClub, clubName: e.target.value })
                  }
                  placeholder="Club Name"
                  required
                />
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="text"
                  value={
                    editingClub
                      ? editingClub.clubLocation
                      : newClub.clubLocation
                  }
                  onChange={(e) =>
                    editingClub
                      ? setEditingClub({
                          ...editingClub,
                          clubLocation: e.target.value,
                        })
                      : setNewClub({
                          ...newClub,
                          clubLocation: e.target.value,
                        })
                  }
                  placeholder="Club Location"
                  required
                />
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-users"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="number"
                  value={
                    editingClub ? editingClub.maxCapacity : newClub.maxCapacity
                  }
                  onChange={(e) =>
                    editingClub
                      ? setEditingClub({
                          ...editingClub,
                          maxCapacity: e.target.value,
                        })
                      : setNewClub({
                          ...newClub,
                          maxCapacity: e.target.value,
                        })
                  }
                  placeholder="Max Capacity"
                  required
                />
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-calendar"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="number"
                  value={
                    editingClub ? editingClub.foundedYear : newClub.foundedYear
                  }
                  onChange={(e) =>
                    editingClub
                      ? setEditingClub({
                          ...editingClub,
                          foundedYear: e.target.value,
                        })
                      : setNewClub({
                          ...newClub,
                          foundedYear: e.target.value,
                        })
                  }
                  placeholder="Founded Year"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Upload Club Logo
                </label>
                <div className="relative">
                  <input
                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lightBlue file:text-white hover:file:bg-blue-600"
                    type="file"
                    onChange={(e) =>
                      editingClub
                        ? setEditingClub({
                            ...editingClub,
                            clubLogo: e.target.files[0],
                          })
                        : setNewClub({
                            ...newClub,
                            clubLogo: e.target.files[0],
                          })
                    }
                  />
                </div>
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-info"></i>
                </span>
                <textarea
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  value={
                    editingClub ? editingClub.description : newClub.description
                  }
                  onChange={(e) =>
                    editingClub
                      ? setEditingClub({
                          ...editingClub,
                          description: e.target.value,
                        })
                      : setNewClub({
                          ...newClub,
                          description: e.target.value,
                        })
                  }
                  placeholder="Description"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {editingClub ? "Update Club" : "Create Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;








