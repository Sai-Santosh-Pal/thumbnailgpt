"use client";

import Image from "next/image";
import upload from "../../assets/upload.svg"

export default function HomePage() {
  return (
    <div className="flex justify-between h-screen p-10 w-full bg-white">
      <div id="left-section" className="rounded-xl flex flex-col justify-center w-[48%] h-full border-[1px] border-black-700 p-10">
        <div id="upload" className="rounded-l mb-10 h-[90%] w-[100%] p-2 border-[1px] border-black-700">
          <Image src={upload} alt="Star Image" width={360} />
        </div>
        <div id="buttons" className="rounded-l h-[10%] w-[100%] p-2 flex flex-col justify-center">
          <button className="btn w-50 btn-primary h-10">Choose Thumbnail</button>
          <button className="text-xs mt-2 text-grey">Upload your thumbnail for analysis</button>
        </div>
      </div>
      <div id="right-section" className="rounded-xl flex flex-col justify-center items-center w-[48%] h-full border-[1px] border-black-700 p-10 ">
        <h1>Right</h1>
      </div>
    </div>

  );
}
