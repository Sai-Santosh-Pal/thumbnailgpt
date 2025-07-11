"use client";

import Image from "next/image";
import upload from "../../assets/upload.png"
import { useState } from "react";
// TODO: Add a loading state
export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [enhancements, setEnhancements] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  // New state for custom fields
  const [captionType, setCaptionType] = useState("Descriptive");
  const [captionLength, setCaptionLength] = useState("any");
  const [nameInput, setNameInput] = useState("Hello!!");
  const [customPrompt, setCustomPrompt] = useState("this is a thumbnail");

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
    // Use placeholder if any field is empty
    const safeCaptionType = captionType.trim() === "" ? "Descriptive" : captionType;
    const safeCaptionLength = captionLength.trim() === "" ? "any" : captionLength;
    const safeNameInput = nameInput.trim() === "" ? "Person" : nameInput;
    const safeCustomPrompt = customPrompt.trim() === "" ? "this is a thumbnail" : customPrompt;
    formData.append("caption_type", safeCaptionType);
    formData.append("caption_length", safeCaptionLength);
    formData.append("name_input", safeNameInput);
    formData.append("custom_prompt", safeCustomPrompt);
    const res = await fetch("/api/analyze-thumbnail", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setDescription(data.caption?.[1] || "");
    setEnhancements("");
    setSuggestions(data.improvements || "");
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
          {/* New input fields for captioning options */}
          <div className="w-full mt-4">
            <label className="block mb-1">Caption Type</label>
            <select value={captionType} onChange={e => setCaptionType(e.target.value)} className="w-full border rounded p-1">
              <option value="Descriptive">Descriptive</option>
              <option value="Funny">Funny</option>
              <option value="Detailed">Detailed</option>
              <option value="Short">Short</option>
              <option value="Long">Long</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="w-full mt-2">
            <label className="block mb-1">Caption Length</label>
            <select value={captionLength} onChange={e => setCaptionLength(e.target.value)} className="w-full border rounded p-1">
              <option value="any">Any</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div className="w-full mt-2">
            <label className="block mb-1">Name Input</label>
            <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full border rounded p-1" />
          </div>
          <div className="w-full mt-2">
            <label className="block mb-1">Custom Prompt</label>
            <input type="text" value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} className="w-full border rounded p-1" />
          </div>
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
        {suggestions && (
          <div className="mb-4">
            <strong>Improvement Suggestions:</strong>
            <p>{typeof suggestions === 'string' ? suggestions : JSON.stringify(suggestions)}</p>
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
