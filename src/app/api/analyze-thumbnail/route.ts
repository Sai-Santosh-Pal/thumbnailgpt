import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CAPTIONING_SPACE = 'fancyfeast/joy-caption-alpha-two';
const IMPROVEMENT_SPACE = 'huggingface-projects/gemma-3n-E4B-it';

async function joyCaptionImage({ image, caption_type, caption_length, name_input, custom_prompt }: {
  image: Blob,
  caption_type: string,
  caption_length: string,
  name_input: string,
  custom_prompt: string
}) {
  const { Client } = await import("@gradio/client");
  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
  const client = await Client.connect(CAPTIONING_SPACE, {
    hf_token: hfToken as `hf_${string}`,
  });
  const result = await client.predict("/stream_chat", {
    input_image: image,
    caption_type,
    caption_length,
    name_input,
    custom_prompt
  });
  return result.data;
}

async function getImprovements({ image, description }: { image: Blob, description: string }) {
  const { Client } = await import("@gradio/client");
  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
  const client = await Client.connect(IMPROVEMENT_SPACE, {
    hf_token: hfToken as `hf_${string}`,
  });
  const result = await client.predict("/chat", {
    message: {
      text: `This is the description of the image: ${description}\nWhat could be improved about this thumbnail?`,
      files: [image]
    },
    system_prompt: "You are a helpful assistant that gives suggestions for improving YouTube thumbnails.",
    max_new_tokens: 200
  });
  return result.data;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Get custom fields or use defaults
    const caption_type = formData.get("caption_type")?.toString() || "Descriptive";
    const caption_length = formData.get("caption_length")?.toString() || "any";
    const name_input = formData.get("name_input")?.toString() || "Person";
    const custom_prompt = formData.get("custom_prompt")?.toString() || "this is a thumbnail";

    let captionResult = null;
    let improvementResult = null;
    try {
      captionResult = await joyCaptionImage({
        image: file,
        caption_type,
        caption_length,
        name_input,
        custom_prompt
      });
      // Use the caption as the description for the improvement model
      const description = Array.isArray(captionResult) ? captionResult[1] : String(captionResult);
      // Ensure the file is a Blob with a name and type property for Gradio
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = (file as any).name || 'thumbnail.png';
      const mimeType = (file as any).type || 'image/png';
      const fileForGradio = new Blob([buffer], { type: mimeType });
      (fileForGradio as any).name = fileName;
      improvementResult = await getImprovements({ image: fileForGradio, description });
    } catch (descErr) {
      console.error('Error in joyCaptionImage or getImprovements:', descErr);
      if (!captionResult) captionResult = { error: descErr instanceof Error ? descErr.message : String(descErr) };
      if (!improvementResult) improvementResult = { error: descErr instanceof Error ? descErr.message : String(descErr) };
    }

    return NextResponse.json({ caption: captionResult, improvements: improvementResult });
  } catch (error: any) {
    console.error('Unhandled error in POST /api/analyze-thumbnail:', error, error?.stack);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
} 