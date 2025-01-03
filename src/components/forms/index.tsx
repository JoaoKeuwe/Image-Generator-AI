"use client";
import { useImageGenerator } from "@/hooks/useImageGenerator";
import Image from "next/image";
import { useState } from "react";
import Loading from "@/components/loading";
import { ImagesExample } from "@/components/images-example";

const prompts: { [key: string]: string } = {
  Real: "Create a highly realistic image that resembles the real world, with accurate details and authentic textures. Use vibrant, vibrant colors to bring the scene to life. The composition should be balanced and visually appealing. Include elements that highlight natural beauty, such as lush landscapes, bright lights, or objects with rich colors. Make sure the lighting enhances the colors and creates depth, providing a sense of immersion.",
  Surreal:
    "Create a very realistic, yet strange, image of a landscape that changes reality by adding dreamlike elements and exaggerated sizes. Use bright, almost neon-like colors and focus on creating a sense of wonder, fun, and fantasy.",
  Neon: "Create a bold and vibrant composition using bright colors like neon and fluid shapes that escape reality.",
  Anime:
    "Create an anime-style image with a focus on facial expressions, colorful landscapes, and dynamic scenes.",
  Aquarela:
    "Generate a watercolor-style image with soft strokes and flowing colors, capturing the essence of a classic painting.",
};

export const Form = () => {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<keyof typeof prompts>("Real");
  const { generateImage, imageUrl, loading, error } = useImageGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `${description}\n\n${prompts[style]}`;
    await generateImage({ prompt });
  };

  const handleDownload = async () => {
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "imagem-gerada.jpg";
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="form-box">
          <h1>Gerador de Imagens com IA</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a imagem (preferencialmente em inglês)"
                required
              />
            </div>
            <div className="controls">
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <label htmlFor="" style={{fontWeight: 'bold'}}>Selecione o tipo da imagem</label>

                <select
                  style={{width: '100%'}}
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value as keyof typeof prompts)
                }
              >
                {Object.keys(prompts).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Gerando..." : "Gerar Imagem"}
              </button>
            </div>
          </form>
        </div>

        <div className="image-area">
          {error && (
            <div className="error-message" style={{ color: "red" }}>
              tente gerar a imagem novamente <br /> Erro: {error}
            </div>
          )}

          {loading && (
            <div className="loading-wrapper">
              <Loading />
            </div>
          )}

          {!imageUrl && !loading && <ImagesExample />}

          {imageUrl && (
            <div className="generated-image-wrapper">
              <div className="generated-image">
                <Image
                  src={imageUrl}
                  alt="Imagem gerada"
                  fill
                  className="image"
                />
              </div>
              <button onClick={handleDownload} className="download-button">
                Baixar Imagem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
