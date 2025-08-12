"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Variant = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  gallery: string[];
};

interface Props {
  categoryslug: string;
  productslug: string;
  variants: Variant[];
  currentVariantSlug: string;
}

export default function GalleryClient({
  categoryslug,
  productslug,
  variants,
  currentVariantSlug,
}: Props) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const current = variants.find((v) => v.slug === currentVariantSlug);
    setSelectedImage(current?.gallery[0] || "");
  }, [currentVariantSlug, variants]);

  const handleImageClick = (variantSlug: string, img: string) => {
    setSelectedImage(img);
    if (variantSlug !== currentVariantSlug) {
      router.push(`/product/${categoryslug}/${productslug}/${variantSlug}`, { scroll: false });
    }  
  };

  return (
    <>
      {selectedImage && (
        <Image
          src={selectedImage}
          width={600}
          height={600}
          alt="Ảnh chính"
          className="w-full aspect-square object-cover border"
          priority
        />
      )}
      <div className="flex gap-3 mt-4 flex-wrap">
        {variants.map((v) =>
          v.gallery.map((img, i) => (
            <Image
               
              key={`${v.slug}-${i}`}
              src={img}
              width={100}
              height={100}
              alt="Thumbnail"
              onClick={() => handleImageClick(v.slug, img)}
              className={`w-24 h-24 object-cover cursor-pointer hover:opacity-80 border ${
                img === selectedImage ? "border-1 border-gray-200" : ""
              }`
            }
            />
          ))
        )}
      </div>
    </>
  );
}
