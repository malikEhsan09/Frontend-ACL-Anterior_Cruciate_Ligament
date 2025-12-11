"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle, FaGoogle, FaFacebook, FaUserMd, FaUserTie, FaRunning, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import Eye Icons
import football from "@/public/assets/football.svg";
import Link from "next/link";
import axios from "axios";
import DoctorForm from "./form/doctor-form";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    userType: "Player",
    isAdmin: false, // Default isAdmin to false
    medicalLicenseNo: "",
    specialization: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      isAdmin: value === "Admin" ? true : false,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (!strongPasswordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (
      formData.userType === "Doctor" &&
      (!formData.medicalLicenseNo || !formData.specialization || !formData.phoneNumber)
    ) {
      setError("Please provide all required fields for doctor registration.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/api/auth/register", formData);
      console.log(response)

      setSuccess(true);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        router.push("/login");
      }, 3000); // Hide alert after 3 seconds
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  const handleGoogleOAuth = () => {
    window.location.href = "http://localhost:8800/api/auth/google";
  };

  const handleFacebookOAuth = () => {
    window.location.href = "http://localhost:8800/api/auth/facebook";
  };

  const renderUserTypeIcon = () => {
    switch (formData.userType) {
      case "Player":
        return <FaRunning className="w-6 h-6 text-gray-500" />;
      case "Admin":
        return <FaUserTie className="w-6 h-6 text-gray-500" />;
      case "Doctor":
        return <FaUserMd className="w-6 h-6 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen font-poppins bg-gray-50">
      {/* Left side with image */}
      <div className="lg:w-1/2 relative hidden lg:flex items-center justify-center">
        <Image
          src={football}
          priority
          alt="Football Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="relative p-10 text-white z-10">
          <h2 className="text-4xl font-semibold mb-4">
            Let’s empower your financial task today with Findash.
          </h2>
          <p className="text-lg">
            The one-stop platform for all financial management of small and medium-sized businesses.
          </p>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Create New Account</h2>
          <p className="text-center text-gray-600 mb-6">Please register by filling in your personal data</p>

          {/* Form start */}
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4 relative">
              <label className="block text-2xl text-gray-700 font-bold mb-2">Username</label>
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FaUserCircle className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <MdEmail className="w-6 h-6" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="youname@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            {/* User Type Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {renderUserTypeIcon()}
                </span>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                  style={{ paddingLeft: "3rem" }}
                >
                  <option value="Player">Player</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <RiLockPasswordFill className="w-6 h-6" />
                </span>
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                  style={{ paddingLeft: "3rem" }}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                </span>
              </div>
            </div>

            {/* Conditional Doctor Form */}
            {formData.userType === "Doctor" && <DoctorForm formData={formData} handleChange={handleChange} />}

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button className="w-full bg-buttonColor text-white py-3 rounded-lg hover:bg-onHover/900 font-semibold text-[16px] transition duration-200 shadow-md text-lg hover:cursor-pointer">
              Continue
            </button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">or</span>
          </div>
          <button
            className="w-full bg-white text-black py-3 rounded-lg flex items-center justify-center mb-3 hover:bg-gray-200 transition duration-200 text-lg font-semibold text-[16px] hover:cursor-pointer border border-black"
            onClick={handleGoogleOAuth}
          >
            <FaGoogle className="mr-2 text-red-500" />
            Continue with Google
          </button>
          <button
            className="w-full bg-white text-black py-3 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-200 text-lg font-semibold text-[16px] hover:cursor-pointer border border-black"
            onClick={handleFacebookOAuth}
          >
            <FaFacebook className="mr-2 text-blue-600" />
            Continue with Facebook
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Alert at the top */}
      {open && (
        <div className="fixed top-0 left-0 right-0 bg-white border border-gray-200 shadow-lg p-4 text-center mx-auto max-w-xl z-50 animate-slide-down rounded-lg">
          {success ? (
            <>
              <FaCheckCircle className="w-8 h-8 text-green-500 inline-block mr-2" />
              <span className="text-lg font-semibold text-green-600">
                Registration Successful!
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-red-600">{error}</span>
          )}
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
