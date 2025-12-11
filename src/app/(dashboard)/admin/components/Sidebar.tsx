// "use client";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Home,
//   Upload,
//   FileText,
//   Activity,
//   Settings,
//   HelpCircle,
//   LogOut,
//   MessageCircleMoreIcon,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import logo from "@/public/assets/logo.svg"; // Assuming you have this

// const Sidebar = ({ onToggle, isCollapsed }) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const toggleSidebar = () => {
//     onToggle(!isCollapsed); // Notify parent component about sidebar toggle
//   };

//   const handleNavigation = (path) => {
//     router.push(path); // Navigate to the desired path
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:8800/api/auth/signout", {
//         method: "GET",
//         credentials: "include", // Make sure cookies are sent with the request
//       });
//       localStorage.removeItem("access_token"); // Assuming JWT token is stored in localStorage
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userEmail");
//       router.push("/login");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         onToggle(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [onToggle]);

//   return (
//     <div className="relative">
//       {/* Sidebar */}
//       <div
//         className={`fixed z-50 top-0 left-0 flex flex-col transition-all duration-300 ${
//           isCollapsed ? "w-16" : "w-48"
//         } bg-sidebar h-screen overflow-hidden`}
//       >
//         {/* Sidebar Top - Logo */}
//         <div className="flex flex-col justify-center items-center px-4 py-3">
//           <div className="text-white">
//             <Image
//               src={logo}
//               alt="ACL Tear Detector Logo"
//               width={isCollapsed ? 40 : 60}
//               height={isCollapsed ? 40 : 60}
//               className="rounded-full"
//               objectFit="contain"
//             />
//           </div>
//           {!isCollapsed && (
//             <div className="text-white text-center mt-2 text-sm font-semibold">
//               ACL Tear Detector
//             </div>
//           )}
//         </div>

//         {/* Sidebar Menu Items */}
//         <div className="flex-1 flex flex-col">
//           <SidebarItem
//             icon={<Home size={isCollapsed ? 20 : 18} />}
//             name="Dashboard"
//             path="/player"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player")}
//             isActive={pathname === "/player"}
//           />
//           <SidebarItem
//             icon={<Upload size={isCollapsed ? 20 : 18} />}
//             name="Upload MRI's"
//             path="/player/uploadMri"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/uploadMri")}
//             isActive={pathname === "/player/uploadMri"}
//           />
//           <SidebarItem
//             icon={<FileText size={isCollapsed ? 20 : 18} />}
//             name="Results"
//             path="/player/results"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/results")}
//             isActive={pathname === "/player/results"}
//           />
//           <SidebarItem
//             icon={<Activity size={isCollapsed ? 20 : 18} />}
//             name="Exercise"
//             path="/player/exercises"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/exercises")}
//             isActive={pathname === "/player/exercises"}
//           />
//           <SidebarItem
//             icon={<Settings size={isCollapsed ? 20 : 18} />}
//             name="Settings"
//             path="/player/settings"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/settings")}
//             isActive={pathname === "/player/settings"}
//           />
//           <SidebarItem
//             icon={<HelpCircle size={isCollapsed ? 20 : 18} />}
//             name="Get Help"
//             path="/player/help"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/help")}
//             isActive={pathname === "/player/help"}
//           />
//           <SidebarItem
//             icon={<MessageCircleMoreIcon size={isCollapsed ? 20 : 18} />}
//             name="Feedbacks"
//             path="/player/feedbacks"
//             isCollapsed={isCollapsed}
//             onClick={() => handleNavigation("/player/feedbacks")}
//             isActive={pathname === "/player/feedbacks"}
//           />
//         </div>

//         {/* Sidebar Bottom - Logout */}
//         <div className="mt-auto p-4">
//           <SidebarItem
//             icon={<LogOut size={isCollapsed ? 20 : 18} />}
//             name="Logout"
//             path="/logout"
//             isCollapsed={isCollapsed}
//             onClick={handleLogout}
//             isActive={pathname === "/logout"}
//           />
//         </div>
//       </div>

