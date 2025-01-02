/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const HUGGING_FACE_API = process.env.HUGGING_FACE_API!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;
const BEARER_TOKEN = process.env.BEARER_TOKEN!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET!;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    // Fazendo a requisição para Hugging Face
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

    // Fazendo o upload para Supabase
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
    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
