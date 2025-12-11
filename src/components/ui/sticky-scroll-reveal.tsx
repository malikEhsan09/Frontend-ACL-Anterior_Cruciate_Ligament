"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#EEE8E8FF", // Light greyish background
    "#e0e0e0", // Slightly darker grey
    "#d3d3d3", // Another shade of grey
  ];

  const iconBoxColors = [
    "#FECACA", // Light red
    "#CFFAFE", // Light cyan
    "#D9F99D", // Light green
    "#FEF3C7", // Light yellow
  ];

  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0]);

  useEffect(() => {
    setBackgroundColor(backgroundColors[activeCard % backgroundColors.length]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColor,
      }}
      className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10 scrollbar"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="flex items-center space-x-4"
              >
                {item.icon && (
                  <div
                    className="text-2xl text-black p-2 rounded-full"
                    style={{
                      backgroundColor:
                        iconBoxColors[index % iconBoxColors.length],
                    }}
                  >
                    {item.icon}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-black">{item.title}</h2>
              </motion.div>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-lg text-black max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ backgroundColor: "#ffffff" }}
        className={cn(
          "hidden lg:block h-60 w-80 rounded-md shadow-md sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};

// Scrollbar styles
const scrollbarStyles = `
  .scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 9999px; /* Fully rounded scrollbar */
  }

  .scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 9999px; /* Fully rounded track */
  }
`;

// Adding the scrollbar styles to the document
if (typeof window !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = scrollbarStyles;
  document.head.appendChild(styleElement);
}
