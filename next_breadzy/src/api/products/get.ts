import type { Product } from "@/types/product";
import { Pagination } from "@/types/pagination";

interface ProductsResponse {
  data: Product[];
  msg: string;
  pagination: Pagination;
}

interface SingleProductResponse {
  data: Product;
  msg: string;
}

export const getAllProducts = async (
  page = 1,
  pageSize = 10,
  search = "",
  sortBy: "createdAt" | "name" = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<ProductsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    sortBy,
    sortOrder,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const createProduct = async (product: Partial<Product>): Promise<SingleProductResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<SingleProductResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};
