import Image from "next/image";
import cloudUpload from "@/assets/cloud-upload.png"

export default function HomePage() {
  return (

    <section className="hero">
        <section className="container flex items-center justify-center">
            <div className="m-10">
                <h1 className="section-title">ThumbnailGPT</h1>
                <div className="droparea flex-col items-center text-sm border border-[#222]/10 rounded-lg tracking-tight mt-5 justify-center align-middle">
                    <div className="w-[100%] mt-10 flex justify-center items-center">
                        <Image className="align-center w-[120px] h-[120px] object-position-center"
                            src={cloudUpload} 
                            alt="Cloud Upload"
                        />
                    </div>
                    <h2 className="align-center text-[50px] text-black text-opacity-[0.5] font-semi-bold tracking-tighter">Upload Image</h2>
                </div>
                <div className="w-full flex justify-center items-center">
                    <button className="btn btn-primary bottom-0 mt-5 left-3">
                        Choose File
                    </button>
                </div>
                <div className="hidden">   
                    <input 
                        type="file" 
                        src="cloud-upload.png" 
                        alt="Submit" 
                        width="48" 
                        height="48">
                    </input>
                </div>
            </div>
        </section>
    </section>
  );
}
