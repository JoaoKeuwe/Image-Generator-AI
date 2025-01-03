import Image from "next/image";
import image1 from "@/images/images-examples/boy.webp";
import image2 from "@/images/images-examples/neon.jpg";
import image3 from "@/images/images-examples/rinoceronte.webp";
import image4 from "@/images/images-examples/girl.webp";
import image5 from "@/images/images-examples/man.webp";
import image6 from "@/images/images-examples/imagem-gerada (5).jpg";
import image7 from "@/images/images-examples/imagem-gerada (6).jpg";
import image8 from "@/images/images-examples/robot.webp";
import image9 from "@/images/images-examples/cat.webp";
import image10 from "@/images/images-examples/woman.jpg";

export const ImagesExample = () => {
  const mockImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];

  return (
    <div className="mock-grid">
      {mockImages.map((src, index) => (
        <div
          key={index}
          className="mock-image"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <Image
            src={src}
            alt={`Mock image ${index + 1}`}
            fill
            className="image"
            priority
          />
        </div>
      ))}
    </div>
  );
};
