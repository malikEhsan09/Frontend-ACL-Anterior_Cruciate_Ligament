// pages/team.js
import { Instagram, Github, Mail, Linkedin } from "lucide-react";
import Image from "next/image";
import ehsanImage from "@/public/assets/ehsan1.jpg"; // Replace with actual Ehsan image
import moizImage from "@/public/assets/moiz.jpg"; // Replace with actual Moiz image

const teamMembers = [
  {
    name: "Ehsan Ahmed",
    role: "Full Stack Developer",
    image: ehsanImage,
    bio: "Crafting pixels with purpose, code that dances, and experiences that captivate. Web development is where creativity meets interactivity.",
    links: [
      {
        url: "https://www.instagram.com/",
        icon: <Instagram />,
        alt: "Instagram",
      },
      { url: "https://github.com/", icon: <Github />, alt: "GitHub" },
      { url: "mailto:example@example.com", icon: <Mail />, alt: "Email" },
      {
        url: "https://www.linkedin.com/",
        icon: <Linkedin />,
        alt: "LinkedIn",
      },
    ],
  },
  {
    name: "Abdul Moiz",
    role: "Android Developer",
    image: moizImage,
    bio: "From lines of code to touches of magic, Android development blends innovation and user delight into small, yet impactful experiences.",
    links: [
      {
        url: "https://www.instagram.com/",
        icon: <Instagram />,
        alt: "Instagram",
      },
      { url: "https://github.com/", icon: <Github />, alt: "GitHub" },
      { url: "mailto:example@example.com", icon: <Mail />, alt: "Email" },
      {
        url: "https://www.linkedin.com/",
        icon: <Linkedin />,
        alt: "LinkedIn",
      },
    ],
  },
];

export default function Team() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4" id="team">
      <div className="text-center mb-16">
        <div className="text-4xl font-bold text-boldTextColor mb-4">
          Our Team
        </div>
        <div className="text-lg text-gray-600">
          Precision ACL Detection for Enhance Utilize our state-of-the-art web
          application to swiftly identify anterior cruciate ligament (ACL)
          injuries with unparalleled accuracy.
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="w-80 h-[550px] mx-4 mb-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
          >
            <div className="relative group h-full">
              <div className="absolute top-[-32px] right-[-12px] w-10 h-28 border-4 border-dotted border-blue-900 rounded-full group-hover:rotate-[-15deg] transition-transform duration-500"></div>

              {/* Image container */}
              <div className="relative w-full h-3/5 overflow-hidden rounded-t-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full object-top" // Ensure the head is visible
                />
              </div>

              {/* Card content */}
              <div className="p-4 bg-buttonColor rounded-md h-2/5 flex flex-col justify-between">
                <div>
                  <div className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </div>
                  <div className="text-lg text-white mb-2">{member.role}</div>

                  {/* Bio with double quotes */}
                  <div className="text-sm text-white mb-2 relative">
                    {/* Left Quote */}
                    <span className="absolute left-0 top-0 text-4xl text-gray-300 -translate-x-3 -translate-y-4">
                      “
                    </span>
                    {member.bio}
                    {/* Right Quote */}
                    <span className="absolute right-0 bottom-0 text-4xl text-gray-300 translate-x-3 translate-y-4">
                      ”
                    </span>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex justify-center space-x-4">
                  {member.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.alt}
                    >
                      <span className="text-2xl text-gray-400 hover:text-white transition-colors duration-300">
                        {link.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
