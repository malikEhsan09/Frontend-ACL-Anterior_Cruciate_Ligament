// "use client";

// import { useContext, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { Sun, Moon, Menu, X } from "lucide-react";
// import { ThemeContext } from "@/app/context/ThemeContext";
// import logo from "@/public/assets/logo.svg";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const { isDarkMode, toggleTheme } = useContext(ThemeContext);
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       const offset = window.scrollY;
//       setIsScrolled(offset > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const scrollToSection = (id: string) => {
//     document.getElementById(id)?.scrollIntoView({
//       behavior: "smooth",
//     });
//     setIsOpen(false); // Close mobile menu
//   };

//   return (
//     <header
//       className={`fixed top-0 left-0 w-full z-50 ${
//         isScrolled
//           ? isDarkMode
//             ? "bg-[#12182A]"
//             : "bg-gray-100"
//           : "bg-transparent"
//       } transition-colors duration-300`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Image
//               src={logo}
//               alt="Logo"
//               width={35}
//               height={35}
//               className="object-contain"
//             />
//             <h1
//               className={`text-lg font-bold ${
//                 isDarkMode ? "text-white" : "text-boldTextColor"
//               }`}
//             >
//               ACL TEAR DETECTOR
//             </h1>
//           </div>

//           {/* Nav Buttons for Desktop */}
//           <nav className="hidden md:flex space-x-4">
//             {["hero", "services", "team", "contact"].map((section, index) => (
//               <button
//                 key={index}
//                 className={`relative px-3 py-2 rounded-md text-md font-medium ${
//                   isDarkMode ? "text-white" : "text-semiTextColor"
//                 } transition-all duration-300 ease-in
//                 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-buttonColor after:transition-all after:duration-500 after:ease-in-out hover:after:w-full hover:after:h-[3px] hover:after:bg-buttonColor after:w-0`}
//                 onClick={() => scrollToSection(section)}
//               >
//                 {section === "hero"
//                   ? "Home"
//                   : section.charAt(0).toUpperCase() + section.slice(1)}
//               </button>
//             ))}
//           </nav>

//           {/* Right Side - Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Button
//               onClick={toggleTheme}
//               className="p-2 rounded-full bg-buttonColor text-white hover:bg-[#3c548a]"
//             >
//               {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
//             </Button>
//             <Button
//               variant="ghost"
//               onClick={() => router.push("/login")}
//               className={`px-3 py-2 rounded-md text-sm font-medium ${
//                 isDarkMode
//                   ? "text-white hover:bg-buttonColor"
//                   : "text-black hover:bg-buttonColor hover:text-white"
//               }`}
//             >
//               Log in
//             </Button>
//             <Button
//               onClick={() => router.push("/signup")}
//               className="px-3 py-2 bg-buttonColor text-white rounded-md hover:bg-[#3c548a] text-sm font-medium"
//             >
//               Sign Up
//             </Button>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="md:hidden">
//             <Button
//               onClick={() => setIsOpen(!isOpen)}
//               variant="ghost"
//               size="icon"
//               className={isDarkMode ? "text-white" : "text-[#28375B]"}
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div
//           className={`md:hidden ${isDarkMode ? "bg-[#12182A]" : "bg-gray-100"}`}
//         >
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <button
//               className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
//                 isDarkMode ? "text-white" : "text-buttonColor"
//               }`}
//               onClick={() => scrollToSection("hero")}
//             >
//               Home
//             </button>
//             <button
//               className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
//                 isDarkMode ? "text-white" : "text-buttonColor"
//               }`}
//               onClick={() => scrollToSection("services")}
//             >
//               Services
//             </button>
//             <button
//               className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
//                 isDarkMode ? "text-white" : "text-buttonColor"
//               }`}
//               onClick={() => scrollToSection("team")}
//             >
//               Our Team
//             </button>
//             <button
//               className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
//                 isDarkMode ? "text-white" : "text-buttonColor"
//               }`}
//               onClick={() => scrollToSection("contact")}
//             >
//               Contact Us
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

"use client";

import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/assets/logo.svg";
import { ThemeContext } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed w-auto transition-all duration-300 left-4 ${
        isVisible ? "top-4" : "-top-24"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-background/80 backdrop-blur-md border rounded-full shadow-lg ${
            isDarkMode ? "bg-[#12182A]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src={logo}
                  alt="ACL Tear Detector Logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 mr-3 rounded-md"
                />
                <span
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  ACL Tear Detector
                </span>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-3">
                {[
                  { name: "Services", id: "services" },
                  { name: "Contact Us", id: "contact" },
                  { name: "Teams", id: "team" },
                  { name: "Modules", id: "modules" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 text-sm font-medium relative group rounded-full ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute inset-0 bg-accent/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                    <span className="absolute inset-0 border border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-2 rounded-full hover:bg-accent/20 hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 rounded-full"
                onClick={() => router.push("/signup")}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                <span className="text-sm">Sign Up</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 rounded-full"
                onClick={() => router.push("/login")}
              >
                <LogIn className="h-4 w-4 mr-1" />
                <span className="text-sm">Login</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
