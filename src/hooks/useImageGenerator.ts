import { useState } from "react";

const HUGGING_FACE_API = process.env.NEXT_PUBLIC_HUGGING_FACE_API!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN!;

interface GenerateImageParams {
  prompt: string;
}

export const useImageGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async ({ prompt }: GenerateImageParams) => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
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
      setImageUrl(imageUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return { generateImage, imageUrl, loading, error };
};
