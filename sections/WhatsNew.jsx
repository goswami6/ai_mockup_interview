'use client';

import styles from '../styles';
import { newFeatures } from '../constants';
import { NewFeatures, TitleText, TypingText } from '../components/';

import PixelCard from './PixelCard';
import TechGrid from "./TechGrid";

const WhatsNew = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}>
      {/* Left Section - What's New */}
      <div className="flex-[0.95] flex justify-center flex-col">
        <TypingText title="| Whats new?" />
        <TitleText title={<>AI-Powered Online Interviews</>} />
        <div className="mt-[48px] flex flex-wrap justify-between gap-[24px]">
          {newFeatures.map((feature) => (
            <NewFeatures key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Right Section - TechGrid */}
      <div className="flex-1 flex justify-center">
        <TechGrid />
      </div>
    </div>
  </section>
);

export default WhatsNew;
