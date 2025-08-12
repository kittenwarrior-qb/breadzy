"use client";

import { getVariantsByProductSlug } from "@/api/variants/get";
import GalleryClient from "./components/imageGallery";
import { use, useEffect, useState } from "react";
import { useCartStore } from "@/stores/useCartStore";

interface ParamsType {
  locale: string;
  categoryslug: string;
  productslug: string;
  variantslug: string;
}

interface Props {
  params: Promise<ParamsType>;
}

export default function ProductDetailPage({ params }: Props) {
  // unwrap promise params
  const resolvedParams = use(params);
  const { categoryslug, productslug, variantslug } = resolvedParams;

  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchVariants() {
      try {
        const variantResponse = await getVariantsByProductSlug(productslug);
        setVariants(variantResponse.data || []);
      } catch (err) {
        console.error("Lỗi khi tải biến thể:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVariants();
  }, [productslug]);

  if (loading) return <p>Đang tải...</p>;

  const current = variants.find((v) => v.slug === variantslug);

  if (!current) {
    return <p>Biến thể không tồn tại.</p>;
  }

  const handleAddToCart = () => {
    addToCart({
      _id: current._id,
      name: current.name,
      slug: current.slug,
      price: current.price,
      quantity: 1,
      image: current.gallery[0],
    });
  };

  return (
    <section className="max-w-[1280px] mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <GalleryClient
            categoryslug={categoryslug}
            productslug={productslug}
            variants={variants}
            currentVariantSlug={current.slug}
          />
        </div>

        <div className="md:col-span-5">
          <h1 className="text-2xl font-bold mb-3">{current.name}</h1>
          <p className="text-red-600 text-xl mb-5">
            {current.price.toLocaleString()} đ
          </p>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Chọn biến thể:</label>
            <div className="flex flex-wrap gap-3">
              {variants.map((v) => (
                <a
                  key={v._id}
                  href={`/product/${categoryslug}/${productslug}/${v.slug}`}
                  className={`px-4 py-2 rounded border ${
                    v.slug === current.slug
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {v.name}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black border-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </section>
  );
}
