'use client';

import { TypingText } from '../components/CustomTexts';

import styles from '../styles';

const About = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0" />
    <div className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}>
      <TypingText title="| About Interview Plus" textStyles="text-center" />

      <p className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white">
  <span className="font-extrabold text-white">AI Mock Interviews</span> are the future of job preparation, offering a <span className="font-extrabold text-white">realistic virtual</span> experience.  
  Step into an AI-driven <span className="font-extrabold text-white">VR interview room</span>, practice with intelligent questions, and receive instant feedback to enhance your confidence.  
  Let’s <span className="font-extrabold text-white">explore</span> the next evolution of interview readiness—powered by AI and VR.
</p>


      <img
        src="/arrow-down.svg"
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </div>
  </section>
);

export default About;
