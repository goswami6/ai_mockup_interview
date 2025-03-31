"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import styles from "../styles";

// Register GSAP Plugin
gsap.registerPlugin(MotionPathPlugin);

const NewFeatures = ({ imgUrl, title, subtitle }) => {
  const tailContainer = useRef(null);
  const mainDotRef = useRef(null);

  useEffect(() => {
    const numTrails = 10; // Number of trailing dots
    const trails = [];

    // Create trailing dots dynamically
    for (let i = 0; i < numTrails; i++) {
      const trail = document.createElement("div");
      trail.classList.add("trail");
      tailContainer.current.appendChild(trail);

      gsap.set(trail, {
        position: "absolute",
        width: "12px",
        height: "12px",
        left: "95%",
        backgroundColor: `rgba(19, 195, 173, ${1 - i * 0.1})`, // Fading transparency
        borderRadius: "50%",
        scale: 1 - i / numTrails, // Decreasing size
        transformOrigin: "center",
        filter: "blur(4px)",
      });

      trails.push(trail);
    }

    // Motion path for the main dot
    gsap.to(mainDotRef.current, {
      motionPath: {
        path: "M 35 0 A 35 35 0 1 1 -35 0 A 35 35 0 1 1 35 0", // Circular path
        align: mainDotRef.current,
        autoRotate: true,
      },
      duration: 2,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Motion path for trailing dots
    trails.forEach((trail, i) => {
      gsap.to(trail, {
        motionPath: {
          path: "M 35 0 A 35 35 0 1 1 -35 0 A 35 35 0 1 1 35 0", // Circular path
          align: trail,
          autoRotate: true,
        },
        duration: 2,
        repeat: -1,
        ease: "power1.inOut",
        delay: i * 0.05, // Delay for trailing effect
      });
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col sm:max-w-[250px] min-w-[210px] relative">
      {/* Circular Neon Tail */}
      <div className="relative w-[70px] h-[70px] flex items-center justify-center">
        {/* Tail Container */}
        <div  className="absolute w-full h-full"></div>

        {/* Moving Main Dot */}
        {/* <div
          ref={mainDotRef}
          className="absolute w-[12px] h-[12px] bg-cyan-400 rounded-full"
        /> */}

        {/* Circular Border */}
        <div className="w-full h-full border-[2px] border-cyan-400 rounded-full flex items-center justify-center" ref={tailContainer}>
          <img src={imgUrl} alt="icon" className="w-1/2 h-1/2 object-contain" />
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-[26px] font-bold text-[24px] leading-[30.24px] text-white">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="flex-1 mt-[16px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]">
        {subtitle}
      </p>
    </div>
  );
};

export default NewFeatures;
