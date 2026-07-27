import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Ordered fallback list of supported Gemini models. The first one that
// responds successfully is used; this keeps the proxy resilient as Google
// deprecates older model versions.
const MODELS = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

interface RequestBody {
  prompt?: string;
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  console.log(`[gemini-proxy] GEMINI_API_KEY present: ${Boolean(apiKey)}`);
  console.log(
    `[gemini-proxy] key length: ${apiKey ? apiKey.length : 0} chars`,
  );
  console.log(`[gemini-proxy] key prefix: ${apiKey ? apiKey.slice(0, 4) : "none"}`);

  if (!apiKey) {
    return json(
      {
        error:
          "GEMINI_API_KEY is not configured. Set it as a secret on this edge function.",
      },
      503,
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return json({ error: "Prompt is required." }, 400);
  }

  const ai = new GoogleGenAI({ apiKey });

  let lastError: string | null = null;
  let usedModel: string | null = null;

  for (const model of MODELS) {
    try {
      console.log(`[gemini-proxy] trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const text = (response.text ?? "").trim();
      if (!text) {
        console.warn(`[gemini-proxy] model ${model} returned empty content`);
        lastError = `Model ${model} returned no content.`;
        continue;
      }

      usedModel = model;
      console.log(
        `[gemini-proxy] success: ${text.length} chars from model ${model}`,
      );
      return json({ text, model: usedModel }, 200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn(`[gemini-proxy] model ${model} failed: ${message}`);
      lastError = message;
    }
  }

  return json(
    { error: `Failed to reach Gemini: ${lastError ?? "All models failed."}` },
    502,
  );
});
