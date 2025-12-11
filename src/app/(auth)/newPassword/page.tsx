"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdArrowBack } from "react-icons/md"; // For the back button
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // For the tick and cross icons
import Image from "next/image";
import football from "@/public/assets/football.svg"; // Replace with the correct image path
import Link from "next/link";

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage("");
    if (newPassword !== repeatPassword) {
      setAlertMessage("Passwords do not match.");
      setAlertType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8800/api/auth/password/updatePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: newPassword,
            userId: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Password updated successfully.");
        setAlertType("success");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setAlertMessage(data.message || "Failed to update password.");
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
              <span className="mr-2">✔</span>
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
          alt="Football Image"
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

      {/* Right side with Create New Password form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-2xl relative">
          {/* Back Icon */}
          <div className="flex items-center mb-4">
            <Link href="/resetPassword">
              <MdArrowBack className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
            </Link>
            <h2 className="text-3xl font-bold text-center ml-4">
              Create New Password
            </h2>
          </div>

          <p className="text-gray-600 text-center mb-6">
            Send your email account to reset password & make a new password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-[18px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
              />
            </div>

            {/* Repeat Password Field with tick or cross icon */}
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Repeat Password
              </label>
              <div className="relative w-full">
                <input
                  type="password"
                  placeholder="******"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full text-[18px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                />
                <div className="absolute right-3 top-3">
                  {newPassword && repeatPassword ? (
                    newPassword === repeatPassword ? (
                      <FaCheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <FaTimesCircle className="text-red-500 w-5 h-5" />
                    )
                  ) : null}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold text-[16px] transition duration-200 shadow-md text-lg hover:cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function NewPasswordPage() {
  return (
    <Suspense fallback={null}>
      <NewPassword />
    </Suspense>
  );
}
