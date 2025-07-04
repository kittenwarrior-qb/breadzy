"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

export default function ProductDetail({ product }: { product: Product }) {
  const [mainImage, setMainImage] = useState(product.image);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Ảnh chính */}
      <div className="md:w-1/2">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full rounded-xl shadow-lg"
        />
        <div className="flex gap-2 mt-4">
          {(product.gallery ?? [product.image]).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                mainImage === img ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-red-500">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
