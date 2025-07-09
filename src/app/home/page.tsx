"use client";

import Image from "next/image";
import upload from "../../assets/upload.png"
import { useState } from "react";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [enhancements, setEnhancements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setDescription("");
    setEnhancements("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    const res = await fetch("/api/analyze-thumbnail", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setDescription(data.description);
    setEnhancements(data.enhancements);
    setLoading(false);
  };

  return (
    <div className="flex justify-between h-screen p-10 w-full bg-white">
      <div id="left-section" className="rounded-xl flex flex-col justify-center w-[48%] h-full border-[1px] border-black-700 p-10">
        <div id="upload" className="rounded-l mb-10 h-[90%] w-[100%] p-2 border-[1px] border-black-700 flex flex-col justify-center items-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-40 mb-4" />
          ) : (
            <Image src={upload} alt="Upload Icon" width={50}/>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
        </div>
        <div id="buttons" className="rounded-l h-[10%] w-[100%] p-2 flex flex-col justify-center">
          <button className="btn w-50 btn-primary h-10" onClick={handleUpload} disabled={!selectedFile || loading}>
            {loading ? "Analyzing..." : "Analyze Thumbnail"}
          </button>
          <button className="text-xs mt-2 text-grey" disabled>
            Upload your thumbnail for analysis
          </button>
        </div>
      </div>
      <div id="right-section" className="rounded-xl flex flex-col justify-center items-center w-[48%] h-full border-[1px] border-black-700 p-10 ">
        <h1 className="mb-4">Results</h1>
        {description && (
          <div className="mb-4">
            <strong>Description:</strong>
            <p>{description}</p>
          </div>
        )}
        {enhancements && (
          <div>
            <strong>Enhancement Suggestions:</strong>
            <p>{enhancements}</p>
          </div>
        )}
      </div>
    </div>
  );
}
