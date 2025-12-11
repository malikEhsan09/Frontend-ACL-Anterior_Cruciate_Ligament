"use client";

import { useEffect, useRef } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animationClass: string;
}

export default function AnimateOnScroll({ children, animationClass }: AnimateOnScrollProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [animationClass]);

  return (
    <div
      ref={elementRef}
      className="opacity-0 transition-opacity duration-1000"
    >
      {children}
    </div>
  );
}
