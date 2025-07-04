import axios from "@/lib/axios";
import type { Product } from "@/types/product";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const res = await axios.get<{ data: Product[] }>("/products");
    return res.data.data;
  } catch (err) {
    console.error("Lỗi fetch sản phẩm:", err);
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const res = await axios.get<{ data: Product }>(`/products/${slug}`);
    return res.data.data;
  } catch (err) {
    console.error("Lỗi fetch sản phẩm theo slug:", err);
    return {
      _id: "",
      name: "",
      slug: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      ishot: false,
      createdAt: "",
    };
  }
}

