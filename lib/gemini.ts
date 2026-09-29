/**
 * Gemini vision helpers for admin product SEO from images.
 * API key must live in GEMINI_API_KEY (never commit).
 */

export type ProductCategory =
  | "flowers"
  | "hampers"
  | "teddy"
  | "wines"
  | "chocolates"
  | "cards";

export type GeminiProductSuggestion = {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ProductCategory;
  tags: string[];
  included_items: Array<{ name: string; qty: number; note?: string }>;
};

const CATEGORIES: ProductCategory[] = [
  "flowers",
  "hampers",
  "teddy",
  "wines",
  "chocolates",
  "cards",
];

/** Prefer lite (more available); fall back to flash family when overloaded. */
const MODEL_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-flash-lite-latest",
];

const SEO_PROMPT = `You are an expert SEO copywriter for The Stems Flowers, a florist and gift shop in Nairobi CBD, Kenya (same-day delivery across Nairobi).

Analyze this product photo carefully. Capture everything visible: flower types/colors, wrapping, chocolates, teddy, wine, cards, ribbons, box style, quantity cues, and gift occasion vibe.

Return ONLY valid JSON (no markdown) with these keys:
- title: catchy product name, max 80 chars, include key flower/gift words buyers search
- slug: kebab-case from title, lowercase letters/numbers/hyphens only
- short_description: max 160 chars, SEO meta-style, mention Nairobi delivery when natural
- description: 2-4 sentences, SEO-rich, what the gift includes, occasions (birthday, anniversary, apology, love), and that The Stems delivers in Nairobi
- category: exactly one of flowers, hampers, teddy, wines, chocolates, cards (pick best primary; bouquet+chocolates → flowers; mixed gift box → hampers; stuffed bear → teddy)
- tags: 3-6 lowercase occasion/style tags (e.g. birthday, roses, red, romantic, apology, graduation)
- included_items: array of {name, qty} for clearly visible separate items (chocolates box, teddy, wine, card). Empty array if just a single bouquet/item.`;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeSuggestion(raw: unknown): GeminiProductSuggestion {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const title =
    typeof obj.title === "string" && obj.title.trim()
      ? obj.title.trim().slice(0, 80)
      : "Gift from The Stems Nairobi";

  let slug =
    typeof obj.slug === "string" && /^[a-z0-9-]+$/.test(obj.slug)
      ? obj.slug.slice(0, 80)
      : slugify(title);
  if (!slug) slug = `gift-${Date.now()}`;

  const short_description =
    typeof obj.short_description === "string" && obj.short_description.trim()
      ? obj.short_description.trim().slice(0, 160)
      : `${title} — same-day flower & gift delivery in Nairobi from The Stems.`;

  const description =
    typeof obj.description === "string" && obj.description.trim()
      ? obj.description.trim()
      : `${title}. Beautifully prepared by The Stems Flowers for same-day delivery across Nairobi. Perfect for birthdays, anniversaries, and thoughtful gifts.`;

  const categoryRaw = String(obj.category || "flowers").toLowerCase();
  const category = (CATEGORIES.includes(categoryRaw as ProductCategory)
    ? categoryRaw
    : "flowers") as ProductCategory;

  const tags = Array.isArray(obj.tags)
    ? obj.tags
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
        .slice(0, 8)
    : [];

  const included_items: GeminiProductSuggestion["included_items"] = [];
  if (Array.isArray(obj.included_items)) {
    for (const item of obj.included_items) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const name = typeof rec.name === "string" ? rec.name.trim() : "";
      if (!name) continue;
      const rawQty = rec.qty;
      const qtyNum =
        typeof rawQty === "number"
          ? rawQty
          : typeof rawQty === "string"
            ? Number(rawQty)
            : 1;
      const qty =
        Number.isFinite(qtyNum) && qtyNum > 0 ? Math.round(qtyNum) : 1;
      const note = typeof rec.note === "string" ? rec.note.trim() : undefined;
      included_items.push(note ? { name, qty, note } : { name, qty });
    }
  }

  return {
    title,
    slug,
    short_description,
    description,
    category,
    tags,
    included_items,
  };
}

async function callGeminiModel(
  model: string,
  apiKey: string,
  mimeType: string,
  base64: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          { text: SEO_PROMPT },
          { inline_data: { mime_type: mimeType, data: base64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Gemini ${model} HTTP ${res.status}: ${text.slice(0, 400)}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }

  const data = JSON.parse(text) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const partText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!partText) {
    throw new Error(`Gemini ${model} returned empty content`);
  }
  return partText;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Describe a product image with Gemini and return SEO-ready fields.
 */
export async function describeProductImage(
  imageBuffer: Buffer,
  mimeType = "image/jpeg"
): Promise<GeminiProductSuggestion> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const base64 = imageBuffer.toString("base64");
  let lastError: Error | null = null;

  for (const model of MODEL_CANDIDATES) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const rawText = await callGeminiModel(model, apiKey, mimeType, base64);
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const match = rawText.match(/\{[\s\S]*\}/);
          if (!match) throw new Error("Could not parse Gemini JSON");
          parsed = JSON.parse(match[0]);
        }
        return normalizeSuggestion(parsed);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        const status = (e as Error & { status?: number }).status;
        // Retry on overload / rate limit
        if (status === 503 || status === 429) {
          await sleep(800 * (attempt + 1));
          continue;
        }
        // Try next model on 404 / unavailable model
        if (status === 404) break;
        await sleep(400 * (attempt + 1));
      }
    }
  }

  throw lastError || new Error("Gemini describe failed");
}
