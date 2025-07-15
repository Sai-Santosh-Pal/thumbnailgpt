"use client";

import Image from "next/image";
import upload from "../../assets/upload.png"
import { useState } from "react";
// TODO: Add a loading state
export default function HomePage() {
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
          <div className="w-full mt-2">
            <label className="block mb-1">Custom Hugging Face API Key (optional)</label>
            <input type="text" value={customApiKey} onChange={e => setCustomApiKey(e.target.value)} className="w-full border rounded p-1" placeholder="hf_xxx..." />
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
        {description && suggestions && (
          <div className="mb-4">
            <strong>Improvement Suggestions:</strong>
            {(() => {
              let obj;
              // Try to extract JSON from the output, even if surrounded by extra text
              try {
                let str = Array.isArray(suggestions) ? suggestions[0] : suggestions;
                if (typeof str !== 'string') str = JSON.stringify(str);
                // Find the first '{' and last '}' to extract the JSON block
                const firstBrace = str.indexOf('{');
                const lastBrace = str.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                  str = str.substring(firstBrace, lastBrace + 1);
                }
                obj = JSON.parse(str);
              } catch {
                return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f5f5f5', padding: '1em', borderRadius: '8px' }}>{typeof suggestions === 'string' ? suggestions : JSON.stringify(suggestions)}</pre>;
              }
              return (
                <div style={{ background: '#f5f5f5', padding: '1em', borderRadius: '8px' }}>
                  {obj.summary && <div style={{ marginBottom: '1em' }}><strong>Summary:</strong> {obj.summary}</div>}
                  {obj.improvements && (
                    <div style={{ marginBottom: '1em' }}>
                      <strong>Improvement Options:</strong>
                      <ol>
                        {obj.improvements.map((imp: any, idx: number) => (
                          <li key={idx} style={{ marginBottom: '1em' }}>
                            <div><strong>{imp.title}</strong></div>
                            <div><em>{imp.description}</em></div>
                            <ul>
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
                      <ul>
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
  );
}
