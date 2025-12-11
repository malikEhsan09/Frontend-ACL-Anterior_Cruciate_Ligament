"use client";
import { useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "@/app/context/ThemeContext";
import landingPage from "@/public/assets/landingPage.svg";
import forDarkLandingPage from "@/public/assets/kneeImageForDarkBg.svg";
import HoverBorderGradientDemo from "./ButtonHover";

export default function HeroSection() {
  const { isDarkMode } = useContext(ThemeContext); // Use dark mode context

  return (
    <div className="max-h-screen">
      <div
        className={`flex flex-col md:flex-row items-center justify-between px-6 ${
          isDarkMode ? "bg-[#12182A]" : "bg-gray-100"
        } md:max-h-screen md:ml-5 py-10 md:py-0`} // Adjust padding for mobile
      >
        <div className="md:w-1/2 space-y-4 md:space-y-6 mt-8 md:mt-0">
          {" "}
          {/* Adjust spacing */}
          <h1
            className={`text-3xl md:text-5xl font-bold ${
              isDarkMode ? "text-white" : "text-boldTextColor"
            } leading-tight`}
          >
            Get Your ACL Checked, Anywhere, Anytime.
          </h1>
          <p
            className={`text-base md:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-md`}
          >
            Start Your Journey to Knee Recovery with Expert ACL Care. Discover
            Your Path to Healing Today!
          </p>
          {/* <Button className="bg-buttonColor text-white hover:bg-darkBlue pr-6 md:pr-10 py-2 md:py-3">
            Lets Get Started →
          </Button> */}
          <HoverBorderGradientDemo button="  Lets Get Started →" />
        </div>
        <div className="mt-8 md:mt-0 -mr-0 md:-mr-16">
          {" "}
          {/* Adjust margin for image on mobile */}
          <Image
            src={isDarkMode ? forDarkLandingPage : landingPage} // Conditionally switch images
            width={350} // Adjust width for mobile
            height={280} // Adjust height for mobile
            alt="Soccer player"
            className={`rounded-bl-[8rem] md:rounded-bl-[14rem] object-cover ${
              isDarkMode ? "bg-[#293A5B]" : "bg-gray-200"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
