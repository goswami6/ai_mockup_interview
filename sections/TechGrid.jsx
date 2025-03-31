"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import PixelCard from "./PixelCard"; 

const techItems = [
  { name: "Java", icon: "/icons/java.svg" },
  { name: "HTML", icon: "/icons/html.svg" },
  { name: "JavaScript", icon: "/icons/js.svg" },
  { name: "Vue.js", icon: "/icons/vue.svg" },
  { name: "Python", icon: "/icons/python.svg" },
  { name: "React", icon: "/icons/react.svg" },
  { name: "Next.js", icon: "/icons/nextjs.svg" },
];

const TechGrid = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    // Neon glow effect on each tech card
    gsap.fromTo(
      ".tech-card",
      { boxShadow: "0px 0px 0px rgba(0, 255, 255, 0.0)" },
      {
        boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      }
    );

    // Animated neon border effect on the outer container
    gsap.to(".neon-border", {
      backgroundPosition: "200% 0%",
      repeat: -1,
      duration: 5,
      ease: "linear",
    });
  }, []);

  return (
    <div className="relative">
      {/* PixelCard as Background */}
      <div className="absolute inset-0 -z-10 rounded-3xl border-4 border-transparent before:absolute before:inset-0 before:rounded-3xl before:border-[3px] before:border-cyan-400 before:animate-glow"></div>
      
      <div className=" inset-0 z-0">
        <PixelCard variant="pink" className="w-full h-full">
          <div
            ref={gridRef}
            className="grid grid-cols-3 md:grid-cols-3 gap-8 relative p-10 rounded-3xl bg-black/30 border border-gray-600 shadow-lg z-10 
                      before:absolute before:inset-0 before:rounded-3xl before:border-[3px] before:border-cyan-400 before:animate-glow"
          >
            {techItems.map((item, index) => (
              <motion.div
                key={index}
                className="tech-card relative flex flex-col justify-center items-center w-28 h-28 md:w-32 md:h-32 bg-white/10 border border-white rounded-xl transition-all overflow-hidden z-10"
                whileHover={{
                  scale: 1.1,
                  filter: "drop-shadow(0px 0px 15px rgba(0, 255, 255, 0.9))",
                }}
              >
                {/* Inner glowing border effect */}
                <div className="absolute inset-0 border-2 border-transparent rounded-xl tech-inner-border"></div>

                {/* SVG Icon with Neon Glow */}
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain filter drop-shadow-[0px_0px_8px_rgba(0,255,255,0.7)]"
                  loading="lazy"
                />
                
                <p className="mt-3 text-white text-sm font-semibold">{item.name}</p>
              </motion.div>
            ))}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default TechGrid;
