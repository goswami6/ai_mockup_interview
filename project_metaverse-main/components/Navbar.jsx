"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import styles from "../styles";
import { navVariants } from "../utils/motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const path = usePathname(); // Get current path

  // 🔥 Scroll Progress State
  const [scrollWidth, setScrollWidth] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 🔥 Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      // 🔥 Update last scroll position
      setLastScrollY(currentScrollY);

      // 🔥 Update progress bar width
      const scrollProgress =
        (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollWidth(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
    variants={navVariants}
    initial="hidden"
    whileInView="show"
    className={`${styles.xPaddings} fixed top-0 left-0 w-full bg-[#1A232E] transition-transform duration-300 z-50 ${
      showNav ? "translate-y-0" : "-translate-y-full"
    }`}
    >
      {/* 🔥 Background SVG with Gradient Mask */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-80 mix-blend-overlay dark:opacity-100"
        style={{
          backgroundImage: "url('/nav.svg')", // Ensure nav.svg is in public folder
          maskImage:
            "linear-gradient(90deg, rgba(0,0,0,.1) 15%, black 70%, rgba(0,0,0,.1) 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, rgba(0,0,0,.1) 15%, black 70%, rgba(0,0,0,.1) 100%)",
        }}
      ></div>

      <div className={`${styles.innerWidth} mx-auto flex justify-between gap-8 text-white p-4`}>
        {/* Logo */}
        <Image src={"/logo.svg"} width={160} height={100} alt="logo" />

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-6 text-white">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Questions", path: "/questions" },
            { name: "Quiz", path: "/quiz" },
            { name: "Companies", path: "/company" },
            { name: "How it works?", path: "/how" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer block px-4 py-2 ${
                path === link.path ? "text-primary font-bold" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {/* User Button */}
        <UserButton />
      </div>

      {/* 🔥 Scroll Progress Bar at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] ">
        <div
          className="h-full bg-white transition-all "
          style={{ width: `${scrollWidth}%` }}
        ></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
