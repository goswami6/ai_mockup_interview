"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GradientCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      animate={{
        background: `radial-gradient(circle 300px at ${position.x}px ${position.y}px, rgba(255, 0, 150, 0.5), rgba(0, 0, 0, 0))`,
        filter: `drop-shadow(0px 0px 15px rgba(255, 0, 150, 0.5))`,
      }}
      transition={{ ease: "linear", duration: 0.1 }}
    />
  );
};

export default GradientCursor;
