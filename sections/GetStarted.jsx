'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { startingFeatures } from '../constants';
import { StartSteps, TitleText, TypingText } from '../components/';
import { staggerContainer, fadeIn, planetVariants } from '../utils/motion';

const GetStarted = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
    >
      <div
       variants={fadeIn('right', 'tween', 0.2, 1)}
        className={`flex-1 ${styles.flexCenter}`}
      >
        <img
          src="/ai.png"
          alt="get-started"
          className="w-[100%] h-[100%] object-contain"
        />
      </div>
      <div
        
        className="flex-[0.75] flex justify-center flex-col"
      >
        <TypingText title="| How Interview Plus Works" />
        <TitleText title={<>Ace Your Interview with AI</>} />
        <div className="mt-[31px] flex flex-col max-w-[370px] gap-[24px]">
          {startingFeatures.map((feature, index) => (
            <StartSteps
              key={feature}
              number={`${index < 10 ? '0' : ''} ${index + 1}`}
              text={feature}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default GetStarted;
