import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'moonshotai/kimi-vl-a3b-thinking:free@preset/thumbnailgpt';

// Helper to convert Blob/File to base64 data URL string with correct MIME type
async function fileToBase64DataUrl(file: Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Only allow supported types
  let mimeType = file.type;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) {
    mimeType = 'image/jpeg';
  }
  return `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
}

// Call OpenRouter for captioning
async function openrouterCaption({ image, caption_type, caption_length, name_input, custom_prompt }: {
  image: Blob,
  caption_type: string,
  caption_length: string,
  name_input: string,
  custom_prompt: string
}) {
  const base64DataUrl = await fileToBase64DataUrl(image);
  const prompt = `You are an expert at analyzing YouTube thumbnails. Given an image, your task is to provide a comprehensive but concise description of the thumbnail, focusing only on what is visually present.\n\nInstructions:\n- Describe the main elements (people, objects, actions, text, etc.) visible in the image.\n- Note the atmosphere and mood (e.g., energetic, dramatic, fun, etc.).\n- Mention specific visual details (colors, composition, lighting, expressions, etc.).\n- Suggest where text or channel branding could be overlaid, if space is available.\n- Do NOT use any non-English words, Chinese characters, or special formatting (no markdown, no bullet points, no numbered lists).\n- Do NOT make assumptions about things not visible in the image.\n- Write in clear, natural English sentences only.\n\nExample Output:\nA chef in a white uniform is preparing golden, crispy fried food at the center of the image, surrounded by smiling people who look excited and engaged. The food is arranged in baskets, and the scene is set in a bright, lively market. The overall mood is energetic and inviting, with warm colors and space at the top for a channel name or video title.\n\nNow, describe the provided image accordingly.`;
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://thumbnailgpt.com',
      'X-Title': 'ThumbnailGPT'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: base64DataUrl } }
          ]
        }
      ],
      max_tokens: 512
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Call OpenRouter for improvement suggestions
async function openrouterImprovements({ description }: { description: string }) {
  const prompt = `Improve this YouTube thumbnail description. Return the response strictly in this format (do NOT add any extra text, only output the JSON object, and make sure it is valid JSON):\n{\n  "summary": "Short explanation of what's good and what needs improvement.",\n  "improvements": [\n    {\n      "title": "Option 1 (Your title here)",\n      "description": "Rewritten thumbnail description here.",\n      "explanation": [\n        "Explain the main improvements and why they work.",\n        "Keep each point short and clear."
      ]\n    },\n    {\n      "title": "Option 2 (Your title here)",\n      "description": "Another rewritten version.",\n      "explanation": [\n        "Different focus or tone from Option 1.",\n        "Highlight strategy behind changes."
      ]\n    },\n    {\n      "title": "Option 3 (Your title here)",\n      "description": "Another alternative version.",\n      "explanation": [\n        "Optional: use a question-based or emotional hook.",\n        "Keep it engaging and direct."
      ]\n    }\n  ],\n  "tips": [\n    "Keep text short and eye-catching.",\n    "Use emojis to convey emotion quickly.",\n    "Highlight benefits or create curiosity.",\n    "Make sure thumbnail text has high contrast."
  ]\n}\n\nDescription to improve:  \n${description}`;
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://thumbnailgpt.com',
      'X-Title': 'ThumbnailGPT'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    // Get custom fields or use defaults
    const caption_type = formData.get('caption_type')?.toString() || 'Descriptive';
    const caption_length = formData.get('caption_length')?.toString() || 'any';
    const name_input = formData.get('name_input')?.toString() || 'Person';
    const custom_prompt = formData.get('custom_prompt')?.toString() || 'this is a thumbnail';

    let captionResult = null;
    let improvementResult = null;
    try {
      captionResult = await openrouterCaption({
        image: file as Blob,
        caption_type,
        caption_length,
        name_input,
        custom_prompt
      });
      improvementResult = await openrouterImprovements({ description: captionResult });
    } catch (descErr) {
      console.error('Error in openrouterCaption or openrouterImprovements:', JSON.stringify(descErr, Object.getOwnPropertyNames(descErr)));
      if (!captionResult) captionResult = { error: descErr instanceof Error ? descErr.message : String(descErr), details: descErr };
      if (!improvementResult) improvementResult = { error: descErr instanceof Error ? descErr.message : String(descErr), details: descErr };
    }
    // Return in the same format as before
    return NextResponse.json({ caption: [null, captionResult], improvements: improvementResult });
  } catch (error: any) {
    console.error('Unhandled error in POST /api/analyze-thumbnail:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: error.message || 'Unknown error', details: error }, { status: 500 });
  }
} 