import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Use Gradio Spaces for segmentation and captioning
const SEGMENTATION_SPACE = 'Xenova/segment-anything-web';
const CAPTIONING_SPACE = 'hysts/image-captioning-with-blip';

async function segmentImage(image: Blob) {
  // Dynamically import @gradio/client (server-side only)
  const { Client } = await import("@gradio/client");
  const client = await Client.connect(SEGMENTATION_SPACE);
  // The API endpoint and input keys may need to be adjusted based on the Space's API
  // Here we assume the endpoint is /predict and input is { image }
  const result = await client.predict("/segment", { image });
  // result.data should contain the segments (e.g., as base64 images or blobs)
  return result.data;
}

async function captionSegment(segment: Blob) {
  const { Client } = await import("@gradio/client");
  const client = await Client.connect(CAPTIONING_SPACE);
  // The API endpoint and input keys may need to be adjusted based on the Space's API
  const result = await client.predict("/caption", { image: segment, text: "" });
  return result.data;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Step 0: Caption the original image
    let imageDescription = null;
    try {
      imageDescription = await captionSegment(file);
    } catch (descErr) {
      imageDescription = { error: descErr instanceof Error ? descErr.message : String(descErr) };
    }

    // Step 1: Segment the image using the segmentation Space
    let segments;
    try {
      segments = await segmentImage(file);
    } catch (segErr) {
      return NextResponse.json({ error: 'Segmentation failed: ' + (segErr instanceof Error ? segErr.message : String(segErr)) }, { status: 500 });
    }

    // Ensure segments is an array
    if (!Array.isArray(segments)) {
      return NextResponse.json({ error: 'Segmentation did not return an array of segments.' }, { status: 500 });
    }

    // Step 2: Caption each segment using the captioning Space
    const captions = [];
    for (const segment of segments) {
      try {
        const caption = await captionSegment(segment);
        captions.push({ segment, caption });
      } catch (capErr) {
        captions.push({ segment, caption: null, error: capErr instanceof Error ? capErr.message : String(capErr) });
      }
    }

    return NextResponse.json({ description: imageDescription, segments: captions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
} 