"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxHeight: "80vh",
    overflowY: "auto" as const,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const AdminSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileInfo, setProfileInfo] = useState<{
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

  const router = useRouter();

  const fetchAdminData = async () => {
    const userId = localStorage.getItem("userId")?.trim(); // Get user Id from local storage
    const authToken = localStorage.getItem("authToken");

    if (!userId || !authToken) {
      console.error("User ID or Auth token is missing.");
      return;
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);

    try {
      const response = await fetch(
        `http://localhost:8800/api/admin/${userId}`, // use this mroute to fecth the admin detail based on the user Id not on the admin id
        { method: "GET", headers }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Fetched admin data:", result);
        setProfileInfo({
          name: result.name || "",
          phoneNumber: result.phoneNumber || "",
          CNIC: result.CNIC || "",
          image: result.image || null,
        });
      } else {
        console.error(
          "Failed to fetch admin data, status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileInfo({ ...profileInfo, image: e.target.files[0] });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");

    if (!userId || !authToken) {
      console.error("User ID or Auth token is missing.");
      router.push("/login");
      return;
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);

    const formdata = new FormData();
    formdata.append("name", profileInfo.name);
    formdata.append("phoneNumber", profileInfo.phoneNumber);
    formdata.append("CNIC", profileInfo.CNIC);

    if (profileInfo.image) {
      formdata.append("image", profileInfo.image);
    }

    const requestOptions = {
      method: "PATCH",
      headers,
      body: formdata,
    };

    try {
      const response = await fetch(
        `http://localhost:8800/api/admin/${userId}`,
        requestOptions
      );

      if (response.ok) {
        setAlertMessage("Your Profile has been updated successfully");
        setSuccess(true);
        setOpen(true);
        setIsEditing(false);

        setTimeout(() => {
          setOpen(false);
        }, 3000);

        fetchAdminData();
      } else {
        setAlertMessage("Failed to update profile. Please try again.");
        setSuccess(false);
        setOpen(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const imageSrc: string =
    typeof window !== "undefined" &&
    typeof File !== "undefined" &&
    profileInfo?.image instanceof File
      ? URL.createObjectURL(profileInfo.image)
      : (profileInfo?.image as string | null) || "/default-profile.png";

  return (
    <div className="p-6 bg-white min-h-screen">
      {open && (
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-2 h-8 bg-lightBlue rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-gray-800">Admin Profile</h2>
          </div>
          <div className="flex items-center">
            <Image
              src={imageSrc}
              alt="Profile"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div>
              <h3 className="text-lg font-bold  text-darkBlue">
                {profileInfo.name}
              </h3>
              <p className="text-gray-600 font-semibold">
                CNIC: {profileInfo.CNIC}
              </p>
            </div>
          </div>
        </div>
        <button
          className="bg-buttonColor hover:bg-onHover text-white px-4 py-2 rounded-lg"
          onClick={handleEditToggle}
        >
          Edit Profile
        </button>
      </div>

      <hr className="border-t-2 border-gray-200 my-6" />

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-2 h-8 bg-lightBlue rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-bold">Phone Number</p>
            <p className="text-gray-800">{profileInfo.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">CNIC</p>
            <p className="text-gray-800">{profileInfo.CNIC}</p>
          </div>
        </div>
      </div>

      <hr className="border-t-2 border-gray-200 my-6" />

      <Modal
        isOpen={isEditing}
        onRequestClose={closeModal}
        contentLabel="Edit Profile Modal"
        style={customStyles}
      >
        <div className="modal-content">
          <h3 className="text-xl font-bold mb-4 text-center">
            Edit Profile Information
          </h3>

          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profileInfo.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
          />

          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={profileInfo.phoneNumber}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
          />

          <label className="block text-gray-700">CNIC</label>
          <input
            type="text"
            name="CNIC"
            value={profileInfo.CNIC}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
          />

          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            name="image"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
          />

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSave}
              className="bg-buttonColor hover:bg-darkBlue text-white px-4 py-2 rounded-lg mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={closeModal}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSettings;