//       {/* Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className={`fixed top-[4rem] -translate-y-1/2 transition-all duration-300 bg-sidebar text-white border-2 rounded-md z-50 flex items-center justify-center w-8 h-8`}
//         style={{
//           left: isCollapsed ? "43px" : "190px",
//           transform: "translateY(-50%)",
//         }}
//       >
//         {isCollapsed ? (
//           <ChevronRight size={10} className="cursor-pointer " />
//         ) : (
//           <ChevronLeft size={18} className="cursor-pointer" />
//         )}
//       </button>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, name, isCollapsed, onClick, isActive }) => {
//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <div
//       className={`flex items-center p-4 transition-all duration-300 ${
//         isCollapsed ? "justify-center" : "justify-start"
//       } text-white relative group rounded-lg cursor-pointer ${
//         isActive ? "bg-onHover" : "hover:bg-onHover"
//       }`}
//       onClick={onClick}
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       <div>{icon}</div>
//       {!isCollapsed && <span className="ml-4 text-sm">{name}</span>}
//       {/* Tooltip for collapsed state */}
//       {isCollapsed && showTooltip && (
//         <div
//           className="absolute left-[70px] top-1/2 transform -translate-y-1/2 w-auto p-2 rounded bg-gray-800 text-white shadow-lg z-50"
//           style={{ whiteSpace: "nowrap" }}
//         >
//           <div className="flex items-center">
//             {icon}
//             <span className="ml-2">{name}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

"use client";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  Wrench,
  BarChart,
  AlertCircle,
  LayoutDashboard,
  Dumbbell,
  ScanEye
} from "lucide-react"; // Importing icons from lucide-react
import { FaUserDoctor } from "react-icons/fa6";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "@/public/assets/logo.svg"; // Closed sidebar logo
// import sidebarOpenLogo from "@/public/assets/sidebarLogoOpen.svg"; // Open sidebar logo
import "./sidebar.css";
import { PiSoccerBallFill } from "react-icons/pi";
import { GiSoccerKick } from "react-icons/gi";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed: initialCollapsed = false, onToggle }:SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);


  // Toggle collapse state
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed); // Toggle the collapse state
    onToggle(newCollapsed); // Inform parent layout of sidebar collapse state
  };

  const handleNavigation = (path : string) => {
    router.push(path); // Navigate to the chosen path
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

  useEffect(() => {
    // Automatically collapse the sidebar on smaller screens
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true); // Collapse the sidebar on small screens
      } else {
        setIsCollapsed(false); // Expand the sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to check window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/admin/" },
    { name: "Exercises", icon: <Dumbbell />, path: "/admin/exercises" },
    { name: "Admins", icon: <Users />, path: "/admin/admins" },
    { name: "Settings", icon: <Wrench />, path: "/admin/settings" },
    { name: "Players", icon: <GiSoccerKick size={26}  fontSize={22}/>, path: "/admin/players" },
    { name: "Clubs", icon: < PiSoccerBallFill size={22} />, path: "/admin/clubs" },
    { name: "Doctor", icon: <FaUserDoctor size={22} />, path: "/admin/doctors" },
    { name: "Reviews", icon: <ScanEye />, path: "/admin/reviews" },
    { name: "Statistics", icon: <BarChart />, path: "/admin/statistics" },
    { name: "Complaints", icon: <AlertCircle />, path: "/admin/complaints" },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-48"
        } bg-sidebar h-screen overflow-hidden`}
      >
        {/* Sidebar Top - Logo */}
        <div className="flex flex-col justify-center items-center px-4 py-3">
          <div className="text-white">
            <Image
              src={logo}
              alt="ACL Tear Detector Logo"
              width={isCollapsed ? 40 : 60}
              height={isCollapsed ? 40 : 60}
              className="rounded-full"
              objectFit="contain"
            />
          </div>
          {!isCollapsed && (
            <div className="text-white text-center mt-2 text-sm font-semibold">
              ACL Tear Detector
            </div>
          )}
        </div>
        {/* Sidebar Menu Items */}
        <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation(item.path)}
              isActive={pathname === item.path} // Check if the current path matches the menu item path
            />
          ))}
        </div>

        {/* Sidebar Bottom - Logout */}
        <div className="mt-auto p-4">
          <SidebarItem
            icon={<LogOut />}
            name="Logout"
            isCollapsed={isCollapsed}
            onClick={handleLogout}
            isActive={pathname === "/logout"}
          />
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-[4rem] transition-all duration-300 bg-sidebar text-white border-white border-2 rounded-md z-50 flex items-center justify-center w-8 h-8"
        style={{
          left: isCollapsed ? "43px" : "190px",
          transform: "translateY(-50%)",
        }}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  name: string;
  isCollapsed: boolean;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ icon, name, isCollapsed, onClick, isActive }: SidebarItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`flex items-center p-4 transition-all duration-300 ${
        isCollapsed ? "justify-center" : "justify-start"
      } relative group rounded-lg cursor-pointer ${
        isActive ? "bg-[#41608F]" : "hover:bg-onHover" // Change color to active color (e.g., #41608F) for active state and hover color for non-active
      } text-white`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div>{icon}</div>
      {!isCollapsed && <span className="ml-4 text-sm">{name}</span>}
      {isCollapsed && showTooltip && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-auto p-2 ml-2 rounded bg-gray-800 text-white transition-opacity duration-300 shadow-lg z-50">
          {name}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
