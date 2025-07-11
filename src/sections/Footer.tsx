import logo from "@/assets/logo 2.png"
import Image from "next/image";
import SocialX from "@/assets/social-x.svg"
import SocialInsta from "@/assets/social-insta.svg"
import SocialLinkedIn from "@/assets/social-linkedin.svg"
import SocialPin from "@/assets/social-pin.svg"
import SocialYoutube from "@/assets/social-youtube.svg"

export const Footer = () => {
  return <footer className="bg-black text-[#bcbcbc] text-sm py-10 text-center">
    <div className="container">
      <div className="inline-flex flex-col justify-center items-center relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#ff0000, #ff0000, #980000, #980000))] before:absolute">
        <Image 
          src = {logo}
          alt = "Saas Logo"
          height={40}
          className="relative cursor-pointer"
        />
      </div>
      <div className="w-full flex items-center justify-center">
      <a href="https://www.buymeacoffee.com/saisantoshpal" className="mt-5 w-full flex justify-center items-center" target="_blank" rel="noopener noreferrer">
          <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=saisantoshpal&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee" />
        </a>
      </div>
      
      {/* <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
        <a href="#">About</a>
        <a href="#">Features</a>
        <a href="#">Customers</a>
        <a href="#">Pricing</a>
        <a href="#">Help</a>
        <a href="#">Careers</a>
      </nav>
      <div className="flex justify-center gap-6 mt-6">
        <SocialX />
        <SocialInsta />
        <SocialLinkedIn />
        <SocialPin />
        <SocialYoutube />
      </div> */}
      <p className="mt-6  cursor-pointer">ThumbnailGPT</p>
      <p className='text-sm w-full px-[30px] section-description text-gray-600 italic'>
            World's #1 Free Thumbnail Assistant

        </p>

    </div>
  </footer>;
};
