'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';


const InsightCard = ({ imgUrl, title, subtitle, index }) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.5, 1)}
    className="flex md:flex-row flex-col gap-4"
  >
    {/* Video with Neon Glow */}
    <motion.div
      className="relative rounded-[32px] overflow-hidden"
      whileHover={{ boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.8)" }}
    >
      <video
  src={imgUrl}
  className="md:w-[350px] w-full h-[250px] rounded-[32px] object-cover border-4 border-cyan-400 shadow-[0px_0px_15px_rgba(0,255,255,0.8)]"
  autoPlay
  loop
  muted
  preload="auto"  // or "metadata" for lighter loading
/>

      {/* Outer glowing neon effect */}
      <div className="absolute inset-0 rounded-[32px] border-[3px] border-cyan-400 animate-glow"></div>
    </motion.div>

    {/* Content Section */}
    <div className="w-full flex justify-between items-center">
      <div className="flex-1 md:ml-[62px] flex flex-col max-w-[650px]">
        <h4 className="font-normal lg:text-[42px] text-[26px] text-white">
          {title}
        </h4>
        <p className="mt-[16px] font-normal lg:text-[20px] text-[14px] text-secondary-white">
          {subtitle}
        </p>
      </div>

      {/* Arrow Icon */}
      <div
        className="lg:flex hidden items-center justify-center w-[100px] h-[100px] rounded-full bg-transparent border-[1px] border-white"
      >
        <img
          src="/arrow.svg"
          alt="arrow"
          className="w-[40%] h-[40%] object-contain"
        />
      </div>
    </div>
  </motion.div>
);

export default InsightCard;
