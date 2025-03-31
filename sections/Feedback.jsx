'use client';

import styles from '../styles';

const Feedback = () => (
  <section className={`${styles.paddings}`}>
    <div className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-6`}>
    <div className="flex-[0.5] lg:max-w-[370px] flex justify-end flex-col gradient-05 sm:p-8 p-4 rounded-[32px] border-[1px] border-[#6A6A6A] relative">
  <div className="feedback-gradient" />
  <div>
    <h4 className="font-bold sm:text-[32px] text-[26px] sm:leading-[40.32px] leading-[36.32px] text-white">
      Interview Plus
    </h4>
    <p className="mt-[8px] font-normal sm:text-[18px] text-[12px] sm:leading-[22.68px] leading-[16.68px] text-white">
      AI Researcher & Developer
    </p>
  </div>

  <p className="mt-[24px] font-normal sm:text-[24px] text-[18px] sm:leading-[45.6px] leading-[39.6px] text-white">
    “AI-driven technology is transforming the way we code and learn. With interactive simulations and real-time feedback, 
    the future of coding is more immersive than ever.”
  </p>
</div>


      <div className="relative flex-1 flex justify-center items-center">
        <video
          src="/next-gen.webm" // Replace with your actual video file path
          autoPlay
          loop
          muted
          className="w-full lg:h-[610px] h-auto min-h-[210px] object-cover rounded-[40px]"
        />

        <div className="lg:block hidden absolute -left-[10%] top-[3%]">
          <img
            src="/stamp.png"
            alt="stamp"
            className="w-[155px] h-[155px] object-contain"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Feedback;
