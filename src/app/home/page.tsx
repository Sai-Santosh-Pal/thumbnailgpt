"use client";

import Image from "next/image";
import upload from "../../assets/upload.png"
import { useState } from "react";
// TODO: Add a loading state
export default function HomePage() {
  console.log("HomePage component rendered");
  // Only keep file and customApiKey state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [enhancements, setEnhancements] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    console.log("Upload clicked");
    if (!selectedFile) return;
    setLoading(true);
    setDescription("");
    setEnhancements("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    // Use only default values
    formData.append("caption_type", "Descriptive");
    formData.append("caption_length", "long");
    formData.append("name_input", "Person");
    formData.append("custom_prompt", "this is a thumbnail");
    if (customApiKey.trim() !== "") {
      formData.append("custom_api_key", customApiKey.trim());
    }
    const res = await fetch("/api/analyze-thumbnail", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("API response", data);
    setDescription(data.caption?.[1] || "");
    setEnhancements("");
    setSuggestions(data.improvements || "");
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-gradient-to-br from-gray-50 to-[#f0484e0d] p-2 md:p-8">
      {/* Left Card */}
      <div id="left-section" className="bg-white shadow-xl rounded-2xl flex flex-col justify-center w-full md:w-[45%] max-w-xl mx-auto md:mx-0 h-auto md:h-full border border-gray-200 p-6 md:p-10 mb-8 md:mb-0 transition-all">
        <div id="upload" className="rounded-xl mb-8 h-auto w-full p-4 border border-dashed" style={{ borderColor: '#f0484e' }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-56 w-auto mb-4 rounded-lg shadow-md object-contain" />
          ) : (
            <Image src={upload} alt="Upload Icon" width={60} className="mb-4 opacity-70" />
          )}
          <label className="w-full flex flex-col items-center cursor-pointer">
            <span className="text-sm text-gray-600 mb-1 font-medium">Choose File</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="text-xs text-gray-500 mt-1">{selectedFile ? selectedFile.name : "No file selected"}</span>
          </label>
        </div>
        <div id="buttons" className="rounded-xl w-full flex flex-col items-center">
          <button
            className="w-full md:w-2/3 text-white font-semibold rounded-lg py-3 transition-all duration-150 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#f0484e' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#d93a3f')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#f0484e')}
            onClick={handleUpload}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Analyzing...</span>
            ) : (
              "Analyze Thumbnail"
            )}
          </button>
          <span className="text-xs mt-3 text-gray-400">Upload your thumbnail for analysis</span>
        </div>
      </div>
      {/* Right Card */}
      <div id="right-section" className="bg-white shadow-xl rounded-2xl flex flex-col justify-start items-center w-full md:w-[55%] max-w-2xl mx-auto md:mx-4 h-auto md:h-full border border-gray-200 p-6 md:p-10 transition-all">
        <h1 className="mb-6 text-xl md:text-2xl font-bold" style={{ color: '#f0484e' }}>Results</h1>
        <div className="w-full max-h-[500px] overflow-y-auto">
          {description && (
            <div className="mb-6" style={{ background: '#f0484e0d' }}>
              <div className="p-5 rounded-xl shadow-sm">
                <strong className="text-lg" style={{ color: '#f0484e' }}>Description:</strong>
                <div className="mt-2 mb-2 leading-relaxed break-words text-gray-800 text-base">{description}</div>
              </div>
            </div>
          )}
          {description && suggestions && (
            <div className="mb-6" style={{ background: '#f0484e0d' }}>
              <div className="p-5 rounded-xl shadow-sm">
                <strong className="text-lg" style={{ color: '#f0484e' }}>Improvement Suggestions:</strong>
                {(() => {
                  let obj;
                  try {
                    obj = typeof suggestions === 'string' ? JSON.parse(suggestions) : suggestions;
                  } catch {
                    return (
                      <div className="mt-2 whitespace-pre-wrap break-words text-gray-700">{suggestions}</div>
                    );
                  }
                  return (
                    <div className="mt-2">
                      {obj.summary && <div className="mb-4"><strong>Summary:</strong> <span className="font-normal">{obj.summary}</span></div>}
                      {obj.improvements && (
                        <div className="mb-4">
                          <strong>Improvement Options:</strong>
                          <ol className="pl-5 list-decimal">
                            {obj.improvements.map((imp: any, idx: number) => (
                              <li key={idx} className="mb-4">
                                <div><strong>{imp.title}</strong></div>
                                <div className="italic mb-2 text-gray-700">{imp.description}</div>
                                <ul className="ml-4 list-disc text-gray-600">
                                  {imp.explanation && imp.explanation.map((exp: any, i: number) => (
                                    <li key={i}>{exp}</li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {obj.tips && (
                        <div>
                          <strong>Tips:</strong>
                          <ul className="ml-4 list-[circle] text-gray-600">
                            {obj.tips.map((tip: any, i: number) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          {enhancements && (
            <div className="p-4 rounded-xl shadow-sm" style={{ background: '#f0484e0d' }}>
              <strong style={{ color: '#f0484e' }}>Enhancement Suggestions:</strong>
              <p>{enhancements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
