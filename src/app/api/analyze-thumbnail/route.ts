import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CAPTIONING_SPACE = 'fancyfeast/joy-caption-alpha-two';
const IMPROVEMENT_SPACE = 'huggingface-projects/llama-2-13b-chat';

async function joyCaptionImage({ image, caption_type, caption_length, name_input, custom_prompt, api_key }: {
  image: Blob,
  caption_type: string,
  caption_length: string,
  name_input: string,
  custom_prompt: string,
  api_key?: string
}) {
  const { Client } = await import("@gradio/client");
  const hfToken = api_key || process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) throw new Error('HUGGINGFACE_API_KEY is not set in environment variables and no custom key provided');
  if (!(image instanceof Blob) || image.size === 0) {
    throw new Error('Input image is not a valid Blob or is empty.');
  }
  try {
    const client = await Client.connect(CAPTIONING_SPACE, {
      hf_token: hfToken as `hf_${string}`,
    });
    const result = await client.predict("/stream_chat", {
      input_image: image,
      caption_type,
      caption_length,
      extra_options: [],
      name_input,
      custom_prompt
    });
    return result.data;
  } catch (err) {
    console.error('Gradio client error in joyCaptionImage:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    throw err;
  }
}

async function getImprovements({ description, api_key }: { description: string, api_key?: string }) {
  const { Client } = await import("@gradio/client");
  const hfToken = api_key || process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) throw new Error('HUGGINGFACE_API_KEY is not set in environment variables and no custom key provided');

  const client = await Client.connect(IMPROVEMENT_SPACE, {
    hf_token: hfToken as `hf_${string}`,
  });
  const prompt = `Improve this YouTube thumbnail description. Return the response strictly in this format (do NOT add any extra text, only output the JSON object, and make sure it is valid JSON):
{
  "summary": "Short explanation of what's good and what needs improvement.",
  "improvements": [
    {
      "title": "Option 1 (Your title here)",
      "description": "Rewritten thumbnail description here.",
      "explanation": [
        "Explain the main improvements and why they work.",
        "Keep each point short and clear."
      ]
    },
    {
      "title": "Option 2 (Your title here)",
      "description": "Another rewritten version.",
      "explanation": [
        "Different focus or tone from Option 1.",
        "Highlight strategy behind changes."
      ]
    },
    {
      "title": "Option 3 (Your title here)",
      "description": "Another alternative version.",
      "explanation": [
        "Optional: use a question-based or emotional hook.",
        "Keep it engaging and direct."
      ]
    }
  ],
  "tips": [
    "Keep text short and eye-catching.",
    "Use emojis to convey emotion quickly.",
    "Highlight benefits or create curiosity.",
    "Make sure thumbnail text has high contrast."
  ]
}

Description to improve:  
${description}`;
  const result = await client.predict("/chat", {
    message: prompt,
    param_2: "You are a helpful assistant.",
    param_3: 1024,
    param_4: 0.6,
    param_5: 0.9,
    param_6: 50,
    param_7: 1.2
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
    const custom_api_key = formData.get("custom_api_key")?.toString();

    let captionResult = null;
    let improvementResult = null;
    try {
      captionResult = await joyCaptionImage({
        image: file,
        caption_type,
        caption_length,
        name_input,
        custom_prompt,
        api_key: custom_api_key
      });
      // Use the caption as the description for the improvement model
      const description = Array.isArray(captionResult) ? captionResult[1] : String(captionResult);
      improvementResult = await getImprovements({ description, api_key: custom_api_key });
    } catch (descErr) {
      console.error('Error in joyCaptionImage or getImprovements:', JSON.stringify(descErr, Object.getOwnPropertyNames(descErr)));
      if (!captionResult) captionResult = { error: descErr instanceof Error ? descErr.message : String(descErr), details: descErr };
      if (!improvementResult) improvementResult = { error: descErr instanceof Error ? descErr.message : String(descErr), details: descErr };
    }

    return NextResponse.json({ caption: captionResult, improvements: improvementResult });
  } catch (error: any) {
    console.error('Unhandled error in POST /api/analyze-thumbnail:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: error.message || "Unknown error", details: error }, { status: 500 });
  }
} 