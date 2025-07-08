"use client"

import productImage from '@/assets/product-image.png';
import Image from 'next/image';
import tubeImage from "@/assets/tube.png"
import pyramidImage from '@/assets/pyramid.png';
import dudePerfect from "@/assets/thumbnail-demo4.jpg"
import imanGhadzi from "@/assets/thumbnail-demo3.jpg"
import nickDigiovanni from "@/assets/thumbnail-demo2.jpg"
import dollar from "@/assets/thumbnail-demo.jpg"
import React, { useEffect, useRef } from 'react';

export const ProductShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const row = scrollContainer.firstElementChild as HTMLDivElement;
    if (!row) return;
    const rowWidth = row.scrollWidth / 2;
    let scrollAmount = 0;
    const speed = 1; // pixels per frame

    const animate = () => {
      scrollAmount += speed;
      if (scrollAmount >= rowWidth) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const logos = [
  dudePerfect,
  imanGhadzi,
  nickDigiovanni,
  dollar,
  dudePerfect,
  imanGhadzi,
  nickDigiovanni,
  dollar
  ];

  return (
    <section className='bg-gradient-to-b from-[#ffffff] to-[rgb(255,239,239)] py-24 overflow-x-clip'>
      <div className="w-full">
        <div className='max-w-[540px] mx-auto'>
          <div className='flex justify-center'>
            <div className='tag'>Boost your productivity</div>
          </div>
          <h2 className='section-title mt-5'>
            World's Only Free Thumbnail Assistant</h2>
          <p className='text-xl w-full px-[30px] section-description mt-5'>
            Effortlessly turn raw designs into high-performing YouTube thumbnails with instant, AI-driven feedback. Whether you're optimizing for CTR, clarity, or clickability — ThumbnailGPT gives you actionable insights, right when you need them.
          </p>
          <p className='text-sm w-full px-[30px] section-description text-gray-600 italic mt-5'>
            Some Great Thumbnails Are Shown Below
          </p>
        </div>
        <div id="scroll" ref={scrollRef} className='mt-10 mx-auto max-w-[1500px] overflow-x-auto whitespace-nowrap scrollbar-hide [mask-image:linear-gradient(to_right,transparent,black,black,black,transparent)]' style={{scrollBehavior: 'auto'}}>
          <div className='flex gap-10 flex-row min-w-max'>
            {/* Images duplicated for seamless loop */}
            {logos.map((logo, index) => (
              <Image key={index} src={logo} alt="Thumbnail" className="logo-ticker-image" />
            ))}
          </div>
        </div>
        {/*
        <div className='relative'>
          <Image src={productImage} alt="Product Image" className="mt-10" />
          <Image src={pyramidImage} alt="Pyramid Image" className="hidden md:block absolute -right-36 -top-32" width={262} height={262} />
          <Image src={tubeImage} alt = "Tube Image" height={248} className='hidden md:block absolute bottom-24 -left-36'/>
        </div>
        */}
      </div>
    </section>
  );
};
