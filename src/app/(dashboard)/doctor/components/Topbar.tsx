"use client";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Settings, LogOut, User } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TopbarProps {
  className?: string;
  title?: string;
  isSidebarCollapsed?: boolean;
  userImage: string;
}

const Topbar: React.FC<TopbarProps> = ({
  className = "",
  title = "Dashboard",
  isSidebarCollapsed,
  userImage,
}) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");

    if (storedUserName && storedUserEmail) {
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    }
  }, []);

  const handleSettingsDropdownToggle = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8800/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileSettings = () => {
    router.push("/doctor/settings");
  };

  return (
    <header className={`flex items-center justify-between w-full ${className}`}>
      <div className={`flex flex-col items-start`}>
        <a className="text-2xl font-bold">Doctor Dashboard</a>
        <a className="text-md font-semibold text-onHover mt-1">{title}</a>
      </div>

      <div className="flex items-center gap-4 pr-8">
        <div className="flex items-center gap-4 relative">
          <div className="flex flex-col items-start">
            <span className="font-bold">{userName || "Guest"}</span>
            <span className="text-sm text-dark-3-dark">
              {userEmail ? `${userEmail}` : "Not logged in"}
            </span>
          </div>

          <div>
            <Image
              className="h-[2.5rem] w-[2.5rem] rounded-full"
              alt="User Avatar"
              src={userImage}
              width={40}
              height={40}
            />
          </div>

          <div className="relative">
            <Settings
              className="w-[1.5rem] h-[1.5rem] cursor-pointer"
              onClick={handleSettingsDropdownToggle}
            />
            {isSettingsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={handleProfileSettings}
                  >
                    <User className="w-[1.25rem] h-[1.25rem]" /> Profile
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-[1.25rem] h-[1.25rem]" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  isSidebarCollapsed: PropTypes.bool,
  userImage: PropTypes.string.isRequired,
};

export default Topbar;

