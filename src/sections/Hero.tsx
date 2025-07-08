'use client';

import ArrowIcon from '@/assets/arrow-right.svg'
import cylinderImage from '@/assets/red_cylinder.png';
import noodleImage from '@/assets/red_noodle.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import thumbnailDemo from '@/assets/thumbnail.png';

export const Hero = () => {
  const router = useRouter();
  return <section className='pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_90%_100%_at_bottom_left,#f0484e,#ffffff)] overflow-x-clip'>
    <div className="container">
      <div className='md:flex item-center'>
        <div className='md:w-[478px]'>
          <div className="tag">Coming Soon</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#d32b0e] text-transparent bg-clip-text mt-6">
            Thumbnails That Actually Get Clicks
          </h1>
          <p className="text-xl text-[#3e0d01] tracking-tight mt-6">
          ThumbnailGPT uses AI to break down what works — analyzing your design, highlighting what's missing, and suggesting changes that drive engagement.
          </p>
          <div className="flex gap-1 items-center mt-[30px]">
            <button className="btn btn-primary" onClick={() => router.push('/home')}>Get for free</button>
            <button className="btn btn-text gap-1">
              <span>Learn more</span>
              <ArrowIcon className='h-5 w-5'/>
            </button>
          </div>
        </div>
        <div className='mt-20 md:mt-[-50px] md:h-[648px] md:flex-1 relative'>
          <Image src={thumbnailDemo} alt="Hero Image" className='md:absolute md:h-[550px] md:w-auto md:max-w-none md:-left-6 lg:left-[-20px] top-[-20px]'/>
          <Image 
            src={cylinderImage}
            width={220}
            height={220}
            alt="Cylinder Image"
            className='hidden md:block -top-8 -left-50 md:absolute'></Image>
            <Image
            alt = "Noodle Image"
            src={noodleImage} 
            width={220} 
            className='hidden lg:block absolute top-[450px] left-[500px] rotate-[30deg]'
            />
        </div>
      </div>
    </div>
  </section>;
};


