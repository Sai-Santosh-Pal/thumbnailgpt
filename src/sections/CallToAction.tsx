'use client';

import ArrowRight from "@/assets/arrow-right.svg"
import starImage from "@/assets/red_star.png"
import springImage from "@/assets/red_spring.png"
import Image from "next/image";
import { useRouter } from 'next/navigation';

export const CallToAction = () => {
  const router = useRouter();
  return <section className="bg-gradient-to-b from-[#ffffff] to-[rgb(255,239,239)] py-24 overflow-x-clip">
    <div className="container">
      <div className="section-heading text-center font-medium text-xl relative">
        <h2 className="section-title">Sign up for free today</h2>
        <p className="section-descrption mt-5">
          Celebrate the joy of accomplishment with an app designed to track your 
          progress and motivate your efforts.
        </p>
        <Image 
          src={starImage} 
          alt="Star Image" 
          width={360} 
          className="absolute -left-[350px] -top-[137px] hidden md:flex" 
        />
        <Image 
          src={springImage} 
          alt="Spring Image"
          width={360}
          className="absolute -right-[331px] -top-[19px] hidden md:flex"
        />
      </div>
      <div className="flex gap-2 mt-10 justify-center">
        <button className="btn btn-primary" onClick={() => router.push('/home')}>Get for free</button>
        <button className="btn btn-text gap-1">
          <span>Learn more</span>
          <ArrowRight className="h-5 w-5"/>
        </button>
      </div>
    </div>
  </section>;
};
