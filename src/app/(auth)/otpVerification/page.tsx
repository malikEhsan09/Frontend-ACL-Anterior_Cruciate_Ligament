"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // Replace with the correct path for your OTP component
import { FaCheckCircle } from "react-icons/fa"; // Success Icon
import { MdArrowBack } from "react-icons/md"; // Back Icon
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Image from "next/image";
import football from "@/public/assets/football.svg"; // Replace with the correct image path

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const router = useRouter();

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue); // Update OTP value when typed
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage("");

    try {
      const response = await fetch(
        "http://localhost:8800/api/auth/password/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationCode: otp.toUpperCase(), // Sending OTP only
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("OTP verified successfully.");
        setAlertType("success");

        // Redirect to newPassword page with userId in the query string
        setTimeout(() => {
          const url = `/newPassword?userId=${data.userId}`; // Construct the URL with query params
          router.push(url);
        }, 3000);
      } else {
        setAlertMessage(data.message || "Invalid OTP. Please try again.");
        setAlertType("error");
      }
    } catch (err) {
      setAlertMessage("An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">
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

      {/* Right side with OTP Verification form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-2xl relative">
          {/* Back Icon */}
          <div className="flex items-center mb-4">
            <button onClick={() => router.back()}>
              <MdArrowBack className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
            </button>
            <h2 className="text-3xl font-bold text-center ml-4">
              OTP Verification
            </h2>
          </div>

          <p className="text-gray-600 text-center mb-6">
            Enter the 6-digit OTP sent to your email.
          </p>

          <form onSubmit={handleOtpSubmit}>
            {/* OTP Input Fields */}
            <div className="mb-6 relative flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                onChange={handleOtpChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={0}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={1}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={2}
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={3}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={4}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify OTP Button */}
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold text-[16px] transition duration-200 shadow-md text-lg hover:cursor-pointer"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
