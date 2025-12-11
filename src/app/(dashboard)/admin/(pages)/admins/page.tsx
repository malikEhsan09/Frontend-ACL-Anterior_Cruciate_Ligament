"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Trash, Edit3 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const Admins = () => {
  const dataPerPage = 7; // Limit to 7 entries per page
  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loggedInAdminId, setLoggedInAdminId] = useState<string | null>(null); // To store the logged-in admin's ID
  const [newAdmin, setNewAdmin] = useState<{
    name: string;
    phoneNumber: string;
    CNIC: string;
    image: File | null;
  }>({
    name: "",
    phoneNumber: "",
    CNIC: "",
    image: null,
  });
  interface Admin {
    _id: string;
    name: string;
    phoneNumber: string;
    CNIC: string;
    image: string | File | null;
    createdAt: string;
    userID: { _id: string }; // Add userID property
  }

  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null); // State for viewing admin details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State to control view modal visibility
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId"); // Fetch logged-in user's ID
        setLoggedInAdminId(userId);

        const response = await axios.get("http://localhost:8800/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedAdmins = response.data;
        type Admin = {
          createdAt: string;
          // Add other properties of the admin object here if needed
        };

        const sortedData =
          sortOrder === "Newest"
            ? fetchedAdmins.sort(
                (a: Admin, b: Admin) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
            : fetchedAdmins.sort(
                (a: Admin, b: Admin) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );

        setAdmins(sortedData);
        setTotalPages(Math.ceil(sortedData.length / dataPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, [sortOrder]);

  const currentData = admins.slice(
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

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newAdmin.name);
    formData.append("phoneNumber", newAdmin.phoneNumber);
    formData.append("CNIC", newAdmin.CNIC);
    if (newAdmin.image) {
      formData.append("image", newAdmin.image);
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://localhost:8800/api/admin", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const response = await axios.get("http://localhost:8800/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(response.data);
      setNewAdmin({ name: "", phoneNumber: "", CNIC: "", image: null });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const handleUpdateAdmin = async (
    e: React.FormEvent<HTMLFormElement>,
    adminId: string
  ) => {
    e.preventDefault();
    if (loggedInAdminId !== adminId) {
      // Add a check to ensure the logged-in user can only update their own info
      console.log("You can only edit your own information.");
      return;
    }
    const formData = new FormData();
    if (editingAdmin) {
      formData.append("name", editingAdmin.name);
    }
    if (editingAdmin) {
      formData.append("phoneNumber", editingAdmin.phoneNumber);
    }
    if (editingAdmin) {
      formData.append("CNIC", editingAdmin.CNIC);
    }
    if (editingAdmin && editingAdmin.image) {
      formData.append("image", editingAdmin.image);
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:8800/api/admin/${adminId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response = await axios.get("http://localhost:8800/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data);
      setEditingAdmin(null);
      setIsModalOpen(false); // Close modal after updating
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8800/api/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get("http://localhost:8800/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data);
      setIsDeletePopupOpen(false);
      setAdminToDelete(null);
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const openDeletePopup = (admin: Admin) => {
    setAdminToDelete(admin);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setAdminToDelete(null);
  };

  const openViewAdminModal = (admin: Admin) => {
    setViewingAdmin(admin);
    setIsViewModalOpen(true);
  };

  const closeViewAdminModal = () => {
    setIsViewModalOpen(false);
    setViewingAdmin(null);
  };

  const headers = ["ID", "Image", "Name", "Phone", "CNIC", "Status", "Action"];

  if (isLoading) {
    return <div>Loading Admins...</div>;
  }

  return (
    <div className="p-2 mt-2 ">
      <div className="flex justify-between items-start mb-3 bg-[#F0F0F0] p-2 rounded-t-2xl">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
            <h2 className="text-xl font-bold text-gray-800">Admin</h2>
          </div>
          {/* <button
            className="text-md font-semibold p-1 rounded-md text-white bg-lightBlue mt-1 ml-3 hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Admin
          </button> */}
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

      <table className="min-w-full bg-white border border-gray-200 rounded-md">
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
        <tbody className="text-gray-700">
          {currentData.map((admin, index) => (
            <tr key={index} className="border-t">
              <td className="py-3 px-6 text-blue-600 font-bold">{index + 1}</td>
              <td className="py-3 px-6">
                {admin.image && typeof admin.image === "string" ? (
                  <Image
                    src={admin.image}
                    alt="Admin"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="py-3 px-6">{admin.name || "N/A"}</td>
              <td className="py-3 px-6">{admin.phoneNumber || "N/A"}</td>
              <td className="py-3 px-6">{admin.CNIC || "N/A"}</td>
              {/* Status */}
              <td className="py-3 px-6">
                {localStorage.getItem("userId") === admin.userID._id ? (
                  <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs">
                    Inactive
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="py-3 px-6 text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    className="hover:text-gray-800 bg-transparent hover:cursor-pointer"
                    onClick={() => openViewAdminModal(admin)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {loggedInAdminId === admin.userID._id && (
                    <>
                      <button
                        className="text-red-500 hover:text-red-700 bg-transparent hover:cursor-pointer"
                        onClick={() => openDeletePopup(admin)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <button
                        className="text-lightBlue  bg-transparent hover:cursor-pointer"
                        onClick={() => {
                          setEditingAdmin(admin);
                          setIsModalOpen(true); // Open modal for editing
                        }}
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {/* <button
                    className="text-red-500 hover:text-red-700 bg-transparent hover:cursor-pointer"
                    onClick={() => openDeletePopup(admin)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <button
                    className="text-lightBlue  bg-transparent hover:cursor-pointer"
                    onClick={() => {
                      setEditingAdmin(admin);
                      setIsModalOpen(true); // Open modal for editing
                    }}
                  >
                    <Edit3 className="h-5 w-5" />
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
          {Math.min(currentPage * dataPerPage, admins.length)} of{" "}
          {admins.length} entries
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

      {/* View Admin Details Modal */}
      {isViewModalOpen && viewingAdmin && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#333] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Admin Details
            </h2>
            <div className="flex flex-col items-center">
              {viewingAdmin.image && typeof viewingAdmin.image === "string" ? (
                <Image
                  src={viewingAdmin.image}
                  alt="Admin"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
                  N/A
                </div>
              )}
              <p className="text-lg font-semibold text-lightBlue">
                {viewingAdmin.name}
              </p>
              <p className="text-sm text-gray-500">CNIC: {viewingAdmin.CNIC}</p>
              <p className="text-sm text-gray-500">
                Phone: {viewingAdmin.phoneNumber}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={closeViewAdminModal}
              >
                Close
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
              Are you sure you want to delete this admin?
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
                onClick={() => adminToDelete && handleDeleteAdmin(adminToDelete._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating/Updating Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {editingAdmin
                ? "Edit Admin Information"
                : "Add Admin Information"}
            </h2>
            <form
              onSubmit={(e) =>
                editingAdmin
                  ? handleUpdateAdmin(e, editingAdmin.userID._id)
                  : handleCreateAdmin(e)
              }
            >
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="text"
                  value={editingAdmin ? editingAdmin.name : newAdmin.name}
                  onChange={(e) =>
                    editingAdmin
                      ? setEditingAdmin({
                          ...editingAdmin,
                          name: e.target.value,
                        })
                      : setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                  placeholder="Name"
                  required
                />
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-phone"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="text"
                  value={
                    editingAdmin
                      ? editingAdmin.phoneNumber
                      : newAdmin.phoneNumber
                  }
                  onChange={(e) =>
                    editingAdmin
                      ? setEditingAdmin({
                          ...editingAdmin,
                          phoneNumber: e.target.value,
                        })
                      : setNewAdmin({
                          ...newAdmin,
                          phoneNumber: e.target.value,
                        })
                  }
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  className="pl-10 border border-gray-300 p-2 w-[21rem] rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
                  type="text"
                  value={editingAdmin ? editingAdmin.CNIC : newAdmin.CNIC}
                  onChange={(e) =>
                    editingAdmin
                      ? setEditingAdmin({
                          ...editingAdmin,
                          CNIC: e.target.value,
                        })
                      : setNewAdmin({ ...newAdmin, CNIC: e.target.value })
                  }
                  placeholder="CNIC"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lightBlue file:text-white hover:file:bg-blue-600"
                    type="file"
                    onChange={(e) => {
                      const file: File | null = e.target.files?.[0] || null;
                      if (editingAdmin) {
                        setEditingAdmin({
                          ...editingAdmin,
                          image: file,
                        });
                      } else {
                        setNewAdmin({
                          ...newAdmin,
                          image: file,
                        });
                      }
                    }}
                  />
                </div>
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
                  className="bg-buttonColor text-white py-2 px-4 rounded hover:bg-darkBlue"
                >
                  {editingAdmin ? "Update Admin" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
