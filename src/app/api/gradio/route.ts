import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Dynamically import @gradio/client (server-side only)
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("ovi054/image-to-prompt");
    const result = await client.predict("/predict", { image: file });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
