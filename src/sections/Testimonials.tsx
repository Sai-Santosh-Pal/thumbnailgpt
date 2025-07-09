import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import dummy from "@/assets/dummy.png";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
const testimonials = [
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
  {
    text: "A hopefully good review.",
    imageSrc: dummy.src,
    name: "Hopefully You :)",
    username: "@yourname",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: { className?: string; testimonials: typeof testimonials}) => {
  return (
  <div className={twMerge(
    "flex flex-col gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]", 
    props.className)}>
    {props.testimonials.map(({ text, imageSrc, name, username }) => (
      <div className="card">
        <div>{text}</div>
        <div className="flex items-center gap-2 mt-5">
          <Image src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" /> 
        </div>
          <div className="flex flex-col">
            <div className="font-medium tracking-tight leading-5">{name}</div>
            <div className="leading-5 tracking-tight">{username}</div>
          </div>
      </div>
    ))}
  </div>
  )
}
export const Testimonials = () => {
  return (
   <section className="bg-white">
    <div className="container">
      <div className="section-description">
        <div className="flex justify-center ">
          <div className="tag mt-6">Testimonials</div>
        </div>
        <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-heading mt-5 font-medium">
            From intuitive design to powerful features, our app has become an essential tool for users around the world.
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <TestimonialsColumn testimonials={firstColumn}/> 
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:flex"/> 
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:flex"/>   
        </div>
    </div>
  </section>
  );
};
