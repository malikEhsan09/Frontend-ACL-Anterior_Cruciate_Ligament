"use client";
import Image from "next/image";
import { MdArrowBack } from "react-icons/md";
import football from "@/public/assets/football.svg";
import Link from "next/link";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Add the check icon for success
import { useRouter } from "next/navigation"; // Import Next.js router for redirection

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // State to handle alert message
  const [alertType, setAlertType] = useState(""); // State to manage alert type (success or error)
  const router = useRouter(); // Next.js router instance for redirection

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage(""); // Reset alert message

    try {
      const response = await fetch(
        "http://localhost:8800/api/auth/password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If successful, display success message and redirect after 3 seconds
        setAlertMessage("OTP sent to your email.");
        setAlertType("success");

        // Redirect to the otpVerification page after 3 seconds
        setTimeout(() => {
          router.push("/otpVerification");
        }, 3000); // 3 seconds delay before redirect
      } else {
        // Display error message
        setAlertMessage(
          data.message || "Failed to send OTP. Please try again."
        );
        setAlertType("error");
      }
    } catch (err) {
      setAlertMessage("An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div className="flex min-h-screen font-poppins bg-white lg:bg-gray-100">
      {/* Alert Box */}
      {alertMessage && (
        <div
          className={`fixed top-2 left-1/2 transform -translate-x-1/2 w-full max-w-xs p-4 rounded-lg shadow-lg z-50 text-white ${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center">
            {alertType === "success" ? (
              <FaCheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <span className="mr-2">❗</span>
            )}
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Left side with image and text */}
      <div className="hidden lg:flex w-1/2 bg-blue-100 relative items-center justify-center">
        <Image
          src={football}
          priority
          alt="football Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 shadow-2xl"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white z-10">
          <h2 className="text-4xl font-semibold mb-4">
            Let’s empower your financial task today with Findash.
          </h2>
          <p className="text-lg">
            The one-stop platform for all financial management of small and
            medium-sized businesses.
          </p>
        </div>
      </div>

      {/* Right side with reset password form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white lg:bg-gray-200 p-6 sm:p-8 rounded-xl shadow-2xl relative">
          <div className="flex items-center mb-4">
            <Link href="/login">
              <MdArrowBack className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
            </Link>
            <h2 className="text-3xl font-bold ml-4">Reset Your Password</h2>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Input your email address to receive an OTP.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[18px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold text-[16px] transition duration-200 shadow-md text-lg hover:cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
