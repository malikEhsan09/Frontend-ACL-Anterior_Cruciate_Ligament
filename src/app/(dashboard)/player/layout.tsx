"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatBot from "./components/ChatBot";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

interface PlayerLayoutProps {
  children: React.ReactElement<{
    onUpdateProfileImage: (newImageUrl: string) => void;
  }>;
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "http://res.cloudinary.com/dr5p2iear/image/upload/v1720626597/di9grffkw7ltgikaiper.jpg"
  );
  const [imageUpdated, setImageUpdated] = useState(false);

  const pathname = usePathname();

  // Fetch player data from the API
  const fetchPlayerData = async () => {
    const userId = localStorage.getItem("userId")?.trim();
    const authToken = localStorage.getItem("authToken");

    if (!userId || !authToken) {
      console.error("User ID or Auth token is missing.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${authToken}`);

    try {
      const response = await fetch(
        `http://localhost:8800/api/player/${userId}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Fetched Profile Data:", result);

        // Update the state with the fetched profile image and user name
        setProfileImage(
          result.image ||
            "http://res.cloudinary.com/dr5p2iear/image/upload/v1720626597/di9grffkw7ltgikaiper.jpg"
        );
        // setUserName(result.firstName + " " + result.lastName);
      } else {
        console.error("Failed to fetch player data", response.status);
      }
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const updateProfileImage = (newImageUrl: string) => {
    setProfileImage(newImageUrl);
    setImageUpdated(true);
  };

  useEffect(() => {
    if (imageUpdated) {
      // Ensure the profile image is updated in the Topbar when the image is updated in settings
      fetchPlayerData(); // Refetch the player data after the image is updated
      setImageUpdated(false); // Reset the update state
    }
  }, [imageUpdated]);

  const getTitle = () => {
    switch (pathname) {
      case "/player/uploadMri":
        return "Upload MRI";
      case "/player/results":
        return "Results";
      case "/player/exercises":
        return "Exercises";
      case "/player/help":
        return "Help";
      case "/player/feedbacks":
        return "Feedbacks";
      case "/player/settings":
        return "Settings";
      case "/player/payment":
        return "Payments";
      case "/player/bookAppointment":
        return "Book Appointment";
        // case "/player/complaints":
        //   return "Complaints";
      default:
        return "Dashboard";
    }
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className={inter.className}>
      <div className="flex overflow-x-hidden h-screen">
        {/* Sidebar */}
        <Sidebar onToggle={handleSidebarToggle} isCollapsed={isCollapsed} />

        {/* Main Content */}
        <div
          className={`flex-1 mt-4 min-h-screen transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-52"
          }`} // Adjust left margin dynamically
        >
          {/* Topbar */}
          <div className={`pt-4 ml-7`}>
            <Topbar
              title={getTitle()}
              isSidebarCollapsed={isCollapsed}
              userImage={profileImage} // Pass the updated profile image to the Topbar
            />
          </div>

          {/* Main content */}
          <main className="py-6 px-4">
            {React.isValidElement(children)
              ? React.cloneElement(children, {
                  onUpdateProfileImage: updateProfileImage, // Pass the updateProfileImage function to children
                })
              : children}
            <ChatBot />
          </main>
        </div>
      </div>
    </div>
  );
}
