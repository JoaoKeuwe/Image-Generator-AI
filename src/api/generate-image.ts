import type { NextApiRequest, NextApiResponse } from "next";

const HUGGING_FACE_API = process.env.NEXT_PUBLIC_HUGGING_FACE_API!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN!;

const prompts: { [key: string]: string } = {
  Real: "Create a highly realistic image that resembles the real world, with accurate details and authentic textures. Use vibrant, vibrant colors to bring the scene to life...",
  Surreal:
    "Create a very realistic, yet strange, image of a landscape that changes reality by adding dreamlike elements and exaggerated sizes...",
  Neon: "Create a bold and vibrant composition using bright colors like neon and fluid shapes that escape reality.",
  Anime:
    "Create an anime-style image with a focus on facial expressions, colorful landscapes, and dynamic scenes.",
  Watercolor:
    "Generate a watercolor-style image with soft strokes and flowing colors, capturing the essence of a classic painting.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    description,
    style,
  }: { description: string; style: keyof typeof prompts } = req.body;

  if (!description || !style) {
    return res.status(400).json({ error: "Descrição ou estilo inválidos." });
  }

  try {
    const prompt = `${description}\\n\\n${prompts[style]}`;
    const huggingFaceResponse = await fetch(HUGGING_FACE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!huggingFaceResponse.ok) {
      const errorResponse = await huggingFaceResponse.json();
      throw new Error(errorResponse.error || "Erro na API Hugging Face");
    }

    const huggingFaceResult = await huggingFaceResponse.blob();
    const fileName = `image-${Date.now()}.jpg`;

    const supabaseResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": huggingFaceResult.type,
        },
        body: huggingFaceResult,
      }
    );

    if (!supabaseResponse.ok) {
      throw new Error("Erro ao enviar a imagem para o Supabase");
    }

    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;
    res.status(200).json({ url: imageUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
