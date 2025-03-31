"use client";

import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import styles from "../styles";
import PixelCard from "./PixelCard"; // Import PixelCard component
import Image from "next/image"; // Import Image for optimization
import headerBg from "../public/header-bg.png"; // Import the uploaded image

const Hero = () => {
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance("Hello! How can I assist you?");
      utterance.lang = "en-US";
      utterance.rate = 1.2;
      utterance.pitch = 1;
      setSpeech(utterance);
    }
  }, []);

  const handleSpeak = () => {
    if (speech) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <section className={`${styles.yPaddings} sm:pl-16 pl-6 mt-16 relative bg-cover bg-center z-0`}>
      {/* Top Background Image */}
      <div className="absolute top-0 left-0 w-full h-[200px] md:h-[300px] lg:h-[350px] z-[-1]">
        <Image src={headerBg} alt="Header Background" layout="fill" objectFit="cover" priority/>
      </div>

      <div className={`${styles.innerWidth} mx-auto flex flex-col`}>
        {/* Text Heading */}
        <div className="flex justify-center items-center flex-col relative z-10">
          <h1 className={styles.heroHeading}>Interview</h1>
          <div className="flex flex-row justify-center items-center">
            <h1 className={styles.heroHeading}>Pl</h1>
            {/* <div className={styles.heroDText} /> */}
            <h1 className={styles.heroHeading}>us</h1>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="relative w-full md:-mt-[20px] -mt-[12px]">
          <div className="absolute w-full h-[350px] hero-gradient rounded-tl-[140px] z-[0] -top-[30px]"></div>
        </div>

        {/* Model Section with PixelCard Background */}
        <div className="h-screen z-[10] -top-[30px] flex justify-center items-center relative">
          {/* Spline Model with Border */}
          <div className="relative w-[80%] h-[80%] p-4 border-[3px] border-[#0ff] rounded-3xl shadow-lg shadow-cyan-500/50 bg-black/100">
            <PixelCard variant="pink" className="cover">
              <div className="absolute inset-0 w-full h-full flex items-center justify-center text-white text-lg">
                <Spline
                  scene="https://prod.spline.design/lJmAaOmF2NCRogyl/scene.splinecode"
                  onMouseEnter={handleSpeak} // Speak when hovered
                  />
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
