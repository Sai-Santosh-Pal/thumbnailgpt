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
          <button
            className="btn w-50 btn-primary h-10"
            onClick={() => { console.log("Button clicked"); handleUpload(); }}
            disabled={!selectedFile || loading}
          >
            {loading ? "Analyzing..." : "Analyze Thumbnail"}
          </button>
          <button className="text-xs mt-2 text-grey" disabled>
            Upload your thumbnail for analysis
          </button>
        </div>
      </div>
      <div id="right-section" className="rounded-xl flex flex-col justify-center items-center w-[48%] h-full border-[1px] border-black-700 p-10 ">
        <h1 className="mb-4">Results</h1>
        <div style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
          {description && (
            <div className="mb-4" style={{ background: '#f5f5f5', padding: '1em', borderRadius: '8px' }}>
              <strong style={{ fontSize: '1.1em' }}>Description:</strong>
              <div style={{ marginTop: '0.5em', marginBottom: '0.5em', lineHeight: 1.6 }}>{description}</div>
            </div>
          )}
          {description && suggestions && (
            <div className="mb-4" style={{ background: '#f5f5f5', padding: '1em', borderRadius: '8px' }}>
              <strong style={{ fontSize: '1.1em' }}>Improvement Suggestions:</strong>
              {(() => {
                let obj;
                try {
                  obj = typeof suggestions === 'string' ? JSON.parse(suggestions) : suggestions;
                } catch {
                  return (
                    <div style={{ marginTop: '0.5em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{suggestions}</div>
                  );
                }
                return (
                  <div style={{ marginTop: '0.5em' }}>
                    {obj.summary && <div style={{ marginBottom: '1em' }}><strong>Summary:</strong> <span style={{ fontWeight: 400 }}>{obj.summary}</span></div>}
                    {obj.improvements && (
                      <div style={{ marginBottom: '1em' }}>
                        <strong>Improvement Options:</strong>
                        <ol style={{ paddingLeft: '1.2em' }}>
                          {obj.improvements.map((imp: any, idx: number) => (
                            <li key={idx} style={{ marginBottom: '1em' }}>
                              <div><strong>{imp.title}</strong></div>
                              <div style={{ fontStyle: 'italic', marginBottom: '0.5em' }}>{imp.description}</div>
                              <ul style={{ marginLeft: '1em', listStyle: 'disc' }}>
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
                        <ul style={{ marginLeft: '1em', listStyle: 'circle' }}>
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
          )}
          {enhancements && (
            <div>
              <strong>Enhancement Suggestions:</strong>
              <p>{enhancements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
