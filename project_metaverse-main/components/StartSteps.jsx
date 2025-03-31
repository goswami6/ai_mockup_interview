"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "../styles";

const StartSteps = ({ number, text }) => {
  const stepRef = useRef(null);

  useEffect(() => {
    const stepElement = stepRef.current;
    
    // GSAP Neon Glow Animation
    gsap.fromTo(
      stepElement,
      { boxShadow: "0px 0px 5px rgba(0, 255, 255, 0.3)" },
      {
        boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.8), 0px 0px 40px rgba(0, 255, 255, 0.6)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );
  }, []);

  return (
    <div ref={stepRef} className={`${styles.flexCenter} flex-row transition-all`}>
      {/* Glowing Number Box */}
      <div
        className={`${styles.flexCenter} w-[70px] h-[70px] rounded-[24px] text-white `}
      >
        <p className="font-bold text-[20px]">{number}</p>
      </div>

      {/* Text */}
      <p className="flex-1 ml-[30px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]">
        {text}
      </p>
    </div>
  );
};

export default StartSteps;

